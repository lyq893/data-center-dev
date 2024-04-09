<template>
  <component
    :is="menuComponent"
    class="menu-wrapper"
    v-if="!item.hidden"
    :item="item"
    :todoCount="todoCount"
    :deep="deep"
    :base-path="basePath"
    :only-one-child="onlyOneChild"
    @emitSelectStyle="emitSelectStyle"
    @emitClickMenu="emitClickMenu"
  />
</template>

<script>
import { validate } from 'hussar-base';
import { OPEN_MODE_EXTERNAL, STRATEGY_EXTERNAL_LINK } from '@/utils/Constants';
import MenuItemLastChild from './MenuItemLastChild';
import SubMenu from './SubMenu';

export default {
  name: 'SidebarItem',
  components: {
    SubMenu,
    MenuItemLastChild
  },
  props: {
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
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  computed: {
    menuComponent() {
      if (
        this.hasOneShowingChild(this.item.children, this.item) && (!this.onlyOneChild.children || this.onlyOneChild.noShowingChildren) && !this.item.alwaysShow
      ) {
        return 'MenuItemLastChild';
      } else {
        return 'SubMenu';
      }
    },
    isSidebarOpened() {
      return this.$store.state.app.sidebar.opened;
    }
  },
  methods: {
    emitClickMenu({
      value,
      openMode
    }) {
      this.clickMenu(value, openMode);
    },
    clickMenu(value, openMode) {
      if (openMode === OPEN_MODE_EXTERNAL && value.strategy !== STRATEGY_EXTERNAL_LINK && !validate.isExternal(value.path)) {
        const prefix = window.location.origin;
        window.open(`${prefix}#${value.path}`);
      }
    },
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
        this.onlyOneChild = {
          ...parent,
          path: parent.path,
          noShowingChildren: true
        };
        return true;
      }

      return false;
    },
    emitSelectStyle({
      item,
      $event
    }) {
      this.selectStyle(item, $event);
    },
    selectStyle(item, mouseover) {
      const width = mouseover.currentTarget.parentElement.clientWidth;
      const labelWidth = mouseover.currentTarget.offsetWidth; // 内容宽度
      const left = mouseover.currentTarget.parentElement.style.paddingLeft;
      const limitWidth = width - parseInt(left) - 34; // 固定宽度
      if ((labelWidth > limitWidth) && this.isSidebarOpened) {
        this.item.tooltip = false;
        this.$forceUpdate();
      }
      if ((labelWidth <= limitWidth) && this.isSidebarOpened) {
        this.item.tooltip = true;
        this.$forceUpdate();
      }
      if (!this.isSidebarOpened) {
        this.item.tooltip = true;
        this.$forceUpdate();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.menu-wrapper::v-deep .el-menu--vertical {
  background: #fff;
  border-radius: 2px;
}

.menu-wrapper {
  .outline {
    outline: none;
  }

  .text-label {
    position: relative;
  }
}
</style>

