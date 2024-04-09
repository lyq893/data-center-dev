import { svgUtils, SVG_TYPE } from 'hussar-icon';

/**
 * 门户侧菜单图标注册
 * 系统内置的门户测菜单图标 文件夹在hussar-front/src/icons/index/menu
 */
const initIndexMenu = function () {
  const ctx = require.context('./menu', true, /\.svg$/);
  svgUtils.registerSvgCategory(ctx, SVG_TYPE.SVG_TYPE_INDEX_MENU, '门户侧菜单图标');
};

/**
 * 门户侧定制化菜单新增
 * 定制化菜单图标放到 hussar-front/src/icons/index/cusMenu 文件夹下
 */
const initIndexCusMenu = function () {
  const ctx = require.context('./cusMenu', true, /\.svg$/);
  svgUtils.addSvgCategoryByType(ctx, SVG_TYPE.SVG_TYPE_INDEX_MENU);
};
export { initIndexMenu, initIndexCusMenu };

