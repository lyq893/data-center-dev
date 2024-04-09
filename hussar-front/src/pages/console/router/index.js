/**
 * console页面路由配置文件
 *
 *
 *
 */

import Vue from 'vue';
import Router from 'vue-router';
import { modelVersion } from 'bpm-manage-server';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

// 获取原型对象上的push函数
const originalPush = Router.prototype.push;
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: () => import('@/pages/console/views/layout/layout'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/pages/console/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/console/views/login/index'),
    hidden: true
  },
  {
    path: '/ssoLogin',
    component: () => import('@/pages/console/views/login/ssoLogin'),
    hidden: true
  },
  {
    path: '/iamLogin',
    component: () => import('@/pages/console/views/login/iamLogin'),
    hidden: true
  },
  {
    path: '/jumpPage',
    component: () => import('@/pages/console/views/login/jumpPage'),
    hidden: true
  },
  {
    path: '/forgetPwd',
    component: () => import('@/pages/console/views/permit/forgetPwd/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/pages/console/views/404'),
    hidden: true
  },
  {
    path: '/temp403',
    component: () => import('@/pages/console/views/403'),
    hidden: true
  },
  {
    path: '/Forbidden',
    component: () => import('@/pages/console/views/layout/layout'),
    redirect: '/403',
    meta: {
      title: '403'
    },
    children: [
      {
        path: '/403',
        component: () => import('@/pages/console/views/403'),
        name: '无权访问',
        meta: {
          title: '无权访问'
        }
      }
    ],
    hidden: true
  },
  {
    path: '/empower',
    component: () => import('@/pages/console/views/layout/layout'),
    redirect: '/423',
    meta: {
      title: '423'
    },
    children: [
      {
        path: '/423',
        component: () => import('@/pages/console/views/423'),
        name: '未授权',
        meta: {
          title: '未授权'
        }
      }
    ],
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/pages/console/views/layout/layout'),
    redirect: '/index',
    hidden: true,
    children: [{
      path: '/index',
      name: 'Dashboard',
      component: () => import('@/pages/console/views/dashboard/index'),
      meta: { title: '', icon: 'Dashboard', noCache: true, affix: true }
    }]
  },
  {
    path: '/model',
    component: () => import('@/pages/console/views/layout/layout'),
    redirect: '/modelEdit',
    hidden: true,
    meta: {
      title: 'processMana',
      icon: 'bpm'
    },
    children: [
      {
        path: '/version',
        component: modelVersion,
        name: 'Definition',
        meta: { title: '版本管理', icon: 'bpm' },
        hidden: true
      }
    ]
  }
];
export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
