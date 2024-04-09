/**
 * 本文件最终将引入到入口文件 com\jxdinfo\hussar\hussar-formdesign-core-vue-code\template\compileTemplate.js
 * 不重启模板中需要引入
 *
 * 仅在可视化设计器使用的
 */
import regionSelect from '@/pages/index/api/lowcode/regionSelect';
import '@/utils/initAxiosConfig';
// 摄像头组件用到了
import '@/assets/font/vfgIcon/iconfont.js';
import '@/assets/font/vfgIcon/iconfont.css';
const lowcodePlugin = {};
lowcodePlugin.install = function(Vue, options) {
  // 省市区全局变量
  Vue.prototype.$regionSelectData = regionSelect;
};
export default lowcodePlugin;

