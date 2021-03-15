/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import Layout from '~/views/layout/Layout';
import Login from '../views/login/index';
import Logout from '../views/logout/index';
import Page404 from '../views/error/404';
import Home from '../views/home/index';
import Test from '../views/test/index';

let constantRouterMap = [
  {path: '/login', component: Login, hidden: true},
  {path: '/logout', component: Logout, hidden: true},
  {path: '/404', component: Page404, hidden: true},
  // 首页`
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: Home,
      name: 'home',
      meta: {title: 'home', icon: 'excel', noCache: true}
    }]
  },
  {
    path: '/test',
    component: Layout,
    children: [{
      path: 'index',
      component: Test,
      name: 'test',
      meta: {title: 'test', icon: 'excel', noCache: true}
    }]
  },

  // 一定要放在最后。
  {path: '*', redirect: '/404', hidden: true}
];


export {
  constantRouterMap
}
