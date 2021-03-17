/**
 * Date:2020/6/1
 * Desc:
 */
const {app: electronApp, dialog} = require('electron');
const path = require('path');
const SCHEMA_NAME = 'xx'; // 协议前缀

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        electronApp.setAsDefaultProtocolClient(SCHEMA_NAME, process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    electronApp.setAsDefaultProtocolClient(SCHEMA_NAME);
}

electronApp.on('open-url', ((event, url) => {
    dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
}));
