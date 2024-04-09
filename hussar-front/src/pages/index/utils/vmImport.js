import Vue from 'vue';
import router from '@/pages/index/router';
import permission from '@/pages/index/store/permission';
import '@/utils/initAxiosConfig';
import { accountingNumFormat } from 'hussar-base';
import numeral from 'numeral';
import moment from 'moment';
import message from '@/utils/message';
import dayjs from 'dayjs';

import XEUtils from 'xe-utils';

import echarts from 'echarts';
import plugins from '@/pages/index/plugins';

import regionSelect from '@/pages/index/api/lowcode/regionSelect';
import '@/utils/cacheSetup';
/**
 * 挂载Vue实例全局属性
 */
Vue.prototype.$Crouter = router;
Vue.prototype.$myMessage = message;
Vue.prototype.$jumpToLogin = () => {
  router.push('/login');
};
Vue.prototype.$jumpToForbidden = () => {
  router.push('/Forbidden');
};
Vue.prototype.$jumpToEmpower = () => {
  router.push('/empower');
};
Vue.prototype.$jumpToLicense = () => {
  router.push('/license');
};

Vue.prototype.$permission = permission;

// 当前 webpack 编译入口元信息
Vue.prototype.$compilationMetadata = {
  strategy: false
};

Vue.prototype.$accountingNumFormat = accountingNumFormat;
Vue.prototype.$numeral = numeral;
Vue.prototype.$moment = moment;
Vue.prototype.$dayjs = dayjs;

Vue.prototype.$utils = XEUtils;
Vue.prototype.$cookie = XEUtils.cookie;

Vue.prototype.$echarts = echarts;

// 省市区全局变量
Vue.prototype.$regionSelectData = regionSelect;

Vue.use(plugins);
