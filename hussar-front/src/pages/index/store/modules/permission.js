import * as _ from 'lodash';
import { hussarAxiosRequestUtils } from 'hussar-base';
import { LoginApi } from '@/api/loginApi';
import { constantRouterMap } from '@/pages/index/router/index';
import * as HussarRouter from '@/utils/HussarRouter';
import {
  importFrame,
  importInnerFrame,
  importModuleViews,
  importPackage,
  importViews
} from '@/pages/index/utils/ImportUtils';

import {
  MENU_TYPE_CONSOLE,
  MENU_TYPE_INDEX,
  OPEN_MODE_EXTERNAL,
  OPEN_MODE_INTERNAL,
  STRATEGY_EXTERNAL_LINK,
  STRATEGY_INTERNAL_LINK,
  STRATEGY_INTERNAL_PAGE,
  STRATEGY_PACKAGED_PAGE
} from '@/utils/Constants';

/**
 * permission store 定义，未重构。
 */
const permission = {
  state: {
    routers: constantRouterMap, // 菜单的路由数据，主要供 SideBar 使用
    addRouters: [], // 菜单转的路由
    theRouters: [], // 前端路由的路由表，主要供 vue-router 路由守卫使用，资源转的
    fromPaths: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      // 不变的常量路由 + 后端返回的路由
      state.routers = constantRouterMap.concat(routers);
    },
    SET_ROUTES_NEW: (state, routers) => {
      state.theRouters = routers;
    },
    ADD_FROM_PATH: (state, { from, self }) => {
      state.fromPaths[self] = from.replace('&refresh=true', '').replace('?refresh=true', '?');
    },
    ADD_CURRENT_PAGE: (state, { from, self }) => {
      state.fromPaths[HussarRouter.getFullPath(self, true)] = [from, from];
    },
    ADD_RETURN_PAGE: (state, { from, self }) => {
      let route = null;
      const fromRoute = state.fromPaths[HussarRouter.getFullPath(from, true)];
      if (fromRoute && fromRoute.length === 2) {
        route = fromRoute[1];
      }
      state.fromPaths[HussarRouter.getFullPath(self, true)] = [from, route];
    },
    DEL_RETURN_PAGE: (state, { tabName }) => {
      Object.keys(state.fromPaths).forEach((key) => {
        const index = key.lastIndexOf('tabName=');
        if (key.substring(index + 8, key.length) === tabName) {
          delete state.fromPaths[key];
        }
      });
    }
  },
  actions: {
    // 生成菜单数据
    async GenerateMenu({ commit }) {
      const getMenuResponse = await hussarAxiosRequestUtils.getAction(LoginApi.getMenu, { type: MENU_TYPE_INDEX });
      if (getMenuResponse.code !== 10000) {
        console.error('请求菜单数据失败');
        return;
      }

      const menus = filterMenu(getMenuResponse.data, false);
      const routes = convertMenuToRoutes(menus);
      commit('SET_ROUTERS', routes);
    },
    // 生成路由数据
    async GenerateRoutes({ commit }) {
      const getResourceResponse = await hussarAxiosRequestUtils.getAction(LoginApi.getResource, { type: MENU_TYPE_INDEX });
      if (getResourceResponse.code !== 10000) {
        console.error('请求路由数据失败');
        return;
      }
      // const getMasterResourcesResponse = await hussarAxiosRequestUtils.getAction(LoginApi.LoginApi.getMasterResources, {type: '1'});

      const resources = filterResources(getResourceResponse.data);
      const routes = convertResourcesToRoutes(resources);
      commit('SET_ROUTES_NEW', routes);
    },
    AddFromPath({ commit }, { from, self }) {
      commit('ADD_FROM_PATH', { from, self });
    },
    AddCurrentPath({ commit }, { from, self }) {
      commit('ADD_CURRENT_PAGE', { from, self });
    },
    AddReturnPath({ commit }, { from, self }) {
      commit('ADD_RETURN_PAGE', { from, self });
    },
    DelReturnPath({ commit }, { tabName }) {
      commit('DEL_RETURN_PAGE', { tabName });
    }
  }
};
export default permission;

/**
 * 过滤原始的菜单数据。
 */
function filterMenu(menu, console) {
  const filtered = [];
  for (let node of menu) {
    // 先过滤子级菜单
    if (!isEmpty(node.childMenus)) {
      node = _.clone(node);
      node.childMenus = filterMenu(node.childMenus, console);
    }

    // 再过滤当前节点
    const wantType = console ? MENU_TYPE_CONSOLE : MENU_TYPE_INDEX;
    if (!(isEmpty(node.childMenus) && node.menuType !== wantType && node.menuType !== '2')) {
      filtered.push(node);
    }
  }
  return filtered;
}

/**
 * 转换原始的菜单数据为前端所需的菜单数据。
 *
 */
function convertMenuToRoutes(menus) {
  const routes = [];
  for (const menu of menus) {
    const route = { meta: {}};

    if (menu.text) route.meta.title = menu.text;
    route.meta.icon = menu.icons;
    if (menu.redirect) route.redirect = menu.redirect;
    if (menu.openMode) route.openMode = menu.openMode;
    if (menu.strategy) route.strategy = menu.strategy;
    if (menu.menuId) route.menuId = menu.menuId;

    if (menu.path) {
      route.path = joinPath('/', menu.serviceName, menu.path);
    } else {
      // workaround SideBarItem.resolvePath
      route.path = menu.menuId;
    }

    if (menu.strategy === STRATEGY_EXTERNAL_LINK) {
      route.meta.externalLinks = menu.component.replace('/pages/index', '');
      if (menu.openMode === OPEN_MODE_INTERNAL) {
        route.component = () => importInnerFrame();
      } else {
        route.path = '';
      }
    }

    if (!isEmpty(menu.childMenus)) {
      route.children = convertMenuToRoutes(menu.childMenus);
      route.hidden = route.children.every(child => !isEmpty(child.hidden));
    }

    routes.push(route);
  }
  return routes;
}

/**
 * 过滤原始的资源数据。
 */
function filterResources(resources) {
  // 只处理页面资源
  return resources.filter(resource =>
    !isEmpty(resource.path) && !isEmpty(resource.component));
}

/**
 * 转换原始的资源数据为路由数据。
 */
function convertResourcesToRoutes(resources) {
  const { internalRoutes, externalRoutes } = convertResourcesAndClassifyByOpenMode(resources);
  return composeRoutes(internalRoutes, externalRoutes);
}

/**
 * 转换原始的资源数据，并根据打开模式分类。
 */
function convertResourcesAndClassifyByOpenMode(resources) {
  const internalRoutes = [];
  const externalRoutes = [];

  for (const resource of resources) {
    const route = { meta: {}};

    try {
      handleResourceConversion(resource, route);
    } catch (e) {
      console.error(`路由转换异常(${e.message}): ${JSON.stringify(resource)}`);
      continue;
    }

    // 处理不同打开方式
    if (!isEmpty(resource.openMode) && resource.openMode === OPEN_MODE_EXTERNAL) {
      externalRoutes.push(route);
    } else {
      internalRoutes.push(route);
    }
  }

  return { internalRoutes, externalRoutes };
}

/**
 * 处理单条资源路由数据转换。
 */
function handleResourceConversion(resource, route) {
  // 设置路由的标题、路径、keep-alive
  if (resource.path) {
    route.path = joinPath('/', resource.serviceName, resource.path);
  }
  if (resource.resourceName) route.meta.title = resource.resourceName;
  route.meta.keepAlive = (resource.keepAlive === '1');

  // 从 path 转驼峰生成 vue 组件名称，用于 <keep-alive> 识别缓存
  route.name = (resource.path || '').split(/\//g)
    .filter(Boolean)
    .map(segment => segment[0].toUpperCase() + segment.slice(1))
    .join('');

  // 处理不同策略的特殊逻辑
  switch (resource.strategy || STRATEGY_INTERNAL_PAGE) {
    case STRATEGY_INTERNAL_PAGE:
      handleInternalPageOrLink(resource, route);
      break;
    case STRATEGY_PACKAGED_PAGE:
      handlePackagedPage(resource, route);
      break;
    case STRATEGY_INTERNAL_LINK:
      handleInternalPageOrLink(resource, route);
      break;
    case STRATEGY_EXTERNAL_LINK:
      handleExternalLink(resource, route);
      break;
    default:
      throw new Error(`不支持的策略类型 ${resource.strategy}`);
  }
}

/**
 * 处理策略 0: 内部页面，2: 不重启页面
 */
function handleInternalPageOrLink(resource, route) {
  const strategy = resource.strategy || STRATEGY_INTERNAL_PAGE;

  const path = resource.component;
  const module = resource.serviceName;
  assert(path, `非法 component 路径< ${resource.component} >`);

  route.component = async() => {
    try {
      let mod;
      try {
        // 先尝试重启
        mod = module
          ? await importModuleViews(module, path)
          : await importViews(path);
        if (strategy !== STRATEGY_INTERNAL_PAGE) {
          console.warn(`存在< ${path} >的组件代码，覆盖不重启策略...`);
        }

        // 改写路由 meta 信息
        route.meta.strategy = false;

        // component.name 需要和 route.name 保持一致，保证 <keep-alive> 正常生效
        if (mod.default.name !== route.name) {
          console.info(`改写组件 name ${mod.default.name} => ${route.name}`);
        }
        mod.default.name = route.name;
      } catch (e) {
        console.error(e);
        // 不重启环境再去尝试不重启环境加载策略
        const unRestart = process.env.VUE_APP_LOCAL_UNRESTART === 'yes';
        console.warn(`当前为 ${unRestart ? '不重启' : '重启'} 环境`);
        if (unRestart) {
          // 再尝试不重启
          mod = await importFrame();
          if (strategy !== STRATEGY_INTERNAL_LINK) {
            console.warn(`重启策略下找不到< ${path} >的组件代码，降级为不重启策略...`);
          }

          // 改写路由 meta 信息
          route.meta.strategy = true;
          route.meta.url = joinPath('/', module, `${path}.html`);
        }
      }
      return mod;
    } catch (e) {
      console.error(`找不到< ${path} >对应的组件`, e);
    }
  };
}

/**
 * 处理策略 1: 已打包页面或 BPM 页面
 */
function handlePackagedPage(resource, route) {
  const component = resource.component;
  route.component = async () => {
    let mod;
    try {
      mod = await importPackage(component);
      // component.name 需要和 route.name 保持一致，保证 <keep-alive> 正常生效
      if (mod.default.name !== route.name) {
        console.info(`改写组件 name ${mod.default.name} => ${route.name}`);
      }
      mod.default.name = route.name;
      return mod;
    } catch (e) {
      console.group('%c >>>>>> 错误信息 >>>>>>', 'color:red');
      console.error(`找不到< ${component} >对应的组件,要打开的页面资源为`, resource);
      console.error(`mod为${mod}`);
      console.groupEnd();
      console.group(`'%c 请检查【开发者中心-功能资源-资源管理】中的对应页面资源的组件引入路径component:[${component}]，与平台内置子包中的是否一致`, 'color:red');
      console.warn(`平台内置子包中的页面，开发环境下在浏览器控制台使用vm.$allViews打印查看`);
      console.warn(`若二者一致，则请确保前端环境与后端数据库SQL版本保持一致！！！`);
      console.groupEnd();
    }
  };
}

/**
 * 处理策略 3: 外部链接
 */
function handleExternalLink(resource, route) {
  if (resource.openMode === OPEN_MODE_INTERNAL) {
    route.meta.externalLinks = resource.component.replace('/pages/index', '');
    route.component = () => importInnerFrame();
    route.name = resource.resourceName;
  } else {
    route.path = '';
  }
}

/**
 * 组合路由数据。
 */
function composeRoutes(internalRoutes, externalRoutes) {
  return [
    // 厂字形框架内打开页面时的路由
    {
      path: '/index',
      component: () => importViews('layout/layout'),
      meta: {
        title: 'layout',
        icon: 'layout'
      },
      children: internalRoutes
    },
    // 外部链接路由
    ...externalRoutes,
    // 外部打开内部页面时去除厂字形框架，添加 /external 前缀
    ...externalizeRoutes(internalRoutes),
    // 404 路由
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ];
}

/**
 * 转换为外部打开的路由列表。
 */
function externalizeRoutes(internalRoutes) {
  return internalRoutes.map(route => {
    // 不可以直接深拷贝，重启不重启混用时会动态改写 meta 对象
    route = _.clone(route);
    if (route.path) route.path = '/external' + route.path;
    if (route.name) route.name = 'External' + route.name;
    return route;
  });
}

/**
 * 判断值是否 falsy，或者容器是否为空。
 *
 * @param {any} value
 * @return {boolean}
 */
function isEmpty(value) {
  if (typeof value !== 'object') { return !value; }
  if (Array.isArray(value)) { return !value.length; }
  // 暂时不需要处理 ArrayBuffer/TypedArray 数组，以及 Map/Set/WeakMap/WeakSet 容器类型。
  return Object.getPrototypeOf(value) === Object.prototype && !Object.getOwnPropertyNames(value);
}

/**
 * 断言条件为真。
 *
 * @param {any} condition 断言条件
 * @param {?(string | (() => string))} message 报错信息
 * @return {any}
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error((message.call ? message() : message) || 'assertion failed');
  }
  return condition;
}

/**
 * 合并并规范化路由路径
 *
 * @param {string} segments
 * @returns {string}
 */
function joinPath(...segments) {
  const absolute = /^[\\/]/.test(segments[0] || '');
  const directory = /[\\/]$/.test(segments[segments.length - 1] || '');
  const processed = segments
    .filter(Boolean)
    .flatMap(segment =>
      segment.split(/[\\/]/g).filter(Boolean))
    .join('/');
  return (absolute ? '/' : '') + processed + (directory ? '/' : '');
}
