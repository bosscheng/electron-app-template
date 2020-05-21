/**
 * Date:2020/5/21
 * Desc:
 */
const {app, globalShortcut, session, crashReporter} = require('electron');

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
