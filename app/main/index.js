/**
 * Date:2020/5/21
 * Desc:
 */
const {app: electronApp, globalShortcut, session, crashReporter} = require('electron');

crashReporter.start({
    productName: "test",
    companyName: "test",
    submitURL: "https://www.test.com",
    autoSubmit: true,
    uploadToServer: true,
    ignoreSystemCrashHandler: true
});

const App = require('./init/app');

const app = new App();

process.on("uncaughtException", e => {
    app.logger && app.logger.warn("uncaughtException: %s", e)
});

const singleInstanceLock = electronApp.requestSingleInstanceLock();

if (singleInstanceLock) {
    //
    electronApp.on('second-instance', () => {
        //  查看打开的是否是 login window 还是 main window
        app.loginWindow &&
        !app.loginWindow.isDestroyed() ?
            (app.loginWindow.isVisible() || app.loginWindow.show(),
            app.loginWindow.isMinimized() && app.loginWindow.restore(),
                app.loginWindow.focus()) :
            app.mainWindow &&
            (app.mainWindow.isVisible() || app.mainWindow.show(),
            app.mainWindow.isMinimized() && app.mainWindow.restore(),
                app.mainWindow.focus())
    });

    // 监听 ready 事件
    electronApp.on('ready', async () => {
        try {
            await app.init();
        } catch (e) {
            console.error(e);
        }
        app.launchLogin();
    });

} else {
    electronApp.quit();
}


electronApp.on('activate', () => {

});

electronApp.on('before-quit', () => {
    globalShortcut.unregisterAll();
    electronApp.exit();
});

electronApp.on('window-all-closed', () => {
    if (!app.isMac) {
        electronApp.quit();
    }
});


