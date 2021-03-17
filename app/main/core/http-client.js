/**
 * Date:2020/5/21
 * Desc:
 */
const os = require('os');
const urllib = require('urllib');
const Agent = require('agentkeepalive');
const {HttpsAgent} = require('agentkeepalive');
const {electron: electronVersion} = process.versions;


const config = {
    defaultArgs: {
        timeout: 30000,
        dataType: 'json',
        followRedirect: true
    },
    httpAgent: {
        keepAlive: true,
        freeSocketTimeout: 20000,
        maxSockets: Number.MAX_SAFE_INTEGER,
        maxFreeSockets: 256
    },
    httpsAgent: {
        keepAlive: true,
        freeSocketTimeout: 20000,
        maxSockets: Number.MAX_SAFE_INTEGER,
        maxFreeSockets: 256
    }
};


class HttpClient extends urllib.HttpClient2 {
    constructor(app) {
        const {pkg} = app.config;
        super({
            defaultArgs: config.defaultArgs,
            agent: new Agent(config.httpAgent),
            httpsAgent: new HttpsAgent(config.httpsAgent)
        });

        this.app = app;
        this.logger = app.getLogger('httpClientLogger');
        this.UA = `${pkg.name}/${pkg.version};electron/${electronVersion};${encodeURIComponent(os.hostname())};${urllib.USER_AGENT}`;
    }

    async request(url, options = {}) {
        const {app} = this;
        const ctx = options.ctx || {};
        const {host} = app.config || '';

        let request;

        // update headers
        options.headers = {
            "Content-Type": "application/json",
            referer: host,
            "user-agent": `${this.UA}${ctx.tracert ? ctx.tracert.traceId : ""}`,
            ...options.headers
        };
        const nowDate = Date.now();
        let error;
        try {
            return request = await super.request(url, options);
        } catch (e) {
            error = e;
            error.name = 'httpError';
            error.url = url;
            throw error;
        } finally {
            // 一次请求的时间差
            const timestamp = Date.now() - nowDate;
            const {currentUser} = ctx;
            // logger 日志记录
            this.logger.info(timestamp);

            if (!options.disableLogger) {
                this.logger.info([url, options.method, request && request.status, error && error.message, currentUser && currentUser.id, request && request.headers && request.headers["content-length"], this._hideContent(options.data), request && request.headers && request.headers['request-id'], ctx && ctx.tracert && ctx.tracert.traceId].join("^"));
            }
        }
    }

    _hideContent(params = {}) {
        const obj = Object.assign({}, params);
        ["title", "body_asl", "body_html", "body_draft_asl", "content", "body", "body_draft"].forEach((i) => {
            if (obj[i]) {
                obj[i] = `<string ${obj[i].length}>`
            }
        });

        return JSON.stringify(obj);
    }
}

module.exports = (app => {
    app.logger.info('init http client');
    app.httpClient = new HttpClient(app);
})
