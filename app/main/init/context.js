/**
 * Date:2020/5/21
 * Desc:
 */

const {genTraceId} = require('../utils');

class Context {
    constructor(app) {
        this.app = app;
        this.tracert = {
            traceId: genTraceId()
        };
        this.currentUser = app.currentUser;
    }

    // 请求
    async curl(url, options = {}) {
        const {ctx, app} = this;
        options.ctx = ctx;
        await app.httpClient.request(url, options);
    }
}
