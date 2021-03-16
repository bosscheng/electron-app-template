/**
 * Date:2020/5/25
 * Desc:
 */

const path = require('path');
const {Menu, Tray, nativeTheme} = require('electron');

const macLightIcon = path.join(__dirname, "../../../dist-assets/tray/tray@2x.png");
const macDarkIcon = path.join(__dirname, "../../../dist-assets/tray/tray-active@2x.png");
const winLightIcon = path.join(__dirname, "../../../dist-assets/tray/tray-windows.png");

let tray = '';


const mountTray = app => {
    if (tray) {
        tray.destroy();
    }

    const icon = app.isWin ? winLightIcon : nativeTheme.shouldUseDarkColors ? macDarkIcon : macLightIcon;
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate(require('../menus/tray')(app));

    tray.on('click', () => {
        app.loginWindow && !app.loginWindow.isDestroyed() ? app.loginWindow.isVisible() ? app.loginWindow.hide() : app.loginWindow.show() : app.mainWindow && (app.mainWindow.isVisible() ? app.mainWindow.hide() : app.mainWindow.show())
    });
    tray.setToolTip(app.t('托盘'));
    tray.on('right-click', () => tray.popUpContextMenu(contextMenu));

};


module.exports = (app => {
    mountTray(app);

    nativeTheme.on('updated', () => {
        mountTray(app);
    })
});
