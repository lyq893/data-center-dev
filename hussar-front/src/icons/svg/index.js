import Vue from 'vue';
import { SVG_TYPE, SvgIcon, svgUtils } from 'hussar-icon';// svg component;
// register globally
Vue.component('svg-icon', SvgIcon);

/**
 * 默认注册所有SVG
 */
const initDefaultSVG = function () {
  const ctx = require.context('./', true, /\.svg$/);
  // 注册为通用图标
  const svgList = svgUtils.registerSvgCategory(ctx, SVG_TYPE.SVG_TYPE_COMMON, '通用图标');
  // 放入到所有图标的数组中
  svgUtils.addAllSvgList(svgList);
};

export { initDefaultSVG };
