<template>
  <div class="tags-view-container clearfix">
    <scroll-pane :vertical="false" :selected-tag-width="selectedTagWidth" ref="scrollPaneRef" :style="{width:width+'px',height:height+'px'}" id="paneTag" class="tags-view-wrapper" style="min-width:98px;white-space:normal;" @selectedTagClick="selectedTagClick">
      <template v-for="tag in visitedViews">
        <router-link
          v-if="!tag.meta.affix && tag.meta.title !== 'staffInfo'"
          ref="tag"
          :key="tag.fullPath"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="div"
          class="tags-view-item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <span v-if="tag.query.tablePageTitle" ref="title" class="tag-title">{{ tag.query.tablePageTitle }}</span>
          <span v-else ref="title" class="tag-title">{{ generateTitle(tag.title) }}</span>
          <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
        <router-link
          v-else-if="tag.meta.title === 'staffInfo'"
          ref="tag"
          :key="tag.fullPath"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.fullPath, query: tag.query, fullPath: tag.fullPath }"
          tag="div"
          class="tags-view-item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <span ref="title" class="tag-title">{{ $t('menu.个人信息') }}</span>
          <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
        <router-link
          v-else
          ref="tag"
          :key="tag.fullPath"
          :to="{ path: tag.fullPath, query: tag.query, fullPath: tag.fullPath }"
          tag="div"
          class="tags-index-item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <span ref="title" class="tag-title">
            <i class="font_family icon-hussar_home" style="font-size: 14px;position: relative;top: 1px;" />
            {{ $t('menu.homePage') }}
          </span>
        </router-link>
      </template>
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
                  :key="tag.path"
                  :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                  tag="div"
                >
                  <span v-if="tag.query.tablePageTitle" class="tag-title" :title="tag.query.tablePageTitle">{{ tag.query.tablePageTitle }}</span>
                  <span v-else class="tag-title" :title="generateTitle(tag.title)">{{ generateTitle(tag.title) }}</span>
                </router-link>
                <router-link
                  v-else
                  :key="tag.path"
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
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">{{ $t('tagsView.close') }}</li>
      <li @click="closeOthersTags(selectedTag)">{{ $t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane';
import path from 'path';
import { generateTitle, caching } from 'hussar-base';

export default {
  components: {
    ScrollPane
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      offset: 0,
      tagPage: 0,
      affixTags: [],
      width: 0,
      height: 32,
      toggle: false,
      cacheTag: [],
      currentTag: {},
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
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
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
      this.addTags();
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
    // 监听vuex中侧边栏折叠状态
    '$store.state.app.sidebar.opened': {
      handler() {
        setTimeout(() => {
          this.moveToCurrentTag();
        }, 200);
      },
      deep: true
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: {
    generateTitle,
    isActive(route) {
      const { meta } = this.$route;
      const tag = this.cacheTag;
      if (meta.hideTag === undefined) {
        if (caching.session.get(window.appMultiple)) {
          return route.fullPath === this.$route.fullPath;
        } else {
          return route.path === this.$route.path;
        }
      } else {
        return route.path === tag.path;
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
      const { name, meta } = this.$route;
      if (name !== 'Dashboard' && name && meta.hideTag === undefined) {
        if (caching.session.get(window.appOpenType) === '0') {
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
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPaneRef.moveToTarget(tag);
            // if (tag.to.fullPath !== this.$route.fullPath) {
            //   this.$store.dispatch('tagsView/updateVisitedView', this.$route);
            // }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          });
        });
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
      await this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews);
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
      this.$router.push(selectedTag);
      this.$store.dispatch('tagsView/delOthersViews', selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
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
        this.$router.push(latestView.fullPath);
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

.more-page{
  padding-right: 10px;
  background: #ffffff;
  color: #969696;
  width: 24px;
  height: 27px;
  position: absolute;
  right: 0;
  top: 5px;
}

.tags-view-container {
  height: 32px;
  background: #fff;
  border-top:0;
  box-sizing:border-box;
  position: relative;

  .tags-item-title {
    width: 100%;
    height:34px;
    padding: 0 15px;

    span {
        display: inline-block;
        color: #0A1532;
        padding-left: 4px;
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
    }

  }

  .tags-view-wrapper {

    .tags-index-item,.tags-view-item {
      position: relative;
      border-top-width:0;
      border-bottom:0;
      font-size: 12px;
      float: left;
      box-sizing: border-box;
      height:32px;
      line-height: 32px;
      color: #878787;
      cursor: pointer;
      white-space:nowrap;

      &:hover{
        background-color: #F8FBFF;
        border-radius: 6px 6px 0 0;

        .el-icon-close {
            visibility: visible;
        }

      }

      &.active.router-link-active{
        background-color: #E6EAF0;
        z-index: 10;
        height:32px;
        margin-left: -1px;
        border-radius: 6px 6px 0 0;

        .tag-title{
          border-right: 0;
          @include color(color3);
          font-weight: 600;
        }

        &:before{
          left: -7px;
          transform: rotateY(180deg);
        }

        &:after{
          right: -7px;
        }

        &:before,&:after{
          position: absolute;
          bottom: 0;
          width: 7px;
          height: 7px;
          line-height: 7px;
          z-index: 2;
          content: '';
          background-image: radial-gradient(200px at 7px 0px, transparent 7px, #E6EAF0 7px);
        }

      }

      .tag-title{
        float: left;
        line-height: 12px;
        padding: 0 36px 0 12px;
        margin-top: 12px;
        border-right: 1px solid #979797;
      }

    }

    .tags-index-item:first-child{
      border-left: 0;
    }

    .tags-index-item.router-link-active {
      background-color: #DDE5E3;
      z-index: 10;
      height:32px;

      .tag-title{
        border-right: 0;
      }

      &:before,&:after{
        background-image: radial-gradient(200px at 7px 0px, transparent 7px, #DDE5E3 7px);
      }

    }

    .tags-index-item .tag-title{
      padding: 0 23px;
    }

    .tags-view-item {
      transition: padding 0.05s linear;

      &.active {
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
      color:#324558;
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

.tags-view-container .tags-view-wrapper {
  width: calc(100% - 24px) !important;
}

.tags-view-wrapper {

  &.scroll-container {

    .el-scrollbar__wrap {
      height: auto;
      margin: 0 !important;
      overflow: hidden;
      width: max-content;
      position:relative;

      .tags-view-item {

        .el-icon-close {
          visibility: visible;
          position: absolute;
          color:#969696;
          right:5px;
          top:12px;
          font-size: 12px;
          border-radius: 50%;
          text-align: center;
          transform-origin: 100% 50%;
        }

        .el-icon-close:hover{
          border-radius: 50%;
          background: #d4d4d4;
        }

      }

    }

    .el-scrollbar__bar {
      display: none;
    }

  }

}

.tag-dropdown-box{
  margin-top: 0!important;
  padding: 8px 0;
  width: 160px;

  .el-dropdown-menu__item{
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
    color: #045340;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover{
    background: #F3F3F3;
    color: #4A4C66;
  }
  .popper__arrow,.popper__arrow::after{
    display: none;
  }

  .tag-dropdown-arrow{
    height: 16px;
    line-height: 16px;
    text-align: center;
    cursor: pointer;

    i{
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
