"use strict"

const _ = require('lodash');
const {ipcRenderer, shell, remote, clipboard} = require("electron");
const processStaticValues = _.pick(process, ["arch", "argv", "argv0", "execArgv", "execPath", "helperExecPath", "platform", "type", "version", "versions"]);

module.exports = (() => ({
    ipcRenderer, // ipc renderer
    shell, // shell
    remote, //
    clipboard,
    process: {
        ...processStaticValues,
        hang: () => {
            process.hang()
        },
        crash: () => {
            process.crash()
        },
        cwd: () => {
            process.cwd()
        }
    }
}));