import { caching } from 'hussar-base';

const app = {
  state: {
    // 中英文
    internationalization: caching.session.get('internationalization') || 'zh',
    sidebar: {
      opened: !+caching.session.get('indexSidebarStatus'),
      withoutAnimation: false,
      isOpenMenu: true
    },
    device: 'desktop',
    // 所级应用
    exportOfflineApp: caching.session.get('HussarExportOfflineApp') === null ? [] : caching.session.get('HussarExportOfflineApp'), // 正在导出到线下环境的应用
    exportProApp: caching.session.get('HussarExportProApp') === null ? [] : caching.session.get('HussarExportProApp'), // 正在导出到生产环境的应用
    // 所级应用
    exportOfflineApp1: caching.session.get('HussarExportOfflineApp1') === null ? [] : caching.session.get('HussarExportOfflineApp1'), // 正在导出到线下环境的应用
    exportProApp1: caching.session.get('HussarExportProApp1') === null ? [] : caching.session.get('HussarExportProApp1') // 正在导出到生产环境的应用
  },
  mutations: {
    // 中英文
    SET_LANGUAGE: (state, language) => {
      state.internationalization = language;
      caching.session.set('internationalization', language);
    },
    CHANGE_MENU: (state, value) => {
      state.sidebar.isOpenMenu = value;
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        caching.session.set('indexSidebarStatus', 1);
      } else {
        caching.session.set('indexSidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      caching.session.set('indexSidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_EXPORTOFFLINE: (state, appId) => {
      state.exportOfflineApp.push(appId);
      console.log(state.exportOfflineApp.join(), 'state.exportOfflineApp.join()');
      caching.session.set('HussarExportOfflineApp', state.exportOfflineApp.join());
    },
    SET_EXPORTPRO: (state, appId) => {
      state.exportProApp.push(appId);
      caching.session.set('HussarExportProApp', state.exportProApp.join());
    },
    DEL_EXPORTOFFLINE: (state, appId) => {
      state.exportOfflineApp.forEach((item, index) => {
        if (item === appId) {
          state.exportOfflineApp.splice(index, 1);
        }
      });
      console.log(state.exportOfflineApp.join(), 'state.exportOfflineApp.join(0)');
      caching.session.set('HussarExportOfflineApp', state.exportOfflineApp.join());
    },
    DEL_EXPORTPRO: (state, appId) => {
      state.exportProApp.forEach((item, index) => {
        if (item === appId) {
          state.exportProApp.splice(index, 1);
        }
      });
      caching.session.set('HussarExportProApp', state.exportProApp.join());
    },
    SET_EXPORTOFFLINE1: (state, appId) => {
      state.exportOfflineApp1.push(appId);
      caching.session.set('HussarExportOfflineApp1', state.exportOfflineApp1.join());
    },
    SET_EXPORTPRO1: (state, appId) => {
      state.exportProApp1.push(appId);
      caching.session.set('HussarExportProApp1', state.exportProApp1.join());
    },
    DEL_EXPORTOFFLINE1: (state, appId) => {
      state.exportOfflineApp1.forEach((item, index) => {
        if (item === appId) {
          state.exportOfflineApp1.splice(index, 1);
        }
      });
      caching.session.set('HussarExportOfflineApp1', state.exportOfflineApp1.join());
    },
    DEL_EXPORTPRO1: (state, appId) => {
      state.exportProApp1.forEach((item, index) => {
        if (item === appId) {
          state.exportProApp1.splice(index, 1);
        }
      });
      caching.session.set('HussarExportProApp1', state.exportProApp1.join());
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device);
    },
    // 中英文
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    }
  }
};

export default app;
