import { svgUtils, SVG_TYPE } from 'hussar-icon';

/**
 * 控制台菜单图标注册
 * 系统内置的控制台菜单图标 文件夹在hussar-front/src/icons/console/menu
 */
const initConsoleMenu = function () {
  const ctx = require.context('./menu', true, /\.svg$/);
  svgUtils.registerSvgCategory(ctx, SVG_TYPE.SVG_TYPE_CONSOLE_MENU, '控制台侧菜单图标');
};

/**
 * 控制台定制化菜单新增
 * 定制化菜单图标放到 hussar-front/src/icons/console/cusMenu 文件夹下
 */
const initConsoleCusMenu = function () {
  const ctx = require.context('./cusMenu', true, /\.svg$/);
  svgUtils.addSvgCategoryByType(ctx, SVG_TYPE.SVG_TYPE_CONSOLE_MENU);
};
export { initConsoleMenu, initConsoleCusMenu };

