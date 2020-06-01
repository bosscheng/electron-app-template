/**
 * Date:2020/5/25
 * Desc: 设置开机启动项
 */

const {ipcMain, app: electronApp} = require('electron');
// 属性返回启动 Node.js 进程的可执行文件的绝对路径名。
const exePath = process.execPath;

module.exports = ((app) => {
    ipcMain.handle('get-auto-start-status', () => electronApp.getLoginItemSettings())

    ipcMain.on('auto-start-open', () => {
        electronApp.setLoginItemSettings({
            openAtLogin: true,
            path: exePath,
            args: []
        })
    });

    ipcMain.on('auto-start-closed', () => {
        electronApp.setLoginItemSettings({
            openAtLogin: false,
            path: exePath,
            args: []
        })
    })

});
