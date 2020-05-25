/**
 * Date:2020/5/25
 * Desc:
 */
const fs = require('fs');
const path = require('path');

const {ipcMain, Menu, shell, app: electronApp} = require('electron');

module.exports = (app => {

    ipcMain.on('weblog', async (log) => {
        app.getLogger('')
    });
});
