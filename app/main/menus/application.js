/**
 * Date:2020/5/29
 * Desc: mac 中 左上角的内容
 */

const {app: electronApp, Menu} = require('electron');

module.exports = (app => {
    const tabs = [
        {
            label: 'Application',
            submenu: [
                {
                    label: app.t('关于xx'),
                    accelerator: "CommandOrControl+,",
                    click: () => {

                    }
                },
                {type: "separator"}, // 一根线
                {
                    label: app.t('退出'),
                    accelerator: "CommandOrControl+Q",
                    click: () => {
                        electronApp.exit(0)
                    }
                }
            ]
        },
        {},
        {
            label: e.__("窗口"),
            role: "window",
            submenu:[
                {
                    label: app.t('最小化'),
                    role: "minimize",
                    accelerator: "CommandOrControl+M",
                },
                {
                    label: app.t('关闭'),
                    role: "close",
                    accelerator: "CommandOrControl+W",
                },
                {
                    label: app.t('缩放'),
                    role: "zoom",
                },
                {
                    label: app.t('进入全屏幕'),
                    role: "togglefullscreen",
                    accelerator: "CommandOrControl+Alt+F",
                }
            ]
        }
    ];
    if (app.isMac) {
        Menu.setApplicationMenu(Menu.buildFromTemplate(tabs));
    }
});
