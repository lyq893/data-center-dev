// 依赖包样式
import 'hussar-icon/dist/hussar-icon.css';
import 'hussar-common/dist/hussar-common.css';
// import 'hussar-tenant/dist/hussar-tenant.css';
import 'hussar-config/dist/hussar-config.css';
// import 'hussar-audit/dist/hussar-audit.css';
import 'hussar-general/dist/hussar-general.css';
// import 'hussar-authorization/dist/hussar-authorization.css';
// import 'hussar-operations/dist/hussar-operations.css';
import 'hussar-notice/dist/hussar-notice.css';
// import 'hussar-datasource/dist/hussar-datasource.css';
// import 'bpm-manage-server/dist/bpm-manage-server.css';
// import 'hussar-plugin/dist/hussar-plugin.css';
// import 'hussar-unifiedtodo/dist/hussar-unifiedtodo.css';
// import 'hussar-unified-log/dist/hussar-unified-log.css';
import 'hussar-mobile-config/dist/hussar-mobile-config.css';
import 'hussar-theme-config/dist/hussar-theme-config.css';
// import 'hussar-schedule/dist/hussar-schedule.css';
// import 'hussar-register/dist/hussar-register.css';
// import 'bpm-bpa/dist/bpm-bpa.css';
// import 'hussar-message/dist/hussar-message.css';
import 'hussar-migration/dist/hussar-migration.css';
import 'BpmShowWorkflow/dist/BpmShowWorkflow.css';
import 'ThemeBase/dist/ThemeBase.css';
import 'hussar-personal-matters/dist/hussar-personal-matters.css';
import 'hussar-fip-common/dist/hussar-fip-common.css';

// 依赖包页面
import Vue from 'vue';
import { allViews as HussarAuditViews } from 'hussar-audit';
import { allViews as HussarDatasourceViews } from 'hussar-datasource';
import { allViews as HussarAuthorizationViews } from 'hussar-authorization';
import { allViews as HussarConfigViews } from 'hussar-config';
import { allViews as HussarGeneralViews } from 'hussar-general';
import { allViews as HussarTenantViews } from 'hussar-tenant';
import { allViews as HussarOperationsViews } from 'hussar-operations';
import { allViews as HussarMobileConfigViews } from 'hussar-mobile-config';
import { allViews as BpmManageServerViews } from 'bpm-manage-server';
import { allViews as BpmBPAViews } from 'bpm-bpa';
import { allViews as HussarApplication } from 'hussar-application';
// import {allViews as HussarCasViews} from 'hussar-cas-agent';
import { allViews as HussarPluginViews } from 'hussar-plugin';
import { allViews as HussarUnifiedtodoViews } from 'hussar-unifiedtodo';
import { allViews as HussarNoticeViews } from 'hussar-notice';
import { allViews as HussarScheduleViews } from 'hussar-schedule';
import { allViews as HussarUnifiedLogViews } from 'hussar-unified-log';
import { allViews as HussarThemeViews } from 'hussar-theme-config';
import { allViews as HussarRegisterViews } from 'hussar-register';
import { allViews as HussarMessageViews } from 'hussar-message';
import { allViews as HussarIconViews } from 'hussar-icon';
import { allViews as HussarMigrationsViews } from 'hussar-migration';
// import { allViews as HussarMobilePlatform } from 'hussar-mobile-platform';
import { flowchartApi } from 'BpmShowWorkflow';
import { allViews as HussarFipViews } from 'hussar-fip';
import { allViews as HussarFipCommonViews } from 'hussar-fip-common';

Vue.prototype.$allViews = {
  ...HussarIconViews,
  ...HussarAuditViews,
  ...HussarDatasourceViews,
  ...HussarAuthorizationViews,
  ...HussarConfigViews,
  ...HussarGeneralViews,
  ...HussarTenantViews,
  ...HussarOperationsViews,
  ...HussarMobileConfigViews,
  ...BpmManageServerViews,
  ...BpmBPAViews,
  // ...HussarCasViews,
  ...HussarPluginViews,
  ...HussarUnifiedtodoViews,
  ...HussarNoticeViews,
  ...HussarScheduleViews,
  ...HussarUnifiedLogViews,
  ...HussarThemeViews,
  ...HussarRegisterViews,
  ...HussarMessageViews,
  ...HussarMigrationsViews,
  ...HussarApplication,
  ...HussarFipViews,
  ...HussarFipCommonViews
};

flowchartApi.setPrefix(process.env.VUE_APP_HUSSAR_DEFAULT_API);
