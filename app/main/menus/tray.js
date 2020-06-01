/**
 * Date:2020/5/29
 * Desc: 在mac 中就是吸顶部的时候右键选项。在mac 中就是
 */
const {app: electronApp} = require('electron');

module.exports = (app => {
    const ctrl = app.isWin ? 'Ctrl' : 'Command';
    return [
        {
            label: app.t('关于xxx'),
            click: () => {
                app.mainWindow && app.mainWindow.webContents.send('open-setting');
            }
        },
        {type: "separator"},
        {
            label: app.t('偏好设计'),
            accelerator: `${ctrl}+,`,
            click: () => {
                app.mainWindow && app.mainWindow.webContents.send('open-setting');
            }
        },
        {
            label: app.t('退出'),
            accelerator: `${ctrl}+Q`,
            click: () => {
                electronApp.exit(0);
            }
        }
    ]
});
