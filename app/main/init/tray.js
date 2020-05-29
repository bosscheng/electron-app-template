/**
 * Date:2020/5/25
 * Desc:
 */

const path = require('path');
const {Menu, Tray, nativeTheme} = require('electron');

const macLightIcon = '';
const macDarkIcon = '';
const winLightIcon = '';

let tray = '';


const mountTray = app => {
    if (tray) {
        tray.destroy();
    }

    const icon = app.isWin ? winLightIcon : nativeTheme.shouldUseDarkColors ? macDarkIcon : macLightIcon;
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate(require('../menus/tray')(app));

    tray.on('click', () => {
        app.mainVindow.show();
    });
    tray.setToolTip(app.t('xx'));
    tray.on('right-click', () => tray.popUpContextMenu(contextMenu));

};


module.exports = (app => {
    mountTray(app);

    nativeTheme.on('updated', () => {
        mountTray(app);
    })
});
