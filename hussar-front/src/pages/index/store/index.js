import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/pages/index/store/modules/app';
import user from '@/pages/index/store/modules/user';
import permission from '@/pages/index/store/modules/permission';
import tagsView from '@/pages/index/store/modules/tagsView';
import navigation from '@/pages/index/store/modules/navigation';
import { config, configIndex } from 'hussar-config';
import { HussarThemeConfigStore } from 'hussar-theme-config';
import { ThemeBaseStore } from 'ThemeBase';
import { svgStore } from 'hussar-icon';
import { setWindowParam } from 'hussar-base';
import getters from '@/pages/index/store/getters';
import { HussarBaseUIStore } from 'HussarBaseUIComponent';
import * as APIS from '@/pages/index/api/lowcode/regionSelect.js';

HussarBaseUIStore.state.APIS = APIS;

Vue.use(Vuex);

const index = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
    navigation,
    config,
    configIndex,
    svgStore,
    HussarThemeConfigStore,
    ThemeBaseStore,
    HussarBaseUIStore
  },
  getters
});
setWindowParam('hussarStore', index, {});
export default index;
