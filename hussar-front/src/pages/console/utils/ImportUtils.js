/**
 * 封装动态 import。
 *
 * @see https://v4.webpack.js.org/api/module-methods/#dynamic-expressions-in-import
 */

import Vue from 'vue';

const basicImports = require(process.env.NODE_ENV === 'development' ? './BasicImportsDev' : './BasicImportsProd');

/**
 * 导入 views/... 路径下 vue 页面。
 *
 * @param {string} path
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importViews(path) {
  return basicImports.importViews(normalizePathSegment(path));
}

/**
 * 导入 modules/.../views/... 路径下 vue 页面。
 *
 * @param {string} module
 * @param {string} path
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importModuleViews(module, path) {
  return basicImports.importModuleViews(module, normalizePathSegment(path));
}

/**
 * 导入 innerFrame 组件。
 *
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importInnerFrame() {
  return require('@/components/innerIframe/index.vue');
}

/**
 * 导入平台 npm 包注册并提供的 vue 页面。
 *
 * @param {string} path
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importPackage(componentPath) {
  for (const key in Vue.prototype.$allViews) {
    if (componentPath === key) {
      let mod = null;
      const record = Vue.prototype.$allViews[key];
      if (typeof record === 'function') {
        mod = await record();
      } else if (record != null && typeof record === 'object') {
        mod = createModule(record);
      }
      if (mod == null) {
        throw new Error('内部页面不存在: ' + componentPath);
      }
      return mod;
    }
  }
}

function normalizePathSegment(path) {
  return (path || '').split(/[\\/]/g).filter(Boolean).join('/').replace(/\.vue$/i, '');
}

function createModule(exportDefault) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const module = new function Module() {
  }();
  module.default = exportDefault;
  Object.defineProperty(module, '__esModule', { value: true });
  return module;
}
