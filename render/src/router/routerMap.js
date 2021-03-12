/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import Layout from '~/views/layout/Layout';


let constantRouterMap = [
  {path: '/login', component: () => import('../views/login/index'), hidden: true},
  {path: '/logout', component: () => import('../views/logout/index'), hidden: true},
  {path: '/404', component: () => import('../views/error/404'), hidden: true},
  // 首页`
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: () => import('../views/home/index'),
      name: 'home',
      meta: {title: 'home', icon: 'excel', noCache: true}
    }]
  },
  {
    path: '/test',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('../views/test/index'),
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
