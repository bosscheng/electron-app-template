import {Effect, Reducer} from 'umi';

import {getProfile} from "@/api/profile";

const TOKEN_KEY = '_token';
const TIME_KEY = '_time';

let _time: any = localStorage.getItem(TIME_KEY);
let now = (new Date()).getTime();

// 超过 48 小时，就gg
if (_time && now - _time > 48 * 3600 * 1000) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TIME_KEY);
}

let _token: any = localStorage.getItem(TOKEN_KEY);


export interface CurrentUser {
  name?: string,
  role?: {},
  mcdUserId?: string
}

export interface UserModelState {
  currentUser?: CurrentUser;
  token: ''
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchProfile: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveToken: Reducer<UserModelState>;
  };
}


const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    token: _token,
  },
  effects: {

    * fetchProfile(_, {call, put}) {
      const {data} = yield call(getProfile);
      console.log(data);
      const currentUser = {
        name: data.user.name,
        role: data.role.alias,
      };

      yield put({
        type: 'saveCurrentUser',
        payload: currentUser
      });

      yield put({
        type: "permission/setPermission",
        payload: {
          menus: data.menus,
          authorities: data.authorities
        }
      })
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      }
    },
    saveToken(state, action) {
      return {
        ...state,
        token: action.payload
      }
    }
  }
}

export default UserModel;
