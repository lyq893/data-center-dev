/* 请勿直接修改此文件，检查 不重启环境 编译模板 是否需要同步修改
*  增加子包 请到 hussar-front/src/pages/index/utils/BuildInPkgImport.js
*  */
import '@/utils/environmentSetup';
import refreshEncryptionSetup from '@/utils/refreshEncryptionSetup';
import Vue from 'vue';
import App from '@/pages/index/App';
import store from '@/pages/index/store';
import router from '@/pages/index/router/index';
// Css相关
import '@/assets/css/themeConfig.css';
import '@/styles/element-variables.scss';
// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// 导入内置包样式和组件页面
import '@/pages/index/utils/BuildInPkgImport';

// icon图标引入
import '@/pages/index/utils/iconsImport';

// 其他项导入
import '@/pages/index/utils/vmImport';

import sessionSync from 'sync-session-storage';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
import { i18n, tokenUtil } from 'hussar-base';
import { InitThemeVars } from 'ThemeBase';

// 路由拦截
import '@/pages/index/permission'; // permission control
import '@/directives/drag_dialog';
import '@/directives/click_outside';
import vClickOutside from 'v-click-outside';

import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';

import internetBaseUiComponent from 'InternetBaseUIComponent';
import 'InternetBaseUIComponent/dist/theme/index.css';

import HussarBaseUIComponent from 'HussarBaseUIComponent';
import 'HussarBaseUIComponent/dist/theme/index.css';

// 公共样式（必须放在依赖包之后）-
import '@/styles/index.scss';

Vue.use(vClickOutside);

Vue.use(internetBaseUiComponent);
Vue.use(HussarBaseUIComponent);
Vue.use(VXETable); // global css
// 给 vue 实例挂载全局窗口对象，属性名称随意定义，例如：$XModal
Vue.prototype.$modal = VXETable.modal;
Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

// 设置页面类型，移动端需要设置成MobilePage
store.commit('ThemeBaseStore/setCurrentPageType', window.appPageType);
// 加载主题配置信息
store.dispatch('HussarThemeConfigStore/loadScheme_server').then((curScheme) => {
  if (curScheme) {
    InitThemeVars(); // 初始化主题样式变量
  } else {
    console.log('主题样式获取异常');
  }
}).catch((err) => {
  console.log(`主题样式获取异常${err}`);
});

tokenUtil.checkLoginState();
const app = new Vue({
  i18n,
  router,
  store: store,
  render: h => h(App)
});
app.$mount('#app');
refreshEncryptionSetup(app);
window.vm = new Vue({ i18n: i18n });
// 登录后在多个标签页同步sessionStorage
sessionSync.init({ flag: 'hussar' });
sessionSync.trigger();

