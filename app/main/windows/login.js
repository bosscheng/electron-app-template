/**
 * Date:2020/5/21
 * Desc:
 */
const path = require('path');
const {BrowserView, BrowserWindow} = require('electron');

module.exports = (app => {

    const browserWindow = new BrowserWindow({
        width: 500,
        height: 600,
        frame: app.isMac,
        show: false,
        resizable: app.isDev,
        titleBarStyle: 'hidden',
        title: app.t('登录'),
        acceptFirstMouse: true,
        // 最大化
        maximizable: false,
        // 最小化
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            preload: path.join(__dirname, './preload.js')
        }
    });

    const handleFailure = () => {
        app.logger.info('browserWindow-handleFailure');
        browserWindow.removeBrowserView(loadingBrowserView);
        browserWindow.loadURL(app.getResourceURL('/404'));
    };

    browserWindow.webContents.on('crashed', handleFailure);
    browserWindow.webContents.on('unresponsive', handleFailure);
    browserWindow.webContents.on('did-fail-load', () => {
        handleFailure();
    });

    const loadingBrowserView = new BrowserView();
    browserWindow.setBrowserView(loadingBrowserView);
    loadingBrowserView.setBounds({
        x: 0,
        y: 0,
        width: 400,
        height: 600
    });

    loadingBrowserView.webContents.loadURL(app.getLoadingURL());

    browserWindow.webContents.on('will-navigate', () => {
        app.logger.info('will-navigate');
        browserWindow.setBrowserView(loadingBrowserView);
    });

    //
    browserWindow.webContents.on('dom-ready', async (event) => {
        app.logger.info('browserWindow, dom-ready');
        browserWindow.removeBrowserView(loadingBrowserView);
    });

    browserWindow.on('close', event => {
        app.logger.info('browserWindow-close');
        event.preventDefault();
        browserWindow.hide();
    });

    if (app.isDev) {
        app.logger.info('open dev tools');
        browserWindow.webContents.openDevTools();
    }

    return browserWindow;
});
