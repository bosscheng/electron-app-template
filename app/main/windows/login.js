/**
 * Date:2020/5/21
 * Desc:
 */
const path = require('path');
const {parse: urlParse} = require('url');
const {BrowserView, BrowserWindow} = require('electron');

module.exports = (app => {

    const browserWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: app.isMac,
        show: false,
        resizable: app.isDev,
        titleBarStyle: 'hidden',
        title: app.t('登录'),
        acceptFirstMouse: true,
        // 设置不允许缩放啥的。
        maximizable: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const handleFailure = () => {
        browserWindow.removeBrowserView()
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
        browserWindow.setBrowserView(loadingBrowserView);
    });

    //
    browserWindow.webContents.on('dom-ready', async (event) => {
        const url = event.sender.getURL();
        // 如果 url 切换了，则关闭。
        if ('#/login' !== urlParse(url).hash) {
            browserWindow.removeBrowserView(loadingBrowserView);
        }
    });

    browserWindow.on('close', event => {
        event.preventDefault();
        browserWindow.hide();
    })
});
