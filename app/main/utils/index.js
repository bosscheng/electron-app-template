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
}


module.exports = {
    sleep,
    waitUtil
};
