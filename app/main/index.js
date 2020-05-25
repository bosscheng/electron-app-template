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

    });

    //
    electronApp.on('ready', async () => {

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

});


