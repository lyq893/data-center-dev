<template>
  <div class="tags-view-container clearfix">
    <scroll-pane :vertical="false" :selected-tag-width="selectedTagWidth" ref="scrollPaneRef" :style="{width:width+'px',height:height+'px'}" id="paneTag"
                 class="tags-view-wrapper" style="min-width:98px;white-space:normal;" @selectedTagClick="selectedTagClick"
    >
      <draggable v-model="visitedViews" animation="300" @start="onStart" @end="onEnd" filter=".forbid" :move="onMove">
        <template v-for="(tag, i) in visitedViews">
          <router-link
            v-if="!tag.meta.affix && tag.meta.title !== 'staffInfo'"
            ref="tag"
            :key="getFullPath(tag)"
            :class="isActive(tag)?setActive(i):''"
            :to="{ path: tag.path, query: getTagQuery(tag.query), fullPath: tag.fullPath }"
            tag="div"
            class="tags-view-item"
            @click.middle.native="closeSelectedTag(tag)"
            @contextmenu.prevent.native="openMenu(tag,$event)"
          >
            <span v-if="tag.query.tablePageTitle" ref="title" class="tag-title">{{
              checkName(tag.query.tablePageTitle)
            }}</span>
            <span v-else ref="title" class="tag-title">{{ checkName(tag.title) }}</span>
            <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
          </router-link>
          <router-link
            v-else
            ref="tag"
            :key="tag.fullPath"
            :class="isActive(tag)?setActive(i):''"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            tag="div"
            class="tags-index-item"
            id="tag-item"
            @click.middle.native="closeSelectedTag(tag)"
            @contextmenu.prevent.native="openMenu(tag,$event)"
          >
            <span ref="title" class="tag-title forbid">
              <i class="font_family icon-hussar_home" style="font-size: 14px;position: relative;top: 1px;" />
              {{ $t('menu.homePage') }}
            </span>
          </router-link>
        </template>
      </draggable>
    </scroll-pane>
    <div class="more-page">
      <el-dropdown trigger="click">
        <i class="el-icon-caret-bottom" style="cursor: pointer" />
        <el-dropdown-menu slot="dropdown" class="tag-dropdown-box">
          <div class="tag-list">
            <template v-for="(tag,index) in visitedViews">
              <el-dropdown-item :key="index">
                <router-link
                  v-if="!tag.meta.affix"
                  :key="tag.fullPath"
                  :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                  tag="div"
                >
                  <span v-if="tag.query.tablePageTitle" class="tag-title" :title="tag.query.tablePageTitle">{{ tag.query.tablePageTitle }}</span>
                  <span v-else class="tag-title" :title="checkName(tag.title)">{{ checkName(tag.title) }}</span>
                </router-link>
                <router-link
                  v-else
                  :key="tag.fullPath"
                  :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                  tag="div"
                >
                  <span class="tag-title" :title="$t('menu.homePage')">{{ $t('menu.homePage') }}</span>
                </router-link>
              </el-dropdown-item>
            </template>
          </div>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">{{ $t('tagsView.refresh') }}</li>
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">
        {{ $t('tagsView.close') }}
      </li>
      <li v-if="!selectedTag.lastTag" @click="closeRightTags(selectedTag)">{{ $t('tagsView.closeRight') }}</li>
      <li @click="closeOthersTags(selectedTag)">{{ $t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>

<script>
import * as _ from 'lodash';
import ScrollPane from './ScrollPane';
import path from 'path';
import { caching, generateTitle, isObjectsEqual } from 'hussar-base';
import draggable from 'vuedraggable';

import * as HussarRouter from '@/utils/HussarRouter';

export default {
  components: { ScrollPane, draggable },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      offset: 0,
      tagPage: 0,
      allTag: 0,
      previous: false,
      next: false,
      affixTags: [],
      isMore: false,
      width: 0,
      height: 32,
      toggle: false,
      cacheTag: [],
      currentTag: {},
      closeRightClick: false,
      selectedTagWidth: 0
    };
  },
  computed: {
    meta() {
      if (this.$store.state.navigation.navigationMeta.title === undefined) {
        return {
          title: '欢迎使用',
          icon: ''
        };
      }
      return this.$store.state.navigation.navigationMeta;
    },
    tagsViewActive() {
      return this.$store.state.tagsView.active;
    },
    visitedViews: {
      set(val) {
        this.$store.dispatch('tagsView/changeVisitedViews', val);
      },
      get() {
        return this.$store.state.tagsView.visitedViews;
      }
    },
    routes() {
      return this.$store.state.permission.routers;
    }
  },
  watch: {
    $route(to) {
      if (to.query.tablePageTitle) {
        this.$route.query.tablePageTitle = to.query.tablePageTitle;
      }
      if (to.query && to.query.systemParams && JSON.parse(to.query.systemParams).isClick) {

      } else {
        this.addTags();
      }
      this.$nextTick(() => {
        this.moveToCurrentTag();
      });
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
    '$store.state.tagsView.visitedViews': {
      handler(newValue, oldValue) {
        if (newValue) {
          this.visitedViews.map((item, index) => {
            // 用来判断最后一个页签，给页签是否显示 关闭右侧 按钮标识
            if (this.visitedViews.length === (index + 1)) {
              item.lastTag = true;
            } else {
              item.lastTag = false;
            }
          });
        }
      },
      deep: true,
      immediate: true
    },
    // 监听vuex中侧边栏折叠状态
    '$store.state.app.sidebar.opened': {
      handler() {
        this.$nextTick(() => {
          this.moveToCurrentTag();
        });
      },
      deep: true
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: {
    getFullPath(router) {
      if (router.query && router.query.systemParams) {
        console.log(HussarRouter.getFullPath(router, true));
        return HussarRouter.getFullPath(router, true);
      }
      return router.fullPath;
    },
    onStart() {
      this.drag = true;
    },
    /**
     *  @click 移动过程中触发的事件
     *  e.relatedContext.index是拖拽标签前的标签个数；
     *  3（1+2）：1是本身，2是拖拽时left多出两个标签的宽度，为往后拖拽标签做准备；
     */
    onMove(e) {
      let activeTagsBeforeWidth = 0;
      const homePageWidth = document.querySelector('.tags-index-item').clientWidth; // index(首页)的宽度
      const tags = document.querySelectorAll('.tags-view-item');
      activeTagsBeforeWidth += homePageWidth;
      for (let i = 0; i < tags.length; i++) {
        if (i < (e.relatedContext.index + 3)) {
          activeTagsBeforeWidth = activeTagsBeforeWidth + tags[i].clientWidth;
        }
      }
      const tagsVisibleWidth = document.getElementById('paneTag').clientWidth; // 标签页容器宽度
      const fTag = document.getElementById('paneTag');
      const sTag = fTag.getElementsByClassName('el-scrollbar__wrap');
      if (tagsVisibleWidth > activeTagsBeforeWidth) {
        sTag[0].style.left = 0;
      } else {
        sTag[0].style.left = tagsVisibleWidth - activeTagsBeforeWidth + 'px';
      }
      if (e.relatedContext.element.meta.affix) return false;
      return true;
    },
    // 拖拽结束事件
    onEnd() {
      this.moveToCurrentTag();
      this.drag = false;
    },
    getTagQuery(query) {
      const queryCopy = _.cloneDeep(query);
      if (queryCopy && queryCopy.systemParams) {
        const systemParams = JSON.parse(queryCopy.systemParams);
        systemParams.isClick = true;
        systemParams.refresh = 0;
        queryCopy.systemParams = JSON.stringify(systemParams);
      }
      return queryCopy;
    },
    setActive(i) {
      this.$store.state.tagsView.active = i;
      return 'active';
    },
    checkName(name) {
      if (name === 'null' || name === 'no-name') {
        return generateTitle('未命名');
      } else {
        return generateTitle(name);
      }
    },
    isActive(route) {
      const { meta } = this.$route;
      const tag = this.cacheTag;
      if (meta.hideTag === undefined) {
        if (caching.session.get(window.appMultiple)) {
          if (this.$route.query && this.$route.query.systemParams) {
            if (HussarRouter.getFullPath(route, true) === HussarRouter.getFullPath(this.$route, true)) {
              return true;
            }
          }
          if (this.$route.query && this.$route.query.tabName) { // 当前route中有tabName，根据tabName判断
            if (route.query && route.query.tabName) {
              return route.query.tabName === this.$route.query.tabName;
            }
            return false;
          }
          if (route.query && route.query.tabName) {
            return false;
          }
          if (this.$route.query && this.$route.query.refresh) {
            const curQuery = _.cloneDeep(this.$route.query);
            delete curQuery.refresh;
            return route.path === this.$route.path && isObjectsEqual(route.query, curQuery);
          }
          return route.fullPath === this.$route.fullPath;
        } else {
          return route.path === this.$route.path;
        }
      } else {
        if (route.path === tag.path) {
          this.currentTag = route;
          return true;
        } else {
          return false;
        }
        // return route.path === tag.path
      }
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = [];
      if (routes) {
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path);
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            });
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path);
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags];
            }
          }
        });
      }
      return tags;
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes);
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name && tag.meta.hideTag === undefined) {
          this.$store.dispatch('tagsView/addVisitedView', tag);
        }
      }
    },
    addTags() {
      const {
        name,
        meta
      } = this.$route;
      if (name !== 'Dashboard' && name && meta.hideTag === undefined) {
        if (caching.session.get(window.appOpenType) === 0) {
          if (this.$store.state.tagsView.visitedViews[1]) {
            this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews[1]);
          }
        }
        this.$store.dispatch('tagsView/addVisitedView', this.$route);
        this.cacheTag = this.$route;
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (caching.session.get(window.appMultiple)) { // 如果开启多页签
            if (this.$route.query && this.$route.query.tabName) { // 有tabName时，根据tabName判断
              if (tag.to.query && tag.to.query.tabName && tag.to.query.tabName === this.$route.query.tabName) {
                this.$refs.scrollPaneRef.moveToTarget(tag); // 滚动到当前页签
                break;
              }
            } else if (this.$route.query && this.$route.query.refresh) { // 没有tabName时，有fresh时要先过滤掉，再根据fullPath判断
              const curQuery = _.cloneDeep(this.$route.query);
              delete curQuery.refresh;
              if (tag.to.path === this.$route.path && isObjectsEqual(tag.to.query, curQuery)) {
                this.$refs.scrollPaneRef.moveToTarget(tag); // 滚动到当前页签
                break;
              }
            } else { // 既没有tabName，也没有fresh，直接根据fullPath判断
              /**
               * this.$route.fullPath 和 tag.to.fullPath 只要相等，pthis.$route.path 和 tag.to.path 就一定相等
               * 但是this.$route.path 和 tag.to.path 相等时，this.$route.fullPath 和 tag.to.fullPath 不一定相等，当fullPath不相等时，需要更新一下
               */
              // this.$route.path 是激活状态的path,根据path相等找到激活状态的tag,且不是关闭右侧事件
              if (tag.to.path === this.$route.path && this.closeRightClick === false) {
                this.$refs.scrollPaneRef.moveToTarget(tag);
                break;
                // this.selectedTag.path 当前操作页签的tag,根据path相等找到操作页签的tag,且是关闭右侧事件
              } else if (tag.to.path === this.selectedTag.path && this.closeRightClick === true) {
                this.$refs.scrollPaneRef.moveToTarget(tag);
                break;
              }
            }
          } else {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPaneRef.moveToTarget(tag);
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('tagsView/updateVisitedView', this.$route);
              }
              break;
            }
          }
        }
      });
    },
    // 刷新选中tag
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', {
        view,
        freshAll: false
      }).then(() => {
        // 如果是首页，或者全路径一致
        if (view.name === 'Dashboard' || HussarRouter.getFullPath(view, true) === HussarRouter.getFullPath(this.$route, true)) {
          this.$nextTick(() => {
            const { fullPath } = view;
            let systemParams = {};
            if (this.$route.query && this.$route.query.systemParams) {
              systemParams = JSON.parse(this.$route.query.systemParams);
              systemParams.openType = 1;
            } else {
              systemParams = { openType: 1 };
            }
            this.$router.replace({
              path: '/redirect' + fullPath,
              query: {
                systemParams: JSON.stringify(systemParams)
              }
            });
          });
        }
      });
    },
    /**
     * 在删除之前查找删除页签的宽度，宽度 + 边框
     * @param view
     * @returns {Promise<void>}
     */
    async closeSelectedTag(view) {
      const tags = this.$refs.tag;
      tags.forEach(item => {
        if (item.to.path === view.path) {
          this.selectedTagWidth = item.$el.clientWidth + 1;
        }
      });
      await this.$store.dispatch('DelReturnPath', { tabName: HussarRouter.getTabName(view) });
      await this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toTargetView(visitedViews);
        } else {
          this.moveToCurrentTag();
        }
      });
    },
    // 用于判断是否为关闭按钮
    selectedTagClick() {
      this.selectedTagWidth = 0;
    },
    closeOthersTags(selectedTag) {
      this.$router.push({
        path: selectedTag.path,
        query: this.getTagQuery(selectedTag.query)
      });
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    // 关闭右侧
    async closeRightTags(selectedTag) {
      this.closecloseRightClick = true;
      if (this.$store.state.tagsView.visitedViews.indexOf(selectedTag) <= this.tagsViewActive) {
        this.$router.push({
          path: selectedTag.path,
          query: this.getTagQuery(selectedTag.query)
        });
      }
      await this.$store.dispatch('tagsView/delRightViews', this.selectedTag);
      await this.moveToCurrentTag();
      this.closeRightClick = false;
    },
    // 关闭所有
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.$route.path === view.path && this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews);
      });
    },
    toLastView(visitedViews) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        if (latestView.query && latestView.query.systemParams) {
          latestView.query = this.getTagQuery(latestView.query);
          this.$router.push({
            path: latestView.path,
            query: latestView.query
          });
          return;
        }
        this.$router.push(latestView.fullPath);
      } else {
        // You can set another route
      }
    },
    toTargetView: function (visitedViews) {
      let targetView;
      if (this.tagsViewActive === 1 && visitedViews.length !== 1) {
        targetView = visitedViews[1];
      } else {
        targetView = visitedViews.slice(this.tagsViewActive - 1, this.tagsViewActive)[0];
      }
      if (targetView) {
        if (targetView.query && targetView.query.systemParams) {
          targetView.query = this.getTagQuery(targetView.query);
          this.$router.push({
            path: targetView.path,
            query: targetView.query
          });
          return;
        }
        this.$router.push(targetView.fullPath);
      } else {
        // You can set another route
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetTop = this.$el.getBoundingClientRect().top; // container margin top
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY - offsetTop;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

.more-page {
  padding-right: 10px;
  @include background(color8);
  color: #969696;
  width: 24px;
  height: 27px;
  position: absolute;
  right: 0;
  top: 5px;
}

.tags-view-container {
  height: 32px;
  position: relative;
  margin: 0 !important;
  @include background(color8);
  border-top: 0;
  box-sizing: border-box;
  background-color: #F1F2F3;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);

  .tags-view-wrapper {
    width: calc(100% - 24px) !important;
    height: 100%;
    white-space: normal;

    .tags-index-item, .tags-view-item {
      position: relative;
      border-top-width: 0;
      border-bottom: 0;
      font-size: 12px;
      float: left;
      box-sizing: border-box;
      height: 32px;
      line-height: 32px;
      /*padding: 0 23px;*/
      color: #878787;
      cursor: pointer;
      white-space: nowrap;
      user-select: none;

      .el-icon-close:hover {
        background-color: #C2C7CC;
        color: #FFFFFF;
      }

      &:hover {
        background-color: #FAFAFA;

        .el-icon-close {
          visibility: visible;
        }
      }

      &.active {
        z-index: 10;
        height: 32px;

        .tag-title {
          border-right: 0;
        }

        &:before {
          left: -6px;
          transform: rotateY(180deg);
        }

        &:after {
          right: -6px;
        }

      }

      .tag-title {
        float: left;
        line-height: 32px;
        padding: 0 36px 0 12px;
        min-width: 99px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 400;
        font-family: PingFang-SC;
      }

    }

    .tags-index-item:first-child {
      border-left: 0;
      border-right: 1px solid #E8E8E8;
    }

    .tags-index-item.router-link-active {
      background-color: #ffff;
      z-index: 10;
      height: 32px;

      .tag-title {
        border-right: 0;
      }

    }

    .tags-index-item .tag-title {
      padding: 0 23px;
    }

    .tags-view-item {
      min-width: 99px;
      max-width: 150px;
      border-right: 1px solid #E8E8E8;
      transition: padding 0.05s linear;

      &.active {
        background-color: #FFFFFF;
        transition: padding 0.05s linear;

      }

    }

  }

  .contextmenu {
    margin: 0;
    background: #fff;
    // element弹窗等z-index为2000起，尽量低于这个数字
    z-index: 1970;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      font-size: 12px;
      color: #324558;
      line-height: 24px;
      padding: 0 15px;
      cursor: pointer;

      &:hover {
        background: #F5F7FA;
      }

    }

  }

  .svg-icon {
    width: 1em;
    height: 1em;
    margin-top: -4px;
    fill: #3269FF;
    position: absolute;
    right: 24px;
  }

}
</style>

<style lang="scss">
@import '~@/styles/mixin.scss';

.tags-view-wrapper {

  &.scroll-container {

    .el-scrollbar__wrap {
      height: auto;
      margin: 0 !important;
      overflow: hidden;
      width: max-content;
      position: relative;

      .tags-view-item {

        .el-icon-close {
          visibility: visible;
          position: absolute;
          color: #C2C7CC;
          right: 5px;
          top: 10px;
          font-size: 12px;
          border-radius: 50%;
          text-align: center;
          transform-origin: 100% 50%;
        }

      }

    }

    .el-scrollbar__bar {
      display: none;
    }

  }

}

.tag-dropdown-box {
  margin-top: 0 !important;
  padding: 8px 0;
  width:160px;

  .el-dropdown-menu__item {
    font-size: 12px;
    color: #4A4C66;
    line-height: 32px;

    >div {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

  }

  .router-link-exact-active.router-link-active {
    color: var(--c-themeColor);
  }

  .el-dropdown-menu__item:not(.is-disabled):hover{
    background: #F3F3F3;
    color: #4A4C66;
  }

  .popper__arrow, .popper__arrow::after {
    display: none;
  }

  .tag-dropdown-arrow {
    height: 16px;
    line-height: 16px;
    text-align: center;
    cursor: pointer;

    i {
      font-size: 16px;
      color: #969696;
    }

  }

  .tag-list {
    max-height: calc(100vh - 145px);
    overflow-y: hidden;

    &:hover {
      /*兼容火狐*/
      overflow-y: auto;
      overflow-y: overlay;
    }

  }

}
</style>
