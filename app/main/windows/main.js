/**
 * Date:2020/5/21
 * Desc:
 */
const path = require('path');
const url = require('url');
const {parse: cookieParse} = require('cookie');
const {app: electronApp, BrowserView, BrowserWindow, dialog} = require('electron');
const {sleep} = require('../utils');
const {downloadFile} = require('../core/download-file');

module.exports = (app => {
    app.logger.info('init main window');
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
            webviewTag: true,
            preload: path.join(__dirname, './preload.js')
        }
    });

    const loadingBrowserView = new BrowserView();

    const [windowWidth, windowHeight] = browserWindow.getSize();
    browserWindow.setBrowserView(loadingBrowserView);
    loadingBrowserView.setBounds({
        x: 0,
        y: 0,
        width: windowWidth,
        height: windowHeight
    });
    loadingBrowserView.webContents.loadURL(app.getLoadingURL());

    browserWindow.on('resize', () => {
        const [width, height] = browserWindow.getSize();
        loadingBrowserView.setBounds({
            x: 0,
            y: 0,
            width: width,
            height: height
        })
    });


    browserWindow.webContents.on('dom-ready', () => {
        browserWindow.removeBrowserView(loadingBrowserView);
    });

    // 需要拦截的请求。
    const webRequestFilter = {
        urls: ["*://test.aaa.com/*", "*://*.ccc.com/*"]
    };

    browserWindow.webContents.session.webRequest.onBeforeRequest(webRequestFilter, (details, callback) => {
        // 监听 before request

        // 是否存在下载
        if (details.url.includes('desktop-download')) {
            downloadFile(app, details.url);
        }
        // 原始请求被阻止发送或完成，而不是重定向到给定的URL
        callback({redirectURL: details.redirectURL});
    });

    browserWindow.webContents.session.webRequest.onBeforeSendHeaders(webRequestFilter, (details, callback) => {
        // 绑定header 头部。
        if (details.requestHeaders.Cookie) {
            const {ctoken = ''} = cookieParse(details.requestHeaders.Cookie);
            if (ctoken) {
                details.requestHeaders['x-csrf-token'] = ctoken;
            }
        }
        // When provided, request will be made with these headers.
        callback({requestHeaders: details.requestHeaders});
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

    //
    if (app.isMac) {
        browserWindow.on('restore', () => {
            //
            browserWindow.webContents.send('update-check');
            browserWindow.webContents.send('log-pv');
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
    });


    return browserWindow;
});

