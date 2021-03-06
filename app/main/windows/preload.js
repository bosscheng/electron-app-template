/**
 * Date:2020/5/21
 * Desc:
 */
"use strict";

delete window.exports;
delete window.module;
window._electron_bridge = require('./electron-bridge');

const isDev = "development" === process.env.NODE_ENV;
window._appData = {
    isDev: isDev,
    timestamp: (new Date).getTime(),
    isWin: "win32" === navigator.platform.toLowerCase(),
    isMac: "darwin" === navigator.platform.toLowerCase()
};

const {ipcRenderer, shell} = require('electron');
window._ipcRenderer = ipcRenderer;
window._isElectron = true;

console.log("preload");

document.onreadystatechange = () => {
    if ('interactive' === document.readyState) {
        //  可以预先处理dom了。
        //   可以注入css
        const style = document.createElement('style');
        const styleInner = `
        body{
            background: transparent !important
        }
        `;
        const textNode = document.createTextNode(styleInner);
        style.appendChild(textNode);
        document.head.appendChild(style);
    }
};


window.addEventListener('unhandledrejection', e => {
    if (!e.reason) {
        return;
    }

    const envelope = {
        message: e.reason.message,
        stack: e.reason.stack,
        href: window.location.href
    };

    ipcRenderer.send('web-unhandledrejection', envelope);
});


window.addEventListener('error', e => {
    const envelope = {
        message: e.message,
        source: e.source,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error && e.error.stack,
        href: window.location.href
    };

    ipcRenderer.send('web-error', envelope);
}, false);


document.addEventListener('click', e => {
    const target = e.target;
    if ('A' === target.nodeName) {
        if (target.defaultPrevented) {
            return;
        }
        if (location.hostname) {
            e.preventDefault();
            if (target.href && target.href.indexOf('localhost') === -1) {
                shell.openExternal(target.href);
            }
        }
    }
}, false);

//
window.openExternalLink = (href) => {
    if (href) {
        shell.openExternal(href);
    }
};


window.addEventListener('keydown', e => {
    const {altKey, ctrlKey, metaKey, keyCode, shiftKey} = e;
    <!--alt + ctrl + (Command | Windows) + d -->
    if (altKey && ctrlkey && metaKey && keyCode === 68) {
        const currentWindow = require('electron').remote.getCurrentWindow();
        currentWindow && currentWindow.toggleDevTools();
        e.preventDefault();
    } else if (keyCode === 27 && (!shiftKey || !ctrlKey)) {
        ipcRenderer.send('un-max-window')
    }
}, false);


