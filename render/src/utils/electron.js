const _rpc = window._ipcRenderer;


export const isElectron = window._isElectron;

export function loginSuccessAndMainShow() {
  _rpc && _rpc.send('login-success-and-main-show');
}

export function logout() {
  _rpc && _rpc.send('logout');
}
