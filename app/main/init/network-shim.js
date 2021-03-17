module.exports = (app => {
    if (app.isWin) {
        app.logger.info('init network shim');
        try {
            require('network-interface').addEventListener('wlan-status-changed', (error, data) => {
                if (error) {
                    console.error(error);
                    app.logger.warn(error);
                    return;
                }

                if (data && data.code) {
                    app.mainWindow && app.mainWindow.webContents.send('wlan-status-changed', data.code);
                }

            })
        } catch (e) {
            console.error(e);
            app.logger.warn(e);
        }
    }
});