import { svgUtils, SVG_TYPE } from 'hussar-icon';

/**
 * 彩色图标注册
 * 注意：此文件夹中包括了空图标
 */
const initColorFulIcon = function () {
  const ctx = require.context('./', true, /\.svg$/);
  svgUtils.registerSvgCategory(ctx, SVG_TYPE.SVG_TYPE_COLORFUL, '彩色图标库');
};

export { initColorFulIcon };

