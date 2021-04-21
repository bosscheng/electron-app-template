import {Effect, Reducer, StateType} from "@@/plugin-dva/connect";

export interface StateType {
  authorities: {},
  menus: []
}

export interface PermissionModelType {
  namespace: string;
  state: StateType;
  reducers: {
    setPermission: Reducer<StateType>;
    destroy: Reducer<StateType>;
  };
}

const PermissionModel: PermissionModelType = {
  namespace: 'permission',
  state: {},
  reducers: {
    setPermission(state, {payload}) {
      const menus = payload.menus || [];
      const authoritiesList = payload.authorities || [];
      let menuList: any[] = [];
      let authoritiesObj: object = {};
      menus.forEach((item: any) => {
        let children = item.children;
        menuList = menuList.concat(children);
      });

      authoritiesList.forEach((item: any) => {
        authoritiesObj[item] = true;
      })

      return {
        ...state,
        authorities: authoritiesObj,
        menus: menuList
      }
    },

    destroy(state) {
      return {
        ...state,
        authorities: {},
        menus: []
      }
    }
  }
};

export default PermissionModel;
