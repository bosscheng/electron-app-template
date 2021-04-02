/**
 * Date:2020/5/21
 * Desc:
 */
/**
 * Date: 5/18/20
 * Desc: 自动更新
 */

const fs = require('fs');
//
const path = require('path');

const util = require('util');
// The semantic versioner for npm
const semver = require('semver');
//
const crypto = require('crypto');
//
const _ = require('lodash');
//
const {exec} = require('child_process');
//
const {rename, createWriteStream, exists, readdir, existsSync} = require("original-fs");
// The UNIX command rm -rf for node.
const rimraf = require('rimraf-alt');
const {app: electronApp, shell, dialog, ipcMain} = require('electron');
const installMacOSDmg = require("./install-macos-dmg");
const {waitUntil} = require('../../utils');
const execAsync = util.promisify(exec);
const renameAsync = util.promisify(rename);
const existsAsync = util.promisify(exists);
const readdirAsync = util.promisify(readdir);
const rimrafAsync = util.promisify(rimraf);

const OLD_ARCHIVE_PREFIX = 'old-';
const public_key = 'xxx';
const UPDATE_WAIT_TIME = 300 * 1000;

class AutoUpdator {
    constructor(app) {
        this.app = app;
        this.isChecking = false;
        this._isUpdating = false;
        this._updateTimer = null;

    }

    updateStart() {
        this._isUpdating = true;
        this._updateTimer = setTimeout(() => {
            this.updateEnd();
        }, UPDATE_WAIT_TIME);
    }

    updateEnd() {
        this._isUpdating = false;
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
            this._updateTimer = null;
        }
    }

    get isUpdating() {
        return !!this._isUpdating;
    }

    clearFlagLater() {
        setTimeout(() => {
            this.isChecking = false;
            this.updateEnd();
        }, UPDATE_WAIT_TIME);
    }

    getUpdateConfig(config) {
        const app = this.app;
        const exePath = electronApp.getPath('exe');
        const tempPath = electronApp.getPath('temp');

        const resourcePath = app.isMac ?
            path.resolve(exePath, "..", "..", "Resources") :
            path.resolve(path.dirname(tempPath));

        const latestAsarDir = path.resolve(resourcePath, 'latest.asar');
        const latestDir = path.resolve(resourcePath, 'latest');

        const zip = `${latestAsarDir}.zip`;
        const exe = `${latestDir}.exe`;
        const dmg = `${latestDir}.dmg`;
        const asar = path.join(resourcePath, 'app.asar');
        const isMacChromiumVersion = app.isMac && config.chromiumVersion !== process.versions.chrome;

        return {
            resourcePath,
            latestVersion: config.latestVersion,
            downloadUrl: isMacChromiumVersion ? config.dmgUrl : config.asarUrl,
            downloadSignature: isMacChromiumVersion ? config.dmgSignature : config.asarSignature,
            downloadTargetDir: isMacChromiumVersion ? dmg : zip,
            updateMacOSDmg: isMacChromiumVersion,
            latestDmgPath: dmg,
            latestAppExePath: exe,
            latestAsarZipPath: zip,
            latestAsarPath: latestAsarDir,
            currentAsarPath: asar
        }

    }

    async update() {
        const {app} = this;
        let time = 0;
        const {updateInfo} = app;
        if (!this.isUpdating) {
            this.updateStart();

            try {
                await this.downloadFile(updateInfo.downloadUrl, updateInfo.downloadSignature, updateInfo.downloadTargetDir, (options) => {
                    const {totalLength, currentLength} = options;
                    if (currentLength / totalLength * 100 > time) {
                        time++;
                        app.mainWindow.webContents.send('update-download-progress', {progress: time})
                    }
                })
            } catch (e) {
                this.updateEnd();
                app.mainWindow.webContents.send('update-download-failed');
                app.logger.warn(e);
            }

            await this.unzipAndReinstall();
        }
    }

    async updateMacOSDmg() {
        const {app} = this;
        const {latestDmgPath} = app.updateInfo;
        if (await existsAsync(latestDmgPath)) {
            return await installMacOSDmg(app);
        } else {
            app.logger.warn('[AutoUpdator] updateMacOSDmg download dmg fail');
            return {
                success: false
            }
        }
    }

    async updateMacOSAsar() {
        const {app} = this;
        const {resourcePath, latestAsarZipPath, currentAsarPath, latestAsarPath} = app.updateInfo;
        if (!await existsAsync(latestAsarZipPath)) {
            app.logger.warn('[AutoUpdator] updateMacOSAsar asar download fail');
            return {success: false};
        }
        try {
            await execAsync(`unzip -o ${latestAsarZipPath}`, {cwd: t, maxBuffer: 2 ** 28})
        } catch (e) {
            e.customMessage = '[AutoUpdator] updateMacOSAsar asar unzip fail';
            app.logger.warn(e);
        }

        let result = await waitUntil(() => existsAsync(latestAsarPath), {
            ms: 1000,
            retryTime: 30
        });

        if (!result) {
            app.logger.warn('[AutoUpdator] updateMacOSAsar asar unzip file find fail');
            return {
                success: false,
                type: "update-unzip-failed"
            }
        }

        try {
            const oldTempDir = path.resolve(resourcePath, `${OLD_ARCHIVE_PREFIX}${(new Date).getTime()}.asar`);
            await renameAsync(currentAsarPath, oldTempDir);
            await renameAsync(latestAsarPath, currentAsarPath);
        } catch (e) {
            e.customMessage = '[AutoUpdator] updateMacOSAsar rename file fail';
            app.logger.warn(e);
            return {
                success: false,
            }
        }

        return {
            success: true
        }
    }

    async updateWindows() {
        const {app} = this;
        const {latestAppExePath} = app.updateInfo;

        if (await existsAsync(latestAppExePath)) {

            // install
            ipcMain.on('quit-and-reinstall-windows', () => {
                shell.openItem(latestAppExePath);
                setTimeout(() => {
                    electronApp.exit(0);
                }, 30);
            });

            return {success: true}
        } else {
            app.logger.warn('[AutoUpdator] updateWindows exe download fail');
            return {
                success: false
            }
        }
    }

    async unzipAndReinstall() {
        const {app} = this;
        const {resourcePath, updateMacOSDmg} = app.updateInfo;
        if (app.isDev) {
            app.mainWindow.webContents.send('update-download-ready');
            return;
        }

        try {
            await this.cleanOldArchive(resourcePath);
        } catch (e) {
            app.logger.warn(e);
        }
        let result = {};

        if (app.isMac) {
            if (updateMacOSDmg) {
                result = await this.updateMacOSDmg();
            } else {
                result = await this.updateMacOSAsar();
            }
        } else {
            result = await this.updateWindows();
        }

        if (this.updateEnd() && result.success) {
            app.mainWindow.webContents.send('update-download-ready');
        } else {
            app.mainWindow.webContents.send(result.type || 'update-download-failed');

            if (result.type === 'dmg-install-failed' || result.type === 'update-unzip-failed') {
                dialog.showErrorBox(app.t('更新失败'), app.t('更新包安装失败，请去官网下载最新版并安装'));
                shell.openExternal(app.config.links.download);
            }
        }

    }

    // clean old archive
    async cleanOldArchive(resourcePath) {
        const dirList = await readdirAsync(resourcePath);
        if (!(dirList && dirList.length)) {
            return;
        }

        const oldList = dirList.filter(e => e.startsWith(OLD_ARCHIVE_PREFIX));

        await Promise.all(oldList.map(async (dir) => {
            const tempDir = path.join(resourcePath, dir);
            if (await existsAsync(tempDir)) {
                await rimrafAsync(tempDir);
            }
        }))

    }

    downloadFile(downloadUrl, downloadSignature, downloadTargetDir, processFn) {
        const {app} = this;
        let length = 0;
        const writeStream = createWriteStream(downloadTargetDir);
        const sha256 = crypto.createVerify('SHA256');
        return new Promise((resolve, reject) => {
            app.httpClient.request(downloadUrl, {
                streaming: true,
                followRedirect: true,
                timeout: 600 * 1000
            }).then((response) => {
                const contentLength = response.headers['content-length'];
                response.res.on('data', (data) => {
                    sha256.update(data);
                    writeStream.write(data);
                    length += data.length;
                    processFn({currentLength: length, totalLength: contentLength});
                });

                response.res.on('end', () => {
                    sha256.end();
                    writeStream.end();
                    try {
                        if (sha256.verify(public_key, downloadSignature, 'hex') || app.isDev) {
                            app.logger.info("verify success, url:%s", downloadUrl);
                            resolve();
                        } else {
                            app.logger.warn("verify failed, url:%s,public_key:%s,signature:%s", downloadUrl, public_key, downloadSignature);
                            reject('verify failed');
                        }
                    } catch (e) {
                        app.logger.warn(e);
                        reject('verify failed');
                    }
                });
            }).catch((e) => {
                reject(e);
            })
        })
    }

    // check
    async check() {
        const {app} = this;
        const {update: {url}, pkg} = app.config;
        this.clearFlagLater();
        if (app.isOnline === false) {
            return;
        }

        if (this.isChecking || this.isUpdating) {
            return;
        }
        let response = {};

        try {
            response = app.httpClient.request(url, {dataType: 'json', timeout: 10 * 1000})
        } catch (e) {

        }
        this.isChecking = false;

        if (response.status === 200) {

            const installList = (response.data && response.data.insiders) || [];

            const currentPlatform = installList.find((item) => {
                return item.platform === process.platform;
            });

            if (currentPlatform) {
                const whiteList = currentPlatform.white_list;
                const minVersion = currentPlatform.min_version;
                //
                const currentVersion = pkg.version;
                const latestVersion = currentPlatform.version;

                let needUpdate = semver.lt(currentVersion, latestVersion);

                if (needUpdate) {
                    needUpdate = whiteList.includes(app.currentUser.username);
                }

                const config = {
                    latestVersion,
                    currentVersion,
                    needUpdate,
                    needForceUpdate: semver.lt(currentVersion, minVersion),
                    asarUrl: currentPlatform.asar_url,
                    dmgUrl: currentPlatform.dmg_url,
                    exeUrl: currentPlatform.exe_url,
                    asarSignature: currentPlatform.asar_signature,
                    dmgSignature: currentPlatform.dmg_signature,
                    exeSignature: currentPlatform.exe_signature,
                    changeLogs: currentPlatform.change_logs,
                    chromiumVersion: currentPlatform.chromium_version
                };
                const updateConfig = this.getUpdateConfig(config);
                app.updateInfo = {...config, updateConfig};
                this._notifyWindow();
            }
        }

    }


    _notifyWindow() {
        const {app} = this;
        const {currentVersion, latestVersion, changeLogs, needForceUpdate, needUpdate} = app.updateInfo;
        const updateInfo = {
            currentVersion,
            latestVersion,
            changeLogs,
            needUpdate, // update
            needForceUpdate // force update
        };

        //
        if (!(needForceUpdate && needUpdate)) {
            updateInfo.downloadReady = null;
        }

        app.mainWindow.webContents.send('check-and-update-updateInfo', updateInfo);

        if (needUpdate || needForceUpdate) {
            app.mainWindow.webContents.send('show-update', {needForceUpdate});
        }
    }
}


module.exports = AutoUpdator;

