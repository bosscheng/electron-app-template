/**
 * Date:2020/5/21
 * Desc:
 */
const path = require('path');
const url = require('url');
const {parse: cookieParse} = require('cookie');
const {app: electronApp, BrowserView, BrowserWindow, dialog} = require('electron');
const downloadFile = require('../core/download-file');
const {sleep} = require('../utils');

module.exports = (app => {

    const browserWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 640,
        titleBarStyle: 'hidden',
        title: app.t('测试标题'),
        show: false,
        acceptFirstMouse: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const browserView = new BrowserView();

    const [windowWidth, windowHeight] = browserWindow.getSize();
    browserWindow.setBrowserView(browserView);
    browserView.setBounds({
        x: 0,
        y: 0,
        width: windowWidth,
        height: windowHeight
    });
    browserView.webContents.loadURL(app.getLoadingURL());

    browserWindow.on('resize', () => {
        const [width, height] = browserWindow.getSize();
        browserView.setBounds({
            x: 0,
            y: 0,
            width: width,
            height: height
        })
    });


    browserWindow.webContents.on('dom-ready', () => {
        browserWindow.removeBrowserView(browserView);
    });

    const webRequestFilter = {
        urls: []
    };

    browserWindow.webContents.session.webRequest.onBeforeRequest(webRequestFilter, (details, callback) => {
        // 监听 before request
    });

    browserWindow.webContents.session.webRequest.onBeforeSendHeaders(webRequestFilter, (details, callback) => {
        // 监听 before request
    });


    browserWindow.on('crashed', () => {
        dialog.showErrorBox(app.t('运行资源不足'), app.t('遇到问题，APP将帮你重启恢复'));
        electronApp.relaunch();
        electronApp.exit();
    });

    browserWindow.on('unresponsive', () => {
        dialog.showErrorBox(app.t('已经30秒没有响应'), app.t('遇到问题，APP将帮你恢复'));
        browserWindow.reload();
    })

    browserWindow.on('show', () => {
        browserWindow.webContents.send('update-check');
    });

    if (app.isMac) {
        browserWindow.on('restore', () => {
            //
            browserWindow.webContents.send('update-check');

        })
    }


    browserWindow.on('blur', () => {
        browserWindow.webContents.send('window-blur');
    })

    browserWindow.on('focus', () => {
        browserWindow.webContents.send('window-focus');
    })

    browserWindow.on('scroll-touch-begin', () => {
        browserWindow.webContents.send("scroll-touch-begin")
    })
    browserWindow.on('scroll-touch-end', () => {
        browserWindow.webContents.send("scroll-touch-end")
    })

    browserWindow.on('close', async e => {
        e.preventDefault();
        if (browserWindow.isFullScreen()) {
            browserWindow.setFullScreen(false);
            await sleep(800);
        }
        browserWindow.hide();
        browserWindow.webContents.send('window-will-hide');
    })
});

