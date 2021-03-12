/**
 * Date:2020/5/21
 * Desc:
 */
const {app: electronApp, dialog} = require('electron');
const {createWriteStream} = require('fs');
const {parse} = require('url');
const path = require('path');


const downloadFile = async (app, url) => {
    const downloadPath = electronApp.getPath('downloads');
    const {pathname} = parse(url);
    const fileName = pathname.split('/').pop();
    const localFilePath = path(downloadPath, fileName);

    const {canceled, filePath} = await dialog.showSaveDialog(app.mainWindow, {
        title: '保存附件',
        default: localFilePath
    })

    if (!canceled) {
        const savedFilePath = path.join(path.dirname(filePath), fileName);
        const writeSteam = createWriteStream(savedFilePath);

        const request = app.httpClient.request(url, {
            headers: {
                'Content-Type': null
            },
            streaming: true,
            followRedirect: true
        })

        const needShowProgress = Number(request.headers['content-length']) > 1048576;

        const downloadResponse = (type) => {
            // progress
            app.mainWindow.webContents.send('download-progress', {type});
        }

        request.res.on("data", data => {
            writeSteam.write(data);

            if (needShowProgress) {
                downloadResponse('data');
            }
        });

        request.res.on('end', () => {
            writeSteam.end();
            downloadResponse('end');
        });

        request.res.on('error', () => {
            downloadResponse('error');
        })
    }
};
