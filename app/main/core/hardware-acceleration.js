const fs = require('fs');
const path = require('path');
const {app: electronApp} = require('electron');

const userDataPath = path.join(electronApp.getPath("userData"));

const disableGPUFile = path.join(userDataPath, "disable-hardware-acceleration");

module.exports = (app => {
    app.logger.info('init hardware acceleration');

    app.isDisableHardwareAcceleration = fs.existsSync(disableGPUFile);

    app.disableHardwareAcceleration = (() => {
        fs.writeFileSync(disableGPUFile, 'disable-hardware-acceleration');
    })

    app.allowHardwareAcceleration = (() => {
        fs.unlinkSync(disableGPUFile);
    });
})


module.exports.execIfDisableHardwareAcceleration = (() => {
    if (fs.existsSync(disableGPUFile)) {
        electronApp.disableHardwareAcceleration();
    }
});
