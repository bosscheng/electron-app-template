const {TouchBar, screen} = require("electron");
const {TouchBarButton} = TouchBar;

const _setTouchBar = (win, touchBar) => {
    win.setTouchBar(touchBar);
}

module.exports = ((app) => {
    if (app.isMac) {
        app.logger.info('init touch bar manager');
        app.touchBarManager = {
            setMainWindow: win => {
                const touchBarBtn = new TouchBarButton({
                    label: app.t('设置'),
                    backgroundColor: '',
                    click: () => {
                        win.webContents.send('touch-bar', 'setting')
                    }
                })
            }
        }
    }
});
