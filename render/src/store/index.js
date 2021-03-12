/*
* author: wancheng
* date: 11/5/18
* desc:
*/


import Vue from 'vue'
import Vuex from 'vuex'

const TOKEN_KEY = '_token';
// 从 session storage 获取到
const _token = sessionStorage.getItem(TOKEN_KEY) || '';

Vue.use(Vuex);


let _data = {
  sidebarStatus: true
};


const store = new Vuex.Store({
  state: {
    sidebar: {
      opened: _data.sidebarStatus,
      withoutAnimation: false
    },
    device: 'desktop',
    token: _token,
    userName: 'admin'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        _data.sidebarStatus = true;
      } else {
        _data.sidebarStatus = false;
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      _data.sidebarStatus = true;
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_TOKEN: (state, token) => {
      let _token = 'Bearer ' + token;
      state.token = _token;
      sessionStorage.setItem(TOKEN_KEY, _token);
    },
    CLEAR_TOKEN: (state) => {
      state.token = '';
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  actions: {
    toggleSideBar({commit}) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({commit}, {withoutAnimation}) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({commit}, device) {
      commit('TOGGLE_DEVICE', device)
    },
    UpdateToken({commit}, token) {
      commit('SET_TOKEN', token);
    },
    Logout({commit}) {
      commit('CLEAR_TOKEN')
    }
  },

  getters: {
    token: state => state.token,
  }
});

export default store;
