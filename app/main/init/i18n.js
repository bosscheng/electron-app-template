/**
 * Date:2020/5/21
 * Desc:
 */
const en = require('../locales/en-US');

// 匹配一个单字字符（字母、数字或者下划线）。等价于 [A-Za-z0-9_]。
const interpolate_reg = /\{(\w*)\}/g;

// replace data
const replaceData = (key, lang) => {
    return key.replace(interpolate_reg, value => {
        const tempKey = value.slice(1, value.length - 1);
        return lang[tempKey] ? lang[tempKey] : key;
    })
};


module.exports = (app => {
    app.logger.info('init i18n');
    // 绑定 t 方法。
    app.t = ((title, lang = {}) => {
        if (app.locale.startsWith('zh')) {
            return replaceData(title, lang);
        }
        const enLang = en[title];
        return enLang ? replaceData(enLang, lang) : title;
    })
});
