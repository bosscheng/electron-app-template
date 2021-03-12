/**
 * Date:2020/5/21
 * Desc:
 */

const Context = require('./context');
const {promisify} = require('util');
const _ = require('lodash');

const AutoUpdator = require('../core/auto-updator');

const initConstants = require('../constants');
const initI18n = require('./i18n');
const initLogger = require('../core/logger');
const initHttpClient = require('../core/http-client');

const AUTO_UPDATOR = Symbol("Context#autoUpdator");


class App {
    constructor(options) {
        this.options = options;
        this.isDev = "development" === process.env.NODE_ENV;
        this.isMac = "darwin" === process.platform;
        this.isWin = "win32" === process.platform;
        this.currentContext = null;
        this.locale = '';
        this.storage = null;
    }

    createContext() {
        this.currentContext = new Context();
    }

    destroyContext() {
        this.currentContext = null;
    }

    getLogger(t) {
        return this[t] && this[t]()
    }

    get updator() {
        if (!this[AUTO_UPDATOR]) {
            this[AUTO_UPDATOR] = new AutoUpdator(this);
        }
        return this[AUTO_UPDATOR];
    }

    get logger() {
        return this.getLogger('electronLogger');
    }


    async setLocale(locale) {
        await promisify(this.storage.set)('locale', locale);
    }

    async getLocale() {
        const {app} = require('electron');
        const locale = await promisify(this.storage.get)('locale');
        return _.size(locale) ? locale : app.getLocale();
    }

    async init() {
        const storage = require('electron-json-storage-alt');
        this.storage = storage;
        this.locale = await this.getLocale();

        //
        initConstants(this);
        initI18n(this);
        initLogger(this);
        initHttpClient(this);

        const initApplication = require('../menus/application');
        const initMainWindow = require('../windows/main');
        const initIPC = require('./ipc');
        const initOpenAtLogin = require('./open-at-login');
        const initTray = require('./tray');
        const initShortcut = require('./shortcut');
        require('./protocols');
        this.mainWindow = initMainWindow(this);

        initApplication(this);
        initIPC(this);
        initOpenAtLogin(this);
        initTray(this);
        initShortcut(this);
    }

    launchLogin() {
        if (!this.loginWindow || (this.loginWindow && this.loginWindow.isDestroyed())) {
            const initLoginWindow = require('../windows/login');
            this.loginWindow = initLoginWindow(this);
        }
        this.loginWindow.loadURL(this.getResourceURL('/login'));
        this.loginWindow.show();
    }
}

module.exports = App;
