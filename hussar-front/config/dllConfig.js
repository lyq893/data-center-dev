module.exports = {
  entries: {
    base: [
      'vue-router/dist/vue-router.esm.js',
      'vuex/dist/vuex.esm.js',
      'js-md5',
      'core-js',
      'js-base64',
      'vue-i18n/dist/vue-i18n.esm.js',
      'numeral',
      'v-click-outside',
      'sync-session-storage',
      '@/directives/drag_dialog',
      'lodash'
    ],
    elementUI: [
      'element-ui',
      'element-ui/lib/locale/lang/en.js',
      '@/styles/element-variables.scss',
      'axios',
      'jquery',
      '@wchbrad/vue-easy-tree',
      'BpmShowWorkflow',
      'BpmShowWorkflow/dist/BpmShowWorkflow.css',
      'hussar-base',
      'hussar-common',
      'hussar-common/dist/hussar-common.css',
      'hussar-general',
      'normalize.css/normalize.css'
    ],
    indexScss: [
      '@/styles/index.scss'
    ],
    echartsVxeTable: [
      'echarts',
      'vxe-table',
      'vxe-table/lib/index.css',
      'xe-utils',
      'moment',
      "dayjs"
    ]
  },
  indexScripts: ['base', 'elementUI', 'indexScss', 'echartsVxeTable'],
  indexStyles: ['elementUI', 'indexScss'],
  consoleScripts: ['base', 'elementUI', 'echartsVxeTable'],
  consoleStyles: ['elementUI']
};
