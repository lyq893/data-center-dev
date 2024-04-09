import Vue from 'vue';
import router from '@/pages/console/router/index';
import permission from '@/pages/console/store/permission';
import plugins from '../plugins/index';
import '@/utils/initAxiosConfig';
import { accountingNumFormat } from 'hussar-base';
import numeral from 'numeral';
import moment from 'moment';
import dayjs from 'dayjs';

import message from '@/utils/message';
import echarts from 'echarts';
import '@/utils/cacheSetup';

import HTabs from 'HussarBaseUIComponent/dist/HTabs.common';
import HTable from 'HussarBaseUIComponent/dist/HTable.common';
import HTableV1 from 'HussarBaseUIComponent/dist/HTableV1.common';
import HTableColumnFilter from 'HussarBaseUIComponent/dist/HTableColumnFilter.common';
import 'HussarBaseUIComponent/dist/theme/index.css';
Vue.use(HTabs);
Vue.use(HTable);
Vue.use(HTableV1);
Vue.use(HTableColumnFilter);

Vue.prototype.$Crouter = router;
Vue.prototype.$myMessage = message;
Vue.prototype.$jump2Login = () => {
  router.push('/login');
};
Vue.prototype.$permission = permission;
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

Vue.prototype.$accountingNumFormat = accountingNumFormat;
Vue.prototype.$numeral = numeral;
Vue.prototype.$moment = moment;
Vue.prototype.$dayjs = dayjs;

Vue.prototype.$echarts = echarts;

Vue.use(plugins);
