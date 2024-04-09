import { caching } from 'hussar-base';

const app = {
  state: {
    // 中英文
    internationalization: caching.session.get('internationalization') || 'zh',
    sidebar: {
      opened: !+caching.session.get('consoleSidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop'
  },
  mutations: {
    // 中英文
    SET_LANGUAGE: (state, language) => {
      state.internationalization = language;
      caching.session.set('internationalization', language);
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        caching.session.set('consoleSidebarStatus', 1);
      } else {
        caching.session.set('consoleSidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      caching.session.set('consoleSidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
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
