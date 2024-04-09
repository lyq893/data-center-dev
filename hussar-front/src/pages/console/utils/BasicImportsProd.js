/**
 * 导入 views/... 路径下 vue 页面。
 *
 * @param {string} path
 * @return {Promise<ComponentOptions<Vue>>}
 */
export async function importViews(path) {
  return import(
        /* webpackMode: "lazy" */
        /* webpackInclude: /\.vue$/ */
        `@/pages/console/views/${path}.vue`
  );
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
  const dynamic = `modules/${module}/views/${path}.vue`;
  return import(
        /* webpackMode: "lazy" */
        /* webpackInclude: /[\\/]modules[\\/][^\\/]+[\\/]views[\\/].*\.vue$/ */
        `@/pages/console/${dynamic}`
  );
}
