// 依赖包样式
import 'hussar-icon/dist/hussar-icon.css';
import 'hussar-config/dist/hussar-config.css';
import 'hussar-notice/dist/hussar-notice.css';
import 'hussar-common/dist/hussar-common.css';
// import 'hussar-unifiedtodo/dist/hussar-unifiedtodo.css';
import 'hussar-theme-config/dist/hussar-theme-config.css';
import 'BpmShowWorkflow/dist/BpmShowWorkflow.css';
import 'hussar-personal-matters/dist/hussar-personal-matters.css';

// 依赖包页面
import Vue from 'vue';

import { flowchartApi } from 'BpmShowWorkflow';
import { allViews as HussarPersonalMattersViews } from 'hussar-personal-matters';
import { allViews as HussarUnifiedtodoViews } from 'hussar-unifiedtodo';
import { allViews as HussarNoticeViews } from 'hussar-notice';
// import { allViews as HussarMobilePlatform } from 'hussar-mobile-platform';

Vue.prototype.$allViews = {
  ...HussarPersonalMattersViews,
  ...HussarUnifiedtodoViews,
  ...HussarNoticeViews
};
flowchartApi.setPrefix(process.env.VUE_APP_HUSSAR_DEFAULT_API);
