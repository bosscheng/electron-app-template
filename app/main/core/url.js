/**
 * Date:2020/5/22
 * Desc:
 */
const url = require('url');
const path = require('path');
const {WEBPACK_DEV_SERVER_PORT: port} = process.env;


module.exports = (app => {
    app.getLoadingURL = () => {
        let pathname = path.join(__dirname, '../../../build/renderer/loading.html');

        if (app.isDev) {
            pathname = path.join(__dirname, '../../renderer/loading.html');
        }

        return url.format({
            pathname: pathname,
            protocol: 'file:'
        })
    };


    app.getResourceURL = (hash) => {
        if (app.isDev) {
            return url.format({
                port: port,
                hostname: "localhost",
                protocol: 'http',
                slashes: true,
                hash: hash,
                query: {
                    locale: app.locale
                }
            })
        } else {
            const distDir = path.join(__dirname, '../../../build');
            return url.format({
                pathname: path.join(distDir, './renderer/html/index.html'),
                protocol: 'file:',
                slashes: true,
                hash: hash,
                query: {
                    locale: app.locale
                }
            })
        }
    };


    app.getApiURL = (url, host) => {
        const {host: defaultHost} = app.config || {};
        return `${host || defaultHost}${url}`
    }

});
