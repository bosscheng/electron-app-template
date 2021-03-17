/**
 * Date:2020/5/25
 * Desc:
 */

const {globalShortcut} = require("electron");

module.exports = (app => {
    app.logger.info('init shortcut');
    // 注册全局快捷键
    globalShortcut.register("CommandOrControl+Option+Y", () => {
        app.mainWindow.show()
    })
});
