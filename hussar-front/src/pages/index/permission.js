/**
 * portal路由拦截器------------
 *
 *
 */

import router, { resetRouter } from '@/pages/index/router';

import index from '@/pages/index/store';
import NProgress from 'nprogress'; // progress bar
// import 'nprogress/nprogress.css'// progress bar style
import { hussarAxiosRequestUtils, tokenUtil, caching } from 'hussar-base'; // getToken from cookie
import * as login from '@/api/login/login';
NProgress.configure({ showSpinner: false });// NProgress configuration

const loadss = async(to, from, next) => {
  await index.dispatch('GenerateMenu'); // 生成菜单
  await index.dispatch('LoginUserInfo');// 获取基本信息
  await index.dispatch('GenerateRoutes', null).then(() => { // 根据roles权限生成可访问的路由表
    router.addRoutes(index.getters.theRouters); // 动态添加可访问路由表
    const obj = router.match(to.path);
    // 如果路由中存在当前路径，则跳转到对应页面
    if (obj.path !== '/404') {
      next({ path: to.path, replace: true, query: to.query });
      // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
    } else {
      next({ path: '/' });
    }
  });
};

const whiteList = ['/login', '/console', '/forgetPwd'];// no redirect whitelist
router.beforeEach((to, from, next) => {
  if (process.env.VUE_APP_APPMANAGE != 'true') {
    if (to.path === '/temp403') {
      next();
    }
    hussarAxiosRequestUtils.getAction('/hussarBase/newapp/status').then((res) => {
      if (!res.data) {
        next('/temp403');
      } else {
        getCurrentState(to, from, next);
      }
    });
  } else {
    getCurrentState(to, from, next);
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
function getCurrentState(to, from, next) {
  NProgress.start(); // start progress bar
  if (tokenUtil.getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      // 这个地方需要 重定向一下
      if (to.query.redirect) {
        next({ path: to.query.redirect });
      } else {
        next({ path: '/' });
      }
      NProgress.done(); // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (from.path && to.path && from.path.indexOf('/external') >= 0 && to.path.indexOf('/external') === -1) {
        next({ path: '/external' + to.path, query: to.query });
      }
      if (index.getters.theRouters.length === 0) { // 判断当前用户是否已拉取完user_info信息
        loadss(to, from, next);
      } else if (to.query.isResetRouter && to.path === '/404' && to.redirectedFrom && to.redirectedFrom.indexOf('?')) {
        index.dispatch('GenerateRoutes', null).then(() => { // 根据roles权限生成可访问的路由表
          resetRouter(); // 重置动态路由表
          router.addRoutes(index.getters.theRouters); // 动态添加可访问路由表
          let newPath = to.redirectedFrom;
          const endIndex = newPath.indexOf('?');
          newPath = newPath.substring(0, endIndex);
          if (to.meta.keepAlive) {
            index.dispatch('tagsView/addCachedView', to).then(() => {
              next({ path: newPath }); // 重置完动态路由表后重定向
            });
          } else {
            next({ path: newPath }); // 重置完动态路由表后重定向
          }
        });
      } else {
        getCurrentParentName(to);
        if (to.query && to.query.isResetRouter) { // 从天斧发布预览，需要先清除缓存
          index.dispatch('tagsView/delCachedView', { view: to, freshAll: true }).then(() => {
            next({
              path: '/redirect' + to.path,
              query: {
                systemParams: JSON.stringify({
                  tablePageTitle: '',
                  tabName: to.path,
                  refresh: 0,
                  openType: 0
                })
              },
              replace: true
            });
          });
        } else if (to.meta.keepAlive) {
          index.dispatch('tagsView/addCachedView', to).then(() => {
            // 缓存时整个页面刷新
            if (to.query.notCached) {
              delete to.query.notCached;
              index.dispatch('tagsView/delCachedView', { view: to, freshAll: true }).then(() => {
                next({ path: to.path, query: to.query, replace: true });
              });
            } else {
              next();
            }
          });
        } else {
          next();
        }
      }
    }
  } else if (to.path.includes('/publish')) {
    next();
  } else {
    // 非登录状态
    toLoginPage(to, from, next);
  }
}
function getCurrentParentName(to) {
  let flag = false;
  const path = to.path;
  // 获取路由列表
  const routers = index.getters.theRouters;
  // 遍历路由列表
  for (let i = 0; i < routers.length; i++) {
    if (routers[i].children !== undefined && routers[i].children.length !== 0) {
      if (matchPath(routers[i].children, path)) {
        flag = true;
        index.commit('SET_META', routers[i].meta);
      }
    }
  }
  if (!flag) {
    index.commit('SET_META', {});
  }
}
function matchPath(routes, path) {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === path) {
      return true;
    }
    if (routes[i].children !== undefined && routes[i].children.length !== 0) {
      if (matchPath(routes[i].children, path)) return true;
    }
  }
  return false;
}
function toLoginPage(to, from, next) {
  const copyWhiteList = getWhiteList();
  // 获取登录类型
  const loginType = getLoginType(to, from);
  // 单点登录模式下删除/login路由白名单
  if (loginType !== 'default') {
    copyWhiteList.splice(copyWhiteList.indexOf('/login'), 1);
  }
  /* has no token*/
  if (copyWhiteList.indexOf(to.path) !== -1 && to.path !== '/toWelcome') { // 在免登录白名单，直接进入  to.path !== '/toWelcome' 该判断是为了在欢迎页直接跳到登录
    next();
  } else {
    // 是否是单点登录模式
    if (loginType !== 'default') {
      login.toLogin(loginType, to, from, next);
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
    }
    NProgress.done();
  }
}
function getWhiteList() {
  const copyWhiteList = [];
  // 获取登录页面白名单
  const loginWhiteList = login.getLoginWhiteList();
  for (let i = 0; i < whiteList.length; i++) {
    copyWhiteList.push(whiteList[i]);
  }
  for (let i = 0; i < loginWhiteList.length; i++) {
    copyWhiteList.push(loginWhiteList[i]);
  }
  return copyWhiteList;
}
function getLoginType(to, from) {
  // 获有效的登录类型
  const loginTypeList = login.getLoginTypeList();
  // 获取当前登录类型
  const loginType = login.getLoginType(to, from);
  // 判断当前登录类型是否有效
  if (loginTypeList.length > 0 && loginTypeList.indexOf(loginType) > -1) {
    return loginType;
  }
  return 'default';
}
