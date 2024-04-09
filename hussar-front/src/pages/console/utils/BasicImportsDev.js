/**
 * 导入 views/... 路径下 vue 页面。
 *
 * @param {string} path
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importViews(path) {
  const contextRequire = require.context('@/pages/console/views', true, /\.vue$/, 'sync');
  return contextRequire(`./${path}.vue`);
}

/**
 * 导入 modules/.../views/... 路径下 vue 页面。
 *
 * @param {string} module
 * @param {string} path
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importModuleViews(module, path) {
  // 避免 modules 目录不存在时打包失败
  const contextRequire = require.context('@/pages/console', true, /[\\/]modules[\\/][^\\/]+[\\/]views[\\/].*\.vue$/, 'sync');
  return contextRequire(`./modules/${module}/views/${path}.vue`);
}
