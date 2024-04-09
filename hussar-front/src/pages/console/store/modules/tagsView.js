import { caching } from 'hussar-base';

const state = {
  visitedViews: [],
  cachedViews: [],
  noCachedViews: ['scheduleInstance', 'unifiedLog']// 任务实例| 统一日志
};

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    // 是否开启多页签
    if (caching.session.get(window.appMultiple)) {
      // 任务实例和链路追踪有在页面上直接跳转的，会带参数，从菜单点击打开的不带参数，路径不同就会新增一个页签
      // 同时操作会有两个页签
      // 处理这个的
      if (view.path === '/scheduleInstance' || view.path === '/linkTracking' || view.path === '/unifiedLog') {
        if (state.visitedViews.some(v => v.path === view.path)) {
          for (let i = 1; i < state.visitedViews.length; i++) {
            if (state.visitedViews[i].path === view.path) {
              state.visitedViews[i] = view;
              return;
            }
          }
        }
        // fullPath：页签完整路径(包含查询参数)
      } else if (state.visitedViews.some(v => v.fullPath === view.fullPath)) return;
    } else {
      if (state.visitedViews.some(v => v.path === view.path)) return;
    }
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    );
  },
  ADD_CACHED_VIEW: (state, view) => {
    const name = view.name;
    if (state.noCachedViews.includes(view.name)) return;
    if (state.cachedViews.includes(name)) return;
    const isCache = caching.session.get(window.appTabSwitchOver);
    if (!isCache) {
      state.cachedViews.push(name);
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        if (caching.session.get(window.appMultiple)) {
          if (v.fullPath === view.fullPath) {
            state.visitedViews.splice(i, 1);
            break;
          }
        } else {
          state.visitedViews.splice(i, 1);
          break;
        }
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    for (const i of state.cachedViews) {
      const name = view.name;
      if (i === name) {
        const index = state.cachedViews.indexOf(i);
        state.cachedViews.splice(index, 1);
        break;
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      if (caching.session.get(window.appMultiple)) {
        return v.meta.affix || v.fullPath === view.fullPath;
      } else {
        return v.meta.affix || v.path === view.path;
      }
    });
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedViews) {
      const name = view.name;
      if (i === name) {
        const index = state.cachedViews.indexOf(i);
        state.cachedViews = state.cachedViews.slice(index, index + 1);
        break;
      }
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix);
    state.visitedViews = affixTags;
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = [];
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }
};

const actions = {
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view);
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view);
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view);
      dispatch('delCachedView', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  removeCacheView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delCachedView', view);
      resolve({
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view);
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view);
      resolve([...state.cachedViews]);
    });
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view);
      dispatch('delOthersCachedViews', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view);
      resolve([...state.visitedViews]);
    });
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view);
      resolve([...state.cachedViews]);
    });
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view);
      dispatch('delAllCachedViews', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS');
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS');
      resolve([...state.cachedViews]);
    });
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
