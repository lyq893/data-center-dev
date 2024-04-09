import { svgUtils, SVG_TYPE } from 'hussar-icon';

/**
 * 彩色图标注册
 * 注意：此文件夹中包括了空图标
 */
const initCommonIcon = function () {
  const ctx = require.context('./', true, /\.svg$/);
  svgUtils.addSvgCategoryByType(ctx, SVG_TYPE.SVG_TYPE_COMMON, '全局公共图标库');
};

export { initCommonIcon };

