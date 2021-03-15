/**
 * Date:2020/5/21
 * Desc:
 */
const sleep = e => new Promise(t => setTimeout(t, e));
const waitUtil = async (callback, options = {ms: 1000, retryTime: 10}) => {
    let retryTime = 0;
    const fn = async () => {
        let waitResult = callback();
        if (waitResult) {
            return true;
        } else {
            if (retryTime !== options.retryTime) {
                retryTime++;

                await sleep(options.ms);
                return await fn();
            } else {
                return false;
            }
        }
    };

    return await fn();
};

const uuid = (e = 6) => {
    if (e < 2) throw new RangeError("n is not less than 2");
    const t = "abcdefghigklmnopqrstuvwxyz";
    let r = "";
    for (let t = 0; t < e - 2; t++) r += "z";
    return `xx${r}`.replace(/[xz]/g, e => "x" === e ? t[26 * Math.random() | 0] : "abcdefghigklmnopqrstuvwxyz0123456789"[36 * Math.random() | 0])
};
let traceIdIndex = 1000;


const genTraceId = () => {
    if (traceIdIndex >= 9000) {
        traceIdIndex = 1000;
    }

    return `${uuid(8)}${Date.now()}${traceIdIndex++}`
}


module.exports = {
    sleep,
    genTraceId,
    uuid,
    waitUtil
};
