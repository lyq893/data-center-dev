<template>
  <el-submenu
    ref="subMenu"
    :popper-append-to-body="false"
    :index="onlyOneChild.menuId"
    :show-timeout="100"
    :hide-timeout="100"
    :deep="deep"
  >
    <template slot="title">
      <label v-if="isSidebarOpened" @mouseover="selectStyle(item, $event)">
        <svg-icon :icon-class="getMenuIcon(item.meta.icon,deep)" />
        <span class="text-label" v-if="item.meta&&item.meta.title" slot="title">
          <el-tooltip
            :open-delay="500"
            class="item"
            effect="light"
            :visible-arrow="false"
            popper-class="el-prompt el-prompt-position"
          >
            <div slot="content" class="el-title">{{ generateTitle(item.meta.title) }}</div>
            <label class="outline">{{ generateTitle(item.meta.title) }}</label>
          </el-tooltip>
        </span>
      </label>
      <label v-else :style="{width: websocketEdit && item.meta.title === '流程委托' ? '120px' : 'fit-contents'}">
        <svg-icon :icon-class="getMenuIcon(item.meta.icon,deep)" />
        <span v-if="item.meta&&item.meta.title" slot="title">
          <el-tooltip
            :open-delay="500"
            class="item"
            effect="light"
            :visible-arrow="false"
            popper-class="el-prompt el-prompt-position"
          >
            <div slot="content" class="el-title">{{ generateTitle(item.meta.title) }}</div>
            <label class="outline">{{ generateTitle(item.meta.title) }}</label>
          </el-tooltip>
        </span>
      </label>
    </template>
    <!-- 下级菜单   -->
    <SidebarItem
      v-for="child in item.children"
      :is-nest="true"
      :item="child"
      :deep="deep + 1"
      :todoCount="todoCount"
      :key="child.menuId"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-submenu>
</template>

<script>
import { generateTitle, validate, caching } from 'hussar-base';
import path from 'path';
import { getMenuIcon } from './getMenuIcon';

export default {
  name: 'JxdSubMenu',
  components: {
    // 多次调用的组件使用import引入，可以让name不和父组件冲突
    SidebarItem: () => import('./index.vue')
  },
  props: {
    onlyOneChild: {
      type: Object,
      default() {
        return null;
      }
    },
    // route object
    item: {
      type: Object,
      required: true
    },
    todoCount: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    // 上边所有级菜单的path拼接
    basePath: {
      type: String,
      default: ''
    },
    deep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      websocketEdit: false
    }
  },
  computed: {
    isSidebarOpened() {
      return this.$store.state.app.sidebar.opened;
    }
  },
  methods: {
    getMenuIcon,
    generateTitle,
    resolvePath(routePath) {
      //  /^(https?:|mailto:|tel:)/.test(path)
      if (validate.isExternal(routePath)) {
        if (routePath.indexOf('hussarBpm') !== -1) {
          return '';
        } else {
          return routePath;
        }
      }
      // 若是内部链接，拼接上一级菜单的path
      return path.resolve(this.basePath, routePath);
    },
    selectStyle(item, $event) {
      this.$emit('emitSelectStyle', {
        item,
        $event
      }
      );
    }
  },
  mounted() {
    this.websocketEdit = caching.local.get(window.appWebsocket);
  }
};
</script>

<style lang="scss" scoped>
/*tooltip悬浮时标题大小*/
.el-title {
  margin-top: -5px;
  font-weight: 500;
}
</style>
<style>
.itemLabel {
  width: 120px;
}
</style>
