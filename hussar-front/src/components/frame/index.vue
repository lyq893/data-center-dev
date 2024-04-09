<template>
  <div class="iframe-wrap tab-content" id="tabWrap" />
</template>
<script>
import * as _ from 'lodash';
import * as HussarRouter from '@/utils/HussarRouter';
import { v1 as uuid } from 'uuid';
import { caching } from 'hussar-base';
export default {
  name: 'Frame',
  data() {
    return {
      data: []
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    visitedViewsLen() {
      return this.visitedViews.length;
    },
    fromPaths() {
      return this.$store.state.permission.fromPaths;
    }
  },
  watch: {
    '$route'(to) {
      this.frameAdd(to);
    },
    visitedViewsLen(n, o) {
      if (n < o) {
        this.frameDeleteBatch(this.visitedViews);
      }
    }
  },
  methods: {
    getIdFromRoute(route) {
      if (route.query && route.query.systemParams) {
        return HussarRouter.getFullPath(route, true);
      }
      if (route.query && route.query.tabName) {
        return route.query.tabName;
      }
      if (route.query && route.query.refresh) {
        if (Object.keys(route.query).length === 1) {
          return route.path;
        } else {
          let fullPath = route.fullPath;
          if (fullPath.indexOf('?refresh=true') > 0) {
            fullPath = fullPath.replace('refresh=true&', '');
          } else if (fullPath.indexOf('&refresh=true') > 0) {
            fullPath = fullPath.replace('&refresh=true', '');
          }
          return fullPath;
        }
      }
      return route.fullPath;
    },
    /**
       * 创建iframe
       * @param route 路由信息
       */
    frameAdd(route) {
      const self = this;
      let id = '';
      if (!self.$route.meta.strategy) return;
      if (caching.session.get(window.appMultiple)) {
        id = self.getIdFromRoute(route);
      } else {
        id = route.name;
      }
      const url = route.meta.url;
      // 判断当前页面是否已经打开过
      const curTabItem = document.querySelector(`[data-id = '${id}']`);
      if (curTabItem) {
        // tab已经存在，直接切换到指定Tab项
        this.frameChange(id, true);
      } else {
        // 不存在，新增一个Tab项
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.dataset.id = id;
        iframe.scrolling = 'yes';
        iframe.className = 'tabIframe';
        const tabWrap = document.querySelector('#tabWrap');
        tabWrap.appendChild(iframe);

        iframe.addEventListener('load', function() {
          if (iframe.contentWindow.location.href.indexOf('html/#') > -1 ||
                iframe.contentDocument.title.indexOf('404') > -1 ||
                iframe.contentDocument.title.indexOf('Error') > -1) {
            self.$router.replace({
              path: '/404'
            });
          }
        });
        // 切换到指定Tab项
        this.frameChange(id, false);
      }
    },
    /**
       * 删除iframe
       * @param id 唯一标识（此处为路由name）
       */
    frameDelete(id) {
      const curTabItem = document.querySelector(`[data-id = '${id}']`);
      if (curTabItem) {
        curTabItem.parentNode.removeChild(curTabItem);
      }
    },
    /**
       * 批量删除iframe
       * @param visitedViews 当前打开的页面数组
       */
    frameDeleteBatch(visitedViews) {
      const self = this;
      const tabList = document.querySelectorAll('.tabIframe');
      if (tabList.length > 0) {
        for (let j = 0; j < tabList.length; j++) {
          const tabView = tabList[j];
          const dataId = tabView.getAttribute('data-id');
          const tabId = '';
          let index = -1;
          if (dataId.indexOf('tabName') > -1) {
            const tabId = tabView.getAttribute('data-id');
            index = visitedViews.findIndex((view) => HussarRouter.getFullPath(view, true) === tabId);
          } else {
            const tabId = tabView.dataset.id;
            index = visitedViews.findIndex((view) => view.name === tabId);
          }
          if (index < 0) {
            self.frameDelete(tabId);
          }
        }
      }
    },
    /**
       * 激活iframe
       * @param id 唯一标识（此处为路由name）
       * @param isReload 是否重加载
       */
    frameChange(id, isReload) {
      const curTabItem = document.querySelector(`[data-id = '${id}']`);
      const tabShow = document.querySelector('.tabShow');
      if (tabShow) {
        tabShow.classList.remove('tabShow');
      }
      curTabItem.classList.add('tabShow');
      //  tab切换是否刷新
      // let isRefresh = JSON.parse(caching.session.get(window.appTabSwitchOver));
      // if(isRefresh && isReload) {
      //   curTabItem.contentWindow.location.reload();
      // }
      const isRefresh = caching.session.get(window.appTabSwitchOver);
      if (isRefresh && isReload) {
        curTabItem.contentWindow.location.reload();
      }
    },
    /**
       * 关闭当前tab页面
       */
    closeTab() {
      const self = this;
      self.$store.dispatch('tagsView/delView', self.$route);
    },
    /**
       * 去除fresh
       * @param path
       * @returns {*}
       */
    notFresh(path) {
      if (!path) return;
      return path.replace('&refresh=true', '').replace('refresh=true&', '').replace('?refresh=true', '');
    }
  },
  mounted() {
    const self = this;
    self.frameAdd(this.$route);

    /* 对应框架页面中：页面跳转(默认跳转方式，打开新的tab页) */
    window.jumpToPage = function(pathObj, isSaveFrom, isClose) {
      if (!pathObj || !pathObj.path) return;
      if (isClose) {
        self.closeTab();
      }
      let allFresh = false; // 整体刷新
      let localFresh = false; // 局部刷新
      if (pathObj.query && pathObj.query.notCached) {
        allFresh = true;
      }
      if (pathObj.query && pathObj.query.systemParams) {
        localFresh = JSON.parse(pathObj.query.systemParams).refresh;
      }
      const fromRouter = self.$route;
      if (pathObj && pathObj.query && !pathObj.query.systemParams) {
        delete pathObj.query.refresh;
        pathObj.query.systemParams = JSON.stringify({
          tablePageTitle: '',
          tabName: HussarRouter.getFullPath(pathObj, false),
          refresh: 1,
          openType: 0
        });
      }
      self.$router.push(pathObj).then(() => {
        self.$nextTick(() => {
          if (isSaveFrom) {
            self.$store.dispatch('AddCurrentPath', { from: fromRouter, self: self.$route });
          }
          let id = ''; // 当前激活的iframe的id
          if (caching.session.get(window.appMultiple)) {
            id = self.getIdFromRoute(self.$route);
          } else {
            id = self.$route.name;
          }
          const curActiveTab = document.querySelector(`[data-id = '${id}']`);
          if (curActiveTab && curActiveTab.contentWindow) {
            if (allFresh) {
              curActiveTab.contentWindow.location.reload();
            } else if (localFresh && _.has(curActiveTab.contentWindow, 'curPageSelfFresh')) {
              curActiveTab.contentWindow.curPageSelfFresh();
            }
          }
        });
      });
    };

    /* 对应框架页面中：页面跳转(在当前tab页中打开) */
    window.jumpToPageInCurTag = function(param) {
      self.$store.dispatch('tagsView/setOpenInCurTag', { toPath: param.path, fromPath: self.$route.path }); // 设置当前路径跳转时在当前tab跳转
      if (param.query) {
        param.query.fromPath = self.$route.fullPath;
      } else {
        param.query = {};
        param.query.fromPath = self.$route.fullPath;
      }
      self.$router.push(param);
    };

    /* 对应框架页面中：关闭当前页 */
    window.closeCurrentPage = function() {
      self.closeTab();
      // 路由跳转
      self.$store.dispatch('tagsView/afterClosePath').then(({ afterClosePath }) => {
        self.$router.push({
          path: afterClosePath
        });
      });
    };

    /* 对应框架页面中：获取路由参数 */
    window.getQuery = function(field) {
      return self.$route.query[field];
    };

    /* 对应框架页面中：关闭tab页面 */
    window.closeTab = function() {
      self.closeTab();
    };

    /* 对应框架页面中：获取sessionStorage变量 */
    window.getSessionItem = function(field) {
      return caching.session.get(field);
    };

    /* 对应框架页面中：通过replace跳转到指定路径 */
    window.replacePage = function(path) {
      self.$router.replace(path);
    };

    /* 对应框架页面中：返回上一页动作 */
    window.returnPreviousPage = function(isClose) {
      const fromRouter = self.$store.state.permission.fromPaths || {};
      const fullPath = HussarRouter.getFullPath(self.$route, true);
      // fromRouter.hasOwnProperty(fullPath)
      // Object.prototype.hasOwnProperty.call(fromRouter, fullPath)
      if (Object.prototype.hasOwnProperty.call(fromRouter, fullPath)) {
        const fromRoute = fromRouter[fullPath][0];
        const tabName = HussarRouter.getTabName(fromRoute);
        const query = _.cloneDeep(fromRoute.query);
        const path = fromRoute.path;
        const pathObj = { path: path, query: query };
        if (pathObj && pathObj.query) {
          delete pathObj.query.refresh;
          pathObj.query.systemParams = JSON.stringify({
            tablePageTitle: '',
            tabName: tabName,
            refresh: 1,
            openType: 0
          });
        }
        if (isClose) {
          self.closeTab();
        }
        top.window.jumpToPage(pathObj);
      } else {
        top.window.returnTag(isClose);
      }
      // if (self.$route.query.fromPath) {
      //   self.$router.push({
      //     path: self.$route.query.fromPath,
      //   });
      // } else {
      //   self.closeTab();
      //   self.$store.dispatch('tagsView/afterClosePath').then(({ afterClosePath }) => {
      //     self.$router.push({
      //       path: afterClosePath,
      //     });
      //   })
      // }
    };

    /* 对应框架页面中：获得当前页面的路径*/
    window.getFullPath = function() {
      return self.$route.fullPath;
    };

    /* 对应框架页面中：返回上一个Tab页 */
    window.returnTag = function(isClose) {
      const visitedViews = self.visitedViews;
      const fullRouter = self.$route;
      let index = 1;
      for (let i = 0; i < visitedViews.length; i++) {
        if (HussarRouter.getFullPath(visitedViews[i], true) === HussarRouter.getFullPath(fullRouter, true)) index = i;
      }
      const path = visitedViews[index - 1].path;
      const tabName = HussarRouter.getTabName(visitedViews[index - 1]);
      const query = _.cloneDeep(visitedViews[index - 1].query);
      const pathObj = { path: path, query: query };
      if (pathObj && pathObj.query) {
        delete pathObj.query.refresh;
        pathObj.query.systemParams = JSON.stringify({
          tablePageTitle: '',
          tabName: tabName,
          refresh: 1,
          openType: 0
        });
        pathObj.query.refresh = true;
      }
      if (isClose) {
        self.closeTab();
      }
      top.window.jumpToPage(pathObj);
    };

    /* 对应框架页面中：关闭当前页并且返回上一个Tab页 */
    window.returnCloseTag = function() {
      let num = 1;
      for (let i = 0; i < self.visitedViewsLen; i++) {
        if (self.$route.path === self.visitedViews[i].path) {
          num = i;
        }
      }
      self.closeTab();
      top.window.jumpToPage({
        path: self.visitedViews[num - 1].path
      });
    };

    /*  添加来源路径和自身路径到store */
    window.addFromPath = function({ fromPath, selfPath }) {
      self.$store.dispatch('AddFromPath', { from: fromPath, self: selfPath });
    };

    /* 获取visitedViews */
    window.getVisitedViews = function() {
      return self.visitedViews;
    };

    window.showSuccessMessage = function(msg) {
      self.$message.success(msg);
    };
    window.showWarningMessage = function(msg) {
      self.$message.warning(msg);
    };
    window.showErrorMessage = function(msg) {
      self.$message.error(msg);
    };
    window.showInfoMessage = function(msg) {
      self.$message.info(msg);
    };

    // 不重启环境下跳转方式
    // 跳转到选中的页面
    window.jumpPage = function(pathObj, paramsObj) {
      if (!pathObj || !pathObj.path) return;
      if (HussarRouter.getFullPath(pathObj, true) === HussarRouter.getFullPath(self.$route, true)) {
        paramsObj.isClose = 0;
      }
      let allFresh = false; // 整体刷新
      let localFresh = false; // 局部刷新
      const systemParams = pathObj && pathObj.query && pathObj.query.systemParams ? JSON.parse(pathObj.query.systemParams) : null;
      if (paramsObj.isClose && systemParams && systemParams.openType === 1) {
        paramsObj.clearCache = 1;
      } else if (paramsObj.isClose) {
        self.closeTab();
      }
      if (paramsObj && paramsObj.refresh === 2) {
        allFresh = true;
      }
      if (paramsObj && paramsObj.refresh === 1) {
        localFresh = true;
      }
      if (paramsObj.clearCache) {
        const id = HussarRouter.getFullPath(self.$route, true);
        self.frameDelete(id);
      }
      const fromRoute = self.$route;
      if (pathObj.query && pathObj.query.systemParams) {
        const systemParams = JSON.parse(pathObj.query.systemParams);
        if (systemParams.openType === 1) {
          const tabName = HussarRouter.getTabName(self.$route);
          systemParams.tabName = tabName;
          pathObj.query.systemParams = JSON.stringify(systemParams);
        }
        if (systemParams.openType === 2) {
          let isOpenNewPage = true;
          let index = 1;
          for (let i = 0; i < self.visitedViews.length; i++) {
            if (isOpenNewPage && HussarRouter.getFullPath(self.visitedViews[i], false) === HussarRouter.getFullPath(pathObj, false)) {
              isOpenNewPage = false;
              index = i;
            }
          }
          if (isOpenNewPage) {
            const pathObjNew = {};
            pathObjNew.path = pathObj.path;
            pathObjNew.query = pathObj.query || {};
            pathObjNew.query.systemParams = JSON.stringify({ tabName: uuid(), openType: 0, refresh: paramsObj.refresh || 0 });
            pathObj = pathObjNew;
          } else {
            const tabName = HussarRouter.getTabName(self.visitedViews[index]);
            let systemParams = { tabName: null };
            if (pathObj.query && pathObj.query.systemParams) {
              systemParams = JSON.parse(pathObj.query.systemParams);
            }
            systemParams.tabName = tabName;
            pathObj.query = _.cloneDeep(self.visitedViews[index].query) || { tabName: null };
            pathObj.query.systemParams = JSON.stringify(systemParams);
          }
        }
      }
      if (HussarRouter.getFullPath(pathObj, true) === HussarRouter.getFullPath(self.$route, true)) {
        let id = ''; // 当前激活的iframe的id
        if (caching.session.get(window.appMultiple)) {
          id = self.getIdFromRoute(self.$route);
        } else {
          id = self.$route.name;
        }
        const curActiveTab = document.querySelector(`[data-id = '${id}']`);
        if (curActiveTab && curActiveTab.contentWindow) {
          if (allFresh) {
            curActiveTab.contentWindow.location.reload();
          } else if (localFresh && _.has(curActiveTab.contentWindow, 'curPageSelfFresh')) {
            curActiveTab.contentWindow.curPageSelfFresh();
          }
        }
      } else {
        self.$router.push(pathObj).then(() => {
          self.$nextTick(() => {
            if (paramsObj.isSaveFrom === 1) {
              self.$store.dispatch('AddCurrentPath', { from: fromRoute, self: self.$route });
            } else if (paramsObj.isSaveFrom === 2) {
              self.$store.dispatch('AddReturnPath', { from: fromRoute, self: self.$route });
            }
            let id = ''; // 当前激活的iframe的id
            if (caching.session.get(window.appMultiple)) {
              id = self.getIdFromRoute(self.$route);
            } else {
              id = self.$route.name;
            }
            const curActiveTab = document.querySelector(`[data-id = '${id}']`);
            if (curActiveTab && curActiveTab.contentWindow) {
              if (allFresh) {
                curActiveTab.contentWindow.location.reload();
              } else if (localFresh && _.has(curActiveTab.contentWindow, 'curPageSelfFresh')) {
                curActiveTab.contentWindow.curPageSelfFresh();
              }
            }
          });
        });
      }
    };
    // 跳转到前一个Tab
    window.jumpTab = function(pathObj, paramsObj) {
      const route = self.$route;
      let index = 1;
      for (let i = 0; i < self.visitedViews.length; i++) {
        if (HussarRouter.getFullPath(self.visitedViews[i], true) === HussarRouter.getFullPath(route, true)) index = i;
      }
      pathObj.path = _.cloneDeep(self.visitedViews[index - 1].path);
      const tabName = HussarRouter.getTabName(self.visitedViews[index - 1]);
      let systemParams = { tabName: null };
      if (pathObj.query && pathObj.query.systemParams) {
        systemParams = JSON.parse(pathObj.query.systemParams);
      }
      systemParams.tabName = tabName;
      systemParams.openType = 0;
      pathObj.query = _.cloneDeep(self.visitedViews[index - 1].query) || { tabName: null };
      pathObj.query.systemParams = JSON.stringify(systemParams);
      top.window.jumpPage(pathObj, paramsObj);
    };
    window.jumpSource = function(pathObj, paramsObj) {
      const fromPaths = self.$store.state.permission.fromPaths || {};
      const fullPath = HussarRouter.getFullPath(self.$route, true);
      // fromPaths.hasOwnProperty(fullPath)
      if (Object.prototype.hasOwnProperty.call(fromPaths, fullPath) && fromPaths[fullPath].length === 2 && fromPaths[fullPath][1]) {
        const systemParams = pathObj.query.systemParams;
        pathObj.path = _.cloneDeep(fromPaths[fullPath][1].path);
        pathObj.query = _.cloneDeep(fromPaths[fullPath][1].query);
        pathObj.query.systemParams = systemParams;
        top.window.jumpPage(pathObj, paramsObj);
      } else {
        top.window.jumpTab(pathObj, paramsObj);
      }
    };
    window.jumpSourceTab = function(pathObj, paramsObj) {
      const fromPaths = self.fromPaths || {};
      const fullPath = HussarRouter.getFullPath(self.$route, true);
      const visitedViews = self.visitedViews;
      if (Object.prototype.hasOwnProperty.call(fromPaths, fullPath) && fromPaths[fullPath].length === 2 && fromPaths[fullPath][1]) {
        const fromRoute = fromPaths[fullPath][1];
        const tabName = HussarRouter.getTabName(fromRoute);
        for (let i = 0; i < visitedViews.length; i++) {
          if (HussarRouter.getTabName(visitedViews[i]) === tabName) {
            const view = visitedViews[i];
            pathObj.path = view.path;
            const systemParams = JSON.parse(pathObj.query.systemParams);
            pathObj.query = _.cloneDeep(view.query);
            systemParams.tabName = tabName;
            systemParams.openType = 0;
            pathObj.query.systemParams = JSON.stringify(systemParams);
            top.window.jumpPage(pathObj, paramsObj);
            return;
          }
        }
        top.window.jumpTab(pathObj, paramsObj);
      } else {
        top.window.jumpTab(pathObj, paramsObj);
      }
    };
    window.closeTabNew = function() {
      const self = this;
      const frames = document.querySelectorAll('iframe[data-id]');
      for (let i = 0; i < frames.length; i++) {
        const curTabItem = frames[i];
        const tabName = HussarRouter.getTabName(self.$route);
        if (curTabItem.getAttribute('data-id').indexOf(tabName)) {
          if (curTabItem) {
            curTabItem.parentNode.removeChild(curTabItem);
          }
        }
      }
      self.$store.dispatch('tagsView/delView', self.$route);
    };
    window.getFromTab = function() {
      if (self.fromPaths && self.fromPaths[HussarRouter.getFullPath(self.$route, true)] && self.fromPaths[HussarRouter.getFullPath(self.$route, true)].length === 2) {
        return self.fromPaths[HussarRouter.getFullPath(self.$route, true)][1].meta.title;
      }
      return '';
    };
  }
};
</script>
<style>
  .iframe-wrap, .iframe-wrap iframe{width:100%;height:100%;}
  .tab-content, .tab-content .tabIframe{
    width:100%;
    height:100%;
    border:0;
  }
  .tab-content .tabIframe{
    display:none;
  }
  .tab-content .tabIframe.tabShow{
    display:block;
  }
</style>
