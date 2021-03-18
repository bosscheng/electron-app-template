/**
 * Date:2020/5/21
 * Desc:
 */
const {app: electronApp, globalShortcut, session, crashReporter} = require('electron');

const {execIfDisableHardwareAcceleration} = require('./core/hardware-acceleration');

execIfDisableHardwareAcceleration();

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
        const currentWindow = app.getCurrentWindow();
        if (!currentWindow.isVisible()) {
            currentWindow.show();
        }
        if (currentWindow.isMinimized()) {
            currentWindow.restore();
        }
        currentWindow.focus();
    });

    // 监听 ready 事件
    electronApp.on('ready', async () => {
        try {
            await app.init();
        } catch (e) {
            console.error(e);
            app.logger.warn(e);
        }
        app.launchLogin();
    });

} else {
    electronApp.quit();
}


electronApp.on('activate', () => {
    app.logger.info('activate');
    app.getCurrentWindow().show();
});

electronApp.on('before-quit', () => {
    app.logger.info('before-quit');
    globalShortcut.unregisterAll();
    electronApp.exit();
});

electronApp.on('will-quit', () => {
    app.logger.info('will-quit');
    globalShortcut.unregisterAll();
})


electronApp.on('window-all-closed', () => {
    app.logger.info('window-all-closed');
    if (app.isMac) {
        electronApp.exit();
    } else {
        electronApp.quit();
    }
});


