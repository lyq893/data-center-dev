<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!--无子菜单-->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)" :external-url="onlyOneChild.openMode" :only-one-child="onlyOneChild">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest,'child-bg': deep===2}" @click="clickMenu(onlyOneChild, item.openMode)">
          <item :meta="Object.assign({},item.meta,onlyOneChild.meta)" :deep="deep" />
        </el-menu-item>
      </app-link>
    </template>
    <!--    有子菜单且层级大于等于3-->
    <template v-else-if="deep >= 2 && !isColl">
      <el-menu
        :default-active="$route.path"
        :collapse="isMen"
        :collapse-transition="false"
        :unique-opened="true"
        mode="vertical"
      >
        <el-submenu ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body :show-timeout="100" :hide-timeout="100" style="min-width: 200px;height: 40px" :class="deep === 2 ? 'child-menu':''">
          <template slot="title">
            <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon" />
            <span v-if="item.meta&&item.meta.title" slot="title" style="visibility: visible; display: contents;">{{ generateTitle(item.meta.title) }}</span>
          </template>
          <sidebar-item
            v-for="child in item.children"
            :is-nest="true"
            :item="child"
            :key="child.path"
            :deep="deep + 1"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </el-submenu>
      </el-menu>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body :show-timeout="100" :hide-timeout="100">
      <template slot="title">
        <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon" />
        <span v-if="item.meta&&item.meta.title" slot="title">{{ generateTitle(item.meta.title) }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :is-nest="true"
        :item="child"
        :key="child.path"
        :deep="deep + 1"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>

  </div>
</template>

<script>
import path from 'path';
import { mapGetters } from 'vuex';
import { validate, generateTitle } from 'hussar-base';
import Item from '@/pages/console/views/layout/components/Sidebar/Item';
import AppLink from '@/pages/console/views/layout/components/Sidebar/Link';
import { OPEN_MODE_EXTERNAL } from '../../../../../../utils/Constants';

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    deep: Number
  },
  data() {
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {
      visible: false
    };
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isColl() {
      return !this.sidebar.opened;
    },
    isMen() {
      return this.sidebar.isOpenMenu;
    }
  },
  methods: {
    clickMenu(value, openMode) {
      this.$store.commit('CHANGE_MENU', false);
      this.$nextTick(() => {
        this.$store.commit('CHANGE_MENU', true);
      });
      if (openMode === OPEN_MODE_EXTERNAL && value.strategy !== '3' && !validate.isExternal(value.path)) {
        const prefix = window.location.origin + '/console.html';
        window.open(`${prefix}#${value.path}`);
      }
    },
    generateTitle,
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        // 只有一个子节点的菜单栏
        // parent.meta.title=  generateTitle('organ');
        return false;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: parent.path, noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (validate.isExternal(routePath)) {
        if (routePath.indexOf('hussarBpm') !== -1) {
          return '';
        } else {
          return routePath;
        }
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
<style >
.el-menu--collapse > .el-menu-item .el-submenu__icon-arrow, .el-menu--collapse > .el-submenu > .el-submenu__title .el-submenu__icon-arrow{
  display: block;
}
.el-menu{
 border-right: 0 ;
}
#app .sidebar-container .nest-menu .child-menu{overflow: hidden;}
#app .sidebar-container .nest-menu .child-menu > .el-submenu__title{padding-left: 60px!important;background-color: #F1F3F6 !important}
#app .sidebar-container .nest-menu .child-menu > .el-submenu__title i{
    transform:rotate(0deg);
    -ms-transform:rotate(0deg); /* Internet Explorer */
    -moz-transform:rotate(0deg); /* Firefox */
    -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
    -o-transform:rotate(0deg); /* Opera */
}
#app .sidebar-container .child-menu.is-opened > .el-submenu__title i{
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); /* Internet Explorer */
    -moz-transform:rotate(90deg); /* Firefox */
    -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
    -o-transform:rotate(90deg); /* Opera */
}
</style>
<style lang="scss" scoped>
#app .sidebar-container .nest-menu .svg-icon{
  color: var(--c-themeColor);
}
#app .sidebar-container .el-menu-item.is-active{
  color: var(--c-themeColor);
}
</style>
