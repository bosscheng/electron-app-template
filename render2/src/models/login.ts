import {stringify} from 'querystring';
import {history, Reducer, Effect} from 'umi';
import {getPageQuery} from '@/utils/utils';
import {message} from 'antd';
import {login} from "@/api/login";

export interface StateType {
  status?: 'ok' | 'error';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const LoginModel: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined
  },

  effects: {

    * login({payload}, {call, put}) {
      const response = yield call(login, payload);
      console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response
      });

      if (response.code === 0) {
        yield put({
          type: 'user/saveToken',
          payload: response.data && response.data.token
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let {redirect} = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      const {redirect} = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      return {
        ...state,
        status: payload.code === 0 ? 'ok' : 'error'
      }
    }
  }
};

export default LoginModel;
