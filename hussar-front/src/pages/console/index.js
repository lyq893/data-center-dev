import '@/utils/environmentSetup';
import refreshEncryptionSetup from '@/utils/refreshEncryptionSetup';
import Vue from 'vue';
import App from '@/pages/console/App';
import store from '@/pages/console/store';
import router from '@/pages/console/router/index';
// Css相关
import '@/assets/css/reset.css';
import '@/assets/css/themeConfigLoginConfig.css';
import '@/styles/element-variables.scss';
// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import XEUtils from 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';

// 导入内置包样式和组件页面
import '@/pages/console/utils/BuildInPkgImport';

// 公共样式（必须放在依赖包之后）
import '@/styles/consoleIndex.scss'; // global css
// icon图标引入
import '@/pages/console/utils/iconsImport';
// 其他项导入
import '@/pages/console/utils/vmImport';

import sessionSync from 'sync-session-storage';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n

// 路由拦截
import '@/pages/console/permission'; // permission control
import '@/directives/drag_dialog';
import message from '@/utils/message';
import { i18n, tokenUtil, caching } from 'hussar-base';

// 数据迁移支持可扩展
import './migration';

Vue.prototype.$utils = XEUtils;
Vue.prototype.$cookie = XEUtils.cookie;
Vue.prototype.$myMessage = message;
Vue.use(ElementUI, { locale });

Vue.use(VXETable);
Vue.config.productionTip = false;
tokenUtil.checkLoginState();
// 给 vue 实例挂载全局窗口对象，属性名称随意定义，例如：$XModal
Vue.prototype.$modal = VXETable.modal;
const app = new Vue({
  i18n,
  router,
  store: store,
  render: h => h(App)
});
refreshEncryptionSetup(app);
app.$mount('#app');
window.vm = new Vue({ i18n: i18n });
// 登录后在多个标签页同步sessionStorage
sessionSync.init({ flag: 'hussar' });
sessionSync.trigger();
// 同步之后加载页面样式
sessionSync.afterSync(function () {
  window.document.documentElement.setAttribute('data-theme', caching.session.get('HussarTheme'));
});
