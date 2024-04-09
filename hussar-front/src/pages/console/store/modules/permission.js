import * as _ from 'lodash';
import { caching, hussarAxiosRequestUtils } from 'hussar-base';
import { LoginApi } from '@/api/loginApi';
import { constantRouterMap } from '@/pages/console/router/index';

import {
  importInnerFrame,
  importModuleViews,
  importPackage,
  importViews
} from '@/pages/console/utils/ImportUtils';

// 资源策略 0：hussar-front 项目内部 views 页面
const STRATEGY_INTERNAL_PAGE = '0';
// 资源策略 1：NPM 包提供的页面
const STRATEGY_PACKAGED_PAGE = '1';
// 资源策略 2：hussar-front 项目内部 pages 打包出的不重启页面
const STRATEGY_INTERNAL_LINK = '2';
// 资源策略 3：外部链接
const STRATEGY_EXTERNAL_LINK = '3';

// 菜单打开模式 0: 在内部厂字形框架打开的页面
const OPEN_MODE_INTERNAL = '0';
// 菜单打开模式 1: 外部打开并去除厂字形框架的页面
const OPEN_MODE_EXTERNAL = '1';

// 菜单类型 0: 控制台
const MENU_TYPE_CONSOLE = '0';
// 菜单类型 1: 主页
const MENU_TYPE_INDEX = '1';

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    theRouters: [],
    arrHead: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = [];
      state.routers = [];
      state.arrHead = [];
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
      const arr = routers;
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].hidden) {
          if (arr[i].meta.title != '工作流' && arr[i].meta.title != '管理' && arr[i].meta.title != '演示') { state.arrHead.push(arr[i]); }
        }
      }
      caching.session.set('arrHead', state.arrHead);
    },
    SET_ROUTES_NEW: (state, routers) => {
      state.theRouters = routers;
    }
  },
  actions: {
    // 生成菜单数据
    async GenerateMenu({ commit }) {
      // type对应sys_menu表menu_type字段，0是console端菜单，1是index端菜单，2是天斧生成的菜单
      const getMenuResponse = await hussarAxiosRequestUtils.getAction(LoginApi.getMenu, { type: MENU_TYPE_CONSOLE });
      if (getMenuResponse.code !== 10000) {
        console.error('请求菜单数据失败');
        return;
      }
      let menu = [];
      menu = filterMenu(getMenuResponse.data, false);
      if (process.env.VUE_APP_APPMANAGE !== 'true' && process.env.VUE_APP_HAS_VFG !== 'true') {
        menu = menu.filter(item => item.menuAlias !== '可视化设计器');
        const routes = convertMenuToRoutes(menu);
        commit('SET_ROUTERS', routes);
      } else {
        const routes = convertMenuToRoutes(menu);
        commit('SET_ROUTERS', routes);
      }
    },
    // 生成路由数据
    async GenerateRoutes({ commit }) {
      const getResourceResponse = await hussarAxiosRequestUtils.getAction(LoginApi.getResource, { type: MENU_TYPE_CONSOLE });
      if (getResourceResponse.code !== 10000) {
        console.error('请求路由数据失败');
        return;
      }
      const resources = filterResources(getResourceResponse.data);// 过滤出页面资源,path和component都存在的
      const routes = convertResourcesToRoutes(resources);
      commit('SET_ROUTES_NEW', routes);
    }
  }
};
export default permission;

/**
 * 过滤原始的菜单数据。
 */
function filterMenu(menu, index) {
  const filtered = [];
  for (let node of menu) {
    // 先过滤子级菜单
    if (!isEmpty(node.childMenus)) {
      node = _.clone(node);
      node.childMenus = filterMenu(node.childMenus, index);
    }

    // 再过滤当前节点
    const wantType = index ? MENU_TYPE_INDEX : MENU_TYPE_CONSOLE;
    if (!(isEmpty(node.childMenus) && node.menuType !== wantType)) {
      filtered.push(node);
    }
  }
  return filtered;
}

/**
 * 转换原始的菜单数据为前端所需的菜单数据。
 */
function convertMenuToRoutes(menu) {
  const routes = [];
  for (const node of menu) {
    const route = { meta: {}};

    if (node.text) route.meta.title = node.text;
    route.meta.icon = node.icons || 'form';
    if (node.redirect) route.redirect = node.redirect;
    if (node.openMode) route.openMode = node.openMode;// openMode菜单打开方式，0是系统内打开即tab打开，1是系统外打开，新的浏览器页签(默认去掉”厂“字型)
    if (node.strategy) route.strategy = node.strategy;

    if (node.path) {
      route.path = joinPath('/', node.serviceName, node.path);
    } else {
      // workaround SideBarItem.resolvePath
      route.path = node.menuId;
    }

    if (node.strategy === STRATEGY_EXTERNAL_LINK) {
      route.meta.externalLinks = node.component.replace('/pages/console', '');
      if (node.openMode === OPEN_MODE_INTERNAL) {
        route.component = () => importInnerFrame();
      } else {
        route.path = '';
      }
    }

    if (!isEmpty(node.childMenus)) {
      route.children = convertMenuToRoutes(node.childMenus);
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
  // if (resource.path) route.path = resource.path;
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
  const path = resource.component;
  const module = resource.serviceName;

  route.component = async() => {
    try {
      const mod = module
        ? await importModuleViews(module, path)
        : await importViews(path);

      // 改写路由 meta 信息
      route.meta.strategy = false;

      // component.name 需要和 route.name 保持一致，保证 <keep-alive> 正常生效
      if (mod.default.name !== route.name) {
        console.info(`改写组件 name ${mod.default.name} => ${route.name}`);
      }
      mod.default.name = route.name;
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
    route.meta.externalLinks = resource.component.replace('/pages/console', '');
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
