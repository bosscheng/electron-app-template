/**
 * Date:2020/5/29
 * Desc: mac 中 左上角的内容
 */

const {app: electronApp, Menu, dialog} = require('electron');

module.exports = (app => {
    app.logger.info('init application');

    const tab = app.isMac ? [{
        label: app.t("关闭硬件加速"),
        type: "checkbox",
        checked: app.isDisableHardwareAcceleration,
        click: () => {
            if (app.isDisableHardwareAcceleration) {
                app.allowHardwareAcceleration()
            } else {
                app.disableHardwareAcceleration();
                setTimeout(() => {
                    dialog.showMessageBoxSync({
                        type: "none",
                        message: app.isDisableHardwareAcceleration ? app.t("已开启硬件加速，重启应用生效") : app.t("已关闭硬件加速，重启应用生效")
                    });
                    electronApp.relaunch();
                    electronApp.exit(0);
                }, 500)
            }
        }
    }, {type: "separator"}] : [];

    const tab2 = app.isDev ? [
        {
            label: app.t('开发'),
            accelerator: "CommandOrControl+Alt+I",
            click: () => {
                app.getCurrentWindow().openDevTools();
            }
        }
    ] : [];

    const tabs = [
        // Application
        {
            label: 'Application',
            submenu: [
                {
                    label: app.t('关于xx'),
                    accelerator: "CommandOrControl+,",
                    click: () => {
                        app.mainWindow && app.mainWindow.webContents.send("open-setting")
                    }
                },
                {type: "separator"}, // 一根线
                ...tab2,
                ...tab,
                {
                    label: app.t('退出'),
                    accelerator: "CommandOrControl+Q",
                    click: () => {
                        electronApp.exit(0)
                    }
                }
            ]
        },
        //
        {
            label: app.t("窗口"),
            role: "window",
            submenu: [
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
                },
                {
                    label: app.t('窗口置顶'),
                    type: "checkbox",
                    checked: app.mainWindow && app.mainWindow.isAlwaysOnTop(),
                    click: () => {
                        if (app.mainWindow) {
                            if (app.mainWindow.isAlwaysOnTop()) {
                                app.mainWindow.setAlwaysOnTop(false);
                            } else {
                                app.mainWindow.setAlwaysOnTop(true, 'floating');
                            }
                        }
                    }
                }
            ]
        }
    ];
    if (app.isMac) {
        Menu.setApplicationMenu(Menu.buildFromTemplate(tabs));
    }
});
