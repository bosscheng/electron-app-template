/*
* author: wancheng
* date: 6/26/18
* desc:
*/
import router from '../router'
import store from '../store';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

NProgress.configure({showSpinner: false});// NProgress Configuration

const whiteList = ['/login'];// no redirect whitelist

//
function hasPermission() {

}

router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    if (to.path === '/logout') {
        store.dispatch('Logout');
        next('/login'); // 否则全部重定向到登录页
    }
    else {
        // 登录校验
        let hasLogin = store.getters.token;

        if (hasLogin) {
            if (to.path === '/login') {
                next({path: '/home'});
                NProgress.done() //  end progress
            }
            else {
              // 查看是否有权限了。
              next();
            }
        }
        else {
            /* has no token */
            if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
                next();
            } else {
                next('/login'); // 否则全部重定向到登录页
                NProgress.done() //   end progress
            }
        }
    }


});

router.afterEach(() => {
    NProgress.done() // end progress
});
