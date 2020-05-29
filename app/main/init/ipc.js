/**
 * Date:2020/5/25
 * Desc:
 */
const fs = require('fs');
const path = require('path');

const {ipcMain, Menu, shell, app: electronApp} = require('electron');

module.exports = (app => {

    ipcMain.on('weblog', async (event, args) => {
        app.getLogger('webLogger').info(args);
    });

    ipcMain.handle('switch-language', async (event, args) => {
        await app.setLocale(args);
    });

    ipcMain.on('toggle-maximize', () => {
        app.mainWindow.isMaximized() ? app.mainWindow.unmaximize() : app.mainWindow.maximize()
    });

    ipcMain.handle('update-check', async () => {
        await app.updator.check();
    });

    ipcMain.handle('update-retry-unzip', async () => {
        await app.updator.unzipAndReinstall();
    });


    ipcMain.handle('update-start', async (event, args) => {
        await app.updator.update(args);
    });

    ipcMain.on('print-to-pdf', (event, args) => {
        event.sender.printToPDF({
            landscape: false,
            marginsType: true,
            printBackground: true,
            printSelectionOnly: false,
            pageSize: "A4"
        }).then((data) => {
            const downloadPath = electronApp.getPath("downloads");
            const filePath = path.join(downloadPath, `${+new Date}.pdf`);
            fs.writeFile(filePath, data, (error) => {
                if (error) {
                    app.logger.warn(error);
                    return;
                }

                shell.openExternal(`file://${filePath}`);
            });
        })
    })
});
