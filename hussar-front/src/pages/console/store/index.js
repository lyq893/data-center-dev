import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/pages/console/store/modules/app';
import user from '@/pages/console/store/modules/user';
import permission from '@/pages/console/store/modules/permission';
import tagsView from '@/pages/console/store/modules/tagsView';
import navigation from '@/pages/console/store/modules/navigation';
import { config } from 'hussar-config';
import { ThemeBaseStore } from 'ThemeBase';
import { svgStore } from 'hussar-icon';
import { setWindowParam } from 'hussar-base';
import getters from '@/pages/console/store/getters';
import EventsStorePlugin from './EventsStorePlugin';
Vue.use(Vuex);

const index = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
    navigation,
    config,
    svgStore,
    ThemeBaseStore
  },
  plugins: [
    EventsStorePlugin
  ],
  getters
});
setWindowParam('consoleStore', index, {});
export default index;
