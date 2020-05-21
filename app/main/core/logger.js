/**
 * Date:2020/5/20
 * Desc: 主要依赖 winston 实现本地日志。
 */

const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const Transport = require('winston-transport');
const {app: electronApp} = require('electron');
const {format} = winston;


module.exports = (app => {
    const logger = function (options = {}) {
        return () => {
            const logDir = options.logDir || path.join(options.debug ? process.cwd() : electronApp.getPath('userData'), 'logs');

            const transportList = [
                new winston.transports.DailyRotateFile({
                    dirname: path.join(logDir, options.name),
                    filename: `${options.filename || options.name}-%DATE%.log`,
                    maxSize: '15m',
                    maxFiles: 7,
                    createSymlink: true,
                    symlinkName: `${options.symlinkName || options.name}.log`
                }),
                new class extends Transport {
                    constructor(props) {
                        super(props);
                        this.options = props;
                    }

                    log(options = {}, callback) {
                        if (process.env.DISABLE_LOG_REMOTE) {
                            return;
                        }

                        const data = {
                            type: this.options.name,
                            message: `${options.timestamp} ${options.message}`
                        };

                        const url = '/electron/log';

                        // request
                        app.httpClient.request(url, {
                            method: 'POST',
                            contentType: "json",
                            data: data,
                            disableLogger: true,
                        }).catch(() => {

                        });

                        callback(null, true);
                    }
                }(options)
            ];

            if (process.env.CONSOLE_LOGGER) {
                transportList.push(new winston.transports.Console);
            }

            return new winston.createLogger({
                format: format.combine(
                    format.label({label: options.name}),
                    format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
                    format.splat(),
                    format.simple(),
                    format.printf(({level, timestamp, message, label}) => {
                        const {tracert = {}, currentUser = {}} = options.currentContext || {};
                        return [timestamp, level.toUpperCase(), `[${label}]`, tracert.traceId, currentUser.id, message].join("^")
                    })
                ),
                transports: transportList
            })
        }
    };

    app.electronLogger = logger({
        name: "electron",
        symlinkName: 'app'
    });
    app.httpClientLogger = logger({name: 'http-client'});
    app.webLogger = logger({name: "web"});
});
