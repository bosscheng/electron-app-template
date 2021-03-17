const _rpc = window._ipcRenderer;


export const isElectron = window._isElectron;

export function loginSuccessAndMainShow(token) {
  _rpc && _rpc.send('login-success-and-main-show', token);
}

export function logout() {
  _rpc && _rpc.send('logout');
}

export function switchLanguage(lang) {
  _rpc && _rpc.invoke('switch-language', lang)
}

export async function getAppConfig() {
  return _rpc ? _rpc.invoke('get-app-config') : null;
}


// 监听 主进程发送消息过来。
export function addEventListener(event, handler) {
  _rpc.on(event, handler);
}


export const EVENTS = {
  openSetting: 'open-setting',
  logPv: 'log-pv',
  updateCheck: 'update-check'
};
