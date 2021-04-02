/**
 * Date:2020/5/21
 * Desc:
 */
const {spawn} = require("child_process");

const sleep = e => new Promise(t => setTimeout(t, e));
const waitUntil = async (callback, options = {ms: 1000, retryTime: 10}) => {
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

const spawnAsync = (...options)=> {
    let data = '';
    let error = '';

    const doSpawn = spawn(...options);

    doSpawn.stdout.on('data', d => {
        data += d;
    });

    doSpawn.stderr.on('data', e => {
        error += e;
    });

    return new Promise((resolve, reject) => {
        doSpawn.on('error', reject);
        doSpawn.on('close', code => {
            if (code === 0) {
                resolve(data.toString());
            } else {
                const _error = new Error(`child exited with code ${code}`);
                _error.code = code;
                _error.stderr = error.toString();
                reject(_error);
            }
        })
    })
}


module.exports = {
    sleep,
    genTraceId,
    uuid,
    waitUntil,
    spawnAsync
};
