const path = require("path");
const os = require('os');
const {waitUntil, spawnAsync} = require('../../utils');
const {existsSync} = require('original-fs');

const getMacOSAppPath = () => {
    const sep = path.sep;
    const execPathList = process.execPath.split(sep);
    const index = execPathList.findIndex(t => 'Applications' === t);
    return execPathList.slice(0, index + 2).join(sep);
};

module.exports = (async (app) => {
    const {appDisplayName} = app.config;

    const {latestVersion, latestDmgPath} = app.updateInfo;
    //
    const macOsAppPath = getMacOSAppPath();
    // temp dir
    const tempDir = path.join(os.tmpdir(), String((new Date).getTime()));

    const appDisplayNameVolumesDir = path.join('/Volumes', `${appDisplayName} ${latestVersion}`);
    //
    const latestAppPath = path.join(appDisplayNameVolumesDir, `${appDisplayName}.app`);

    // step 1 which hdiutil
    // /usr/bin/hdiutil
    try {
        const hdiutilResult = await spawnAsync('which', ['hdiutil']);

        if (!hdiutilResult.includes('/bin/hdiutil')) {
            throw new Error('hdiutil not found');
        }
    } catch (e) {
        app.logger.warn(e);
        return {
            success: false,
            type: 'dmg-install-failed'
        }
    }

    // step 2 hdiutil eject appDisplayNameVolumesDir
    try {
        await spawnAsync("hdiutil", ["eject", appDisplayNameVolumesDir])
    } catch (e) {
        e.customMessage = '[InstallMacOSDmgError] step2 volume exists';
        app.logger.warn(e);
    } finally {
        const result = await waitUntil(() => !existsSync(latestAppPath), {
            ms: 300,
            retryTime: 5
        });
        if (!result) {
            app.logger.warn('[InstallMacOSDmgError] step2 volume exists');
            return {
                success: false
            }
        }
    }

    //step 3 hdiutil attach latestDmgPath
    try {
        await spawnAsync('hdiutil', ['attach', latestDmgPath])
    } catch (e) {
        e.customMessage = '[InstallMacOSDmgError] step3 hdiutil attach error';
        app.logger.warn(e);
    } finally {
        const result = await waitUntil(() => !existsSync(latestAppPath), {
            ms: 300,
            retryTime: 5
        });

        if (!result) {
            app.logger.warn('[InstallMacOSDmgError] step3 hdiutil attach fail');
            return {
                success: false
            }
        }
    }

    // step 4 mv
    try {
        await spawnAsync('mv', [macOsAppPath, tempDir]);
    } catch (e) {
        e.customMessage = '[InstallMacOSDmgError] step4 mv to tmp path error';
        app.logger.warn(e);
    } finally {
        const result = await waitUntil(() => !existsSync(tempDir), {
            ms: 300,
            retryTime: 5
        });

        if (!result) {
            app.logger.warn('[InstallMacOSDmgError] step4 cp to tmp path fail');
            return {
                success: false,
                type: "dmg-install-failed"
            }
        }
    }

    // step 5
    try {
        await spawnAsync('cp', ['-R', latestAppPath, macOsAppPath])
    } catch (e) {
        e.customMessage = '[InstallMacOSDmgError] step5 cp to app error';
        app.logger.warn(e);
    } finally {
        const result = await waitUntil(() => !existsSync(macOsAppPath), {
            ms: 300,
            retryTime: 5
        });
        if (!result) {
            app.logger.warn('[InstallMacOSDmgError] step5 cp to app fail');
            await spawnAsync('mv', [tempDir, macOsAppPath]);
            return {
                success: false,
                type: "dmg-install-failed"
            }
        }
    }

    // step 6
    try {
        await spawnAsync('hdiutil', ['eject', appDisplayNameVolumesDir])
    } catch (e) {
        e.customMessage = '[InstallMacOSDmgError] step6 hdiutil eject fail';
        app.logger.warn(e);
    }

    return {
        success: true
    }

});