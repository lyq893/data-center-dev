import * as _ from 'lodash';
import * as HussarRouter from '@/utils/HussarRouter';
import { caching } from 'hussar-base';

const state = {
  visitedViews: [],
  cachedViews: [],
  notAddTagPaths: [],
  noCachedViews: [],
  active: 0,
  cacheKeys: {}
};

const mutations = {
  CHANGE_VISITED_VIEWS: (state, val) => {
    state.visitedViews = val;
  },
  ADD_VISITED_VIEW: (state, view) => {
    if (caching.session.get(window.appMultiple)) {
      let fullPath = '';
      const tempRouter = {};
      if (view.query && view.query.refresh) { // 如果有fresh，去除fresh
        fullPath = view.fullPath;
        if (Object.keys(view.query).length === 1) {
          fullPath = fullPath.replace('?refresh=true', '');
        } else if (view.fullPath.indexOf('?refresh=true') > 0) {
          fullPath = fullPath.replace('refresh=true&', '');
        } else if (view.fullPath.indexOf('&refresh=true') > 0) {
          fullPath = fullPath.replace('&refresh=true', '');
        }
        const cloneView = _.cloneDeep(view.query);
        delete cloneView.refresh;
        tempRouter.hash = view.hash;
        tempRouter.fullPath = fullPath;
        tempRouter.matched = view.matched;
        tempRouter.meta = view.meta;
        tempRouter.name = view.name;
        tempRouter.params = view.params;
        tempRouter.path = view.path;
        tempRouter.query = cloneView;
        tempRouter.title = view.meta.title || 'no-name';
      }
      if (view.query && view.query.tabName) {
        for (let i = 0; i < state.visitedViews.length; i++) {
          if (state.visitedViews[i].query && state.visitedViews[i].query.tabName &&
            state.visitedViews[i].query.tabName === view.query.tabName) { // 如果已经有同名的页签，更新一下，直接return
            let v = state.visitedViews[i];
            if (Object.keys(tempRouter).length > 0) {
              v = Object.assign(v, tempRouter);
            } else {
              v = Object.assign(v, view);
              if (v.title !== view.meta.title) {
                v.title = view.meta.title || 'no-name';
              }
            }
            return;
          }
        }
      } else { // 没有tabName时，仍根据fullPath
        if (view.query && view.query.systemParams) {
          const systemParams = JSON.parse(view.query.systemParams);
          if (systemParams.openType === 1) {
            const tablePageTitle = JSON.parse(view.query.systemParams).tablePageTitle;
            if (state.active && state.visitedViews[state.active]) {
              state.visitedViews[state.active] = Object.assign({}, view, { title: tablePageTitle || view.meta.title || 'no-name' });
              return;
            }
          }
          if (systemParams.openType === 0) {
            for (let i = 1; i < state.visitedViews.length; i++) {
              const tabName1 = HussarRouter.getTabName(state.visitedViews[i]);
              const tabName2 = HussarRouter.getTabName(view);
              if (tabName1 === tabName2) {
                const tablePageTitle = JSON.parse(view.query.systemParams).tablePageTitle;
                state.visitedViews[i] = Object.assign({}, view, { title: tablePageTitle || view.meta.title || 'no-name' });
                return;
              }
            }
            const tablePageTitle = JSON.parse(view.query.systemParams).tablePageTitle;
            // 传入参数: 在激活状态后一个添加，删除0个，需要添加的值
            state.visitedViews.splice(state.active + 1, 0, Object.assign({}, view, { title: tablePageTitle || view.meta.title || 'no-name' }));
            return;
          }
          if (systemParams.openType === 2) {
            for (let i = 1; i < state.visitedViews.length; i++) {
              const fullPath1 = HussarRouter.getFullPath(view, false);
              const fullPath2 = HussarRouter.getFullPath(state.visitedViews[i], false);
              if (fullPath1 === fullPath2) {
                const systemParams = JSON.parse(view.query.systemParams);
                const tablePageTitle = systemParams.tablePageTitle;
                view.query.systemParams = JSON.stringify(systemParams);
                state.visitedViews[i].title = tablePageTitle || view.meta.title || 'no-name';
                return;
              }
            }
          }
        } else if (!view.query) {
          for (let i = 0; i < state.visitedViews.length; i++) {
            if (HussarRouter.getFullPath(state.visitedViews[i], true) === HussarRouter.getFullPath(view, true)) {
              return;
            }
          }
          state.visitedViews.push(Object.assign({}, view, { title: view.meta.title || 'no-name' }));
          return;
        }

        const curFullPath = fullPath || view.fullPath;
        for (let i = 0; i < state.visitedViews.length; i++) {
          if ((!state.visitedViews[i].query || (state.visitedViews[i].query && !state.visitedViews[i].query.tabName)) &&
              state.visitedViews[i].fullPath === curFullPath) { // 如果已经存在fullPath相同的页签，更新一下，直接return
            let v = state.visitedViews[i];
            if (Object.keys(tempRouter).length > 0) {
              v = Object.assign(v, tempRouter);
            } else {
              v = Object.assign(v, view);
              if (v.title !== view.meta.title) {
                v.title = view.meta.title || 'no-name';
              }
            }
            return;
          }
        }
      }
      if (Object.keys(tempRouter).length > 0) {
        state.visitedViews.push(tempRouter);
        return;
      }
    } else { // 未开启多页签，仍然根据path判断
      if (state.visitedViews.some(v => v.path === view.path)) {
        for (let v of state.visitedViews) { // 相等时更新下页签中存的信息，比如页签名称
          if (v.path === view.path) {
            v = Object.assign(v, view);
            if (v.title !== view.meta.title) {
              v.title = view.meta.title || 'no-name';
            }
            break;
          }
        }
        return;
      }
    }
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    );
  },
  ADD_CACHED_VIEW: (state, view) => {
    // let name = view.name.slice(1);
    if (Object.prototype.hasOwnProperty.call(view, 'name')) {
      if (view.name && view.name !== view.path) {
        if (state.noCachedViews.includes(view.name)) return;
        if (state.cachedViews.includes(view.name)) return;
        const isCache = caching.session.get(window.appTabSwitchOver);
        if (!isCache) {
          state.cachedViews.push(view.name);
        }
      }
    }
  },
  UPDATE_VISITED_VIEW_NAME: (state, { path, name }) => {
    if (name !== '') {
      const views = state.visitedViews;
      for (let i = 0; i < views.length; i++) {
        if (views[i].path === path && views[i].name !== name) {
          state.visitedViews[i].title = name;
        }
      }
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    let fullPath = view.fullPath;
    if (view.fullPath.indexOf('?refresh=true') > 0) {
      fullPath = fullPath.replace('refresh=true&', '');
    } else if (view.fullPath.indexOf('&refresh=true') > 0) {
      fullPath = fullPath.replace('&refresh=true', '');
    }
    for (const [i, v] of state.visitedViews.entries()) {
      if (caching.session.get(window.appMultiple)) {
        if (HussarRouter.getFullPath(v, true) === HussarRouter.getFullPath(view, true)) {
          state.visitedViews.splice(i, 1);
          break;
        }
      } else {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW: (state, { view, freshAll }) => {
    if (view.meta.strategy) {
      // 不重启
      const frames = document.querySelectorAll('iframe[data-id]');
      for (let i = 0; i < frames.length; i++) {
        const id = frames[i].getAttribute('data-id');
        const index1 = id.lastIndexOf('tabName=');
        const index2 = id.indexOf(HussarRouter.getFullPath(view, true));
        if (freshAll) {
          if (id.substring(index2, id.length) === HussarRouter.getFullPath(view, true) || id.substring(index1 + 8, id.length) === HussarRouter.getTabName(view)) {
            frames[i].parentNode.removeChild(frames[i]);
          }
        } else {
          if (id.substring(index2, id.length) === HussarRouter.getFullPath(view, true)) {
            frames[i].parentNode.removeChild(frames[i]);
          }
        }
      }
    } else {
      // 重启
      const cache = state.cacheKeys;
      Object.keys(cache).forEach((item) => {
        const index1 = item.lastIndexOf('tabName=');
        const index2 = item.indexOf(HussarRouter.getFullPath(view, true));
        if (freshAll) {
          if (item.substring(index2, item.length) === HussarRouter.getFullPath(view, true) || item.substring(index1 + 8, item.length) === HussarRouter.getTabName(view)) {
            delete cache[item];
          }
        } else {
          if (item.substring(index2, item.length) === HussarRouter.getFullPath(view, true)) {
            delete cache[item];
          }
        }
      });
      const name = view.name;
      if (name) {
        for (const i of state.cachedViews) {
          if (i === name) {
            const index = state.cachedViews.indexOf(i);
            state.cachedViews.splice(index, 1);
            break;
          }
        }
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
    if (view.meta.strategy) {
      const frames = document.querySelectorAll('iframe[data-id]');
      for (let i = 0; i < frames.length; i++) {
        const curTabItem = frames[i];
        const tabName = HussarRouter.getTabName(view);
        if (curTabItem.getAttribute('data-id').indexOf(tabName) === -1) {
          curTabItem.parentNode.removeChild(curTabItem);
        }
      }
    } else {
      for (const i of state.cachedViews) {
        const name = view.name;
        if (i === name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews = state.cachedViews.slice(index, index + 1);
          break;
        }
      }
      const cache = state.cacheKeys;
      Object.keys(cache).forEach((item) => {
        if (item.indexOf(HussarRouter.getFullPath(view, true)) === -1) {
          delete cache[item];
        }
      });
    }
  },
  DEL_RIGHT_VISITED_VIEWS: (state, view) => {
    const rightTabIndex = state.visitedViews.indexOf(view);
    const index = rightTabIndex + 1;
    const howmany = state.visitedViews.length - rightTabIndex + 1;
    state.visitedViews.splice(index, howmany);
  },
  DEL_RIGHT_CACHED_VIEWS: (state, view) => {
    if (view.meta.strategy) {
      const frames = document.querySelectorAll('iframe[data-id]');
      for (let i = 0; i < frames.length; i++) {
        const curTabItem = frames[i];
        const tabName = HussarRouter.getTabName(view);
        if (curTabItem.getAttribute('data-id').indexOf(tabName) === -1) {
          curTabItem.parentNode.removeChild(curTabItem);
        }
      }
    } else {
      for (const i of state.cachedViews) {
        const name = view.name;
        if (i === name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews = state.cachedViews.slice(index, index + 1);
          break;
        }
      }
      const cache = state.cacheKeys;
      Object.keys(cache).forEach((item) => {
        if (item.indexOf(HussarRouter.getFullPath(view, true)) === -1) {
          delete cache[item];
        }
      });
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
  },

  UPDATE_CACHE_KEYS: (state, keys) => {
    state.cacheKeys = keys;
  },

  OPEN_IN_CUR_TAG: (state, { toPath, fromPath }) => {
    if (toPath && fromPath) {
      const goPath = { to: toPath, from: fromPath };
      const returnPath = { to: fromPath, from: toPath };
      let flag1 = false;
      let flag2 = false;
      for (let i = 0; i < state.notAddTagPaths.length; i++) {
        if (state.notAddTagPaths[i].to === toPath && state.notAddTagPaths[i].from === fromPath) {
          flag1 = true;
        }
        if (state.notAddTagPaths[i].to === fromPath && state.notAddTagPaths[i].from === toPath) {
          flag2 = true;
        }
      }
      if (!flag1) {
        state.notAddTagPaths.push(goPath);
      }
      if (!flag2) {
        state.notAddTagPaths.push(returnPath);
      }
    }
  },

  REPLACE_TAG: (state, { to, from }) => {
    if (to && from) {
      for (let v of state.visitedViews) {
        if (v.path === from.path) {
          v = Object.assign(v, to);
          v.title = to.meta.title;
          break;
        }
      }
    }
  }
};

const actions = {
  changeVisitedViews({ commit }, val) {
    commit('CHANGE_VISITED_VIEWS', val);
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view);
  },
  addCachedView({ commit }, view) {
    return new Promise(resolve => {
      commit('ADD_CACHED_VIEW', view);
      resolve([...state.cachedViews]);
    });
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view);
      dispatch('delCachedView', { view, freshAll: true });
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  removeCacheView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delCachedView', { view });
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
  delCachedView({ commit, state }, { view, freshAll }) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', { view, freshAll });
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
  delRightViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delRightVisitedViews', view);
      dispatch('delRightCachedViews', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delRightVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_VISITED_VIEWS', view);
      resolve([...state.visitedViews]);
    });
  },
  delRightCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_CACHED_VIEWS', view);
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
  },

  updateCaCheKeys({ commit }, keys) {
    commit('UPDATE_CACHE_KEYS', keys);
  },

  setOpenInCurTag({ commit }, { toPath, fromPath }) {
    commit('OPEN_IN_CUR_TAG', { toPath, fromPath });
  },

  afterClosePath({ state }) {
    return new Promise(resolve => {
      const visitedViews = state.visitedViews;
      let path = '';
      if (visitedViews.length === 1) {
        path = '/index';
      } else {
        path = visitedViews[visitedViews.length - 1].fullPath;
      }
      resolve({
        afterClosePath: path
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
