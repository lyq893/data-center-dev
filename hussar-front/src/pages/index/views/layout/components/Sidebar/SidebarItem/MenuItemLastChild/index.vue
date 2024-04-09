<template>
  <app-link
    :to="resolvePath(onlyOneChild.path)"
    :external-url="onlyOneChild.openMode"
    :only-one-child="onlyOneChild"
  >
    <el-menu-item
      :index="onlyOneChild.path"
      :class="{'submenu-title-noDropdown':!isNest}"
      @click="clickMenu(onlyOneChild,item.openMode)"
    >
      <el-tooltip
        :open-delay="500"
        class="item"
        effect="light"
        :visible-arrow="false"
        popper-class="el-prompt el-prompt-position"
      >
        <div slot="content" class="el-title">{{ item.meta.title }}</div>
        <div class="itemMenu" :style="{width: websocketEdit ? '120px' : 'fit-contents'}" v-if="item.meta.title === '我的催办' && todoCount.reminder > 0 && websocketEdit">
          <label @mouseover="selectStyle(item, $event)" class="box outline">
            <item :deep="deep" :meta="Object.assign({},item.meta,onlyOneChild.meta)" />
          </label>
          <el-badge :value="todoCount.reminder" :max="99"  class="item-badge">
          </el-badge>
        </div>
        <div class="itemMenu" :style="{width: websocketEdit ? '120px' : 'fit-contents'}" v-else-if="item.meta.title === '待办任务' && todoCount.pending > 0 && websocketEdit">
          <label @mouseover="selectStyle(item, $event)" class="box outline">
            <item :deep="deep" :meta="Object.assign({},item.meta,onlyOneChild.meta)" />
          </label>
          <el-badge :value="todoCount.pending" :max="99" class="item-badge">
          </el-badge>
        </div>
        <div class="itemMenu" v-else>
          <label @mouseover="selectStyle(item, $event)" class="box outline">
            <item :deep="deep" :meta="Object.assign({},item.meta,onlyOneChild.meta)" />
          </label>
        </div>
      </el-tooltip>
    </el-menu-item>
  </app-link>
</template>
<script>
import AppLink from './AppLink';
import Item from './MenuItem';
import { validate, caching } from 'hussar-base';
import path from 'path';

export default {
  name: 'MenuItemLastChild',
  components: {
    Item,
    AppLink
  },
  props: {
    onlyOneChild: {
      type: Object,
      default() {
        return null;
      }
    },
    todoCount: {
      type: Object,
      required: true
    },
    deep: {
      type: Number,
      required: true
    },
    // route object
    item: {
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
    }
  },
  data() {
    return{
      websocketEdit: false
    }
  },
  methods: {
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
    clickMenu(value, openMode) {
      this.$emit('emitClickMenu', {
        value,
        openMode
      });
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
@import "@/styles/index/variables.scss";
/*注意保存时没有重新编译！！！*/

/*tooltip悬浮时标题大小*/
.el-title {
  margin-top: -5px;
  font-weight: 500;
}
.itemMenu {
  position: relative;
}
.itemMenu .box.outline span {
  padding-left: 15px;
}
</style>
<style>
.item-badge {
  position: absolute; /* 设置子元素为绝对定位 */
  top: 50%; /* 将元素垂直居中 */
  right: 0; /* 将元素靠右对齐 */
  margin-right: -10px; /* 设置负的右边距，使元素向左偏移10px */
  transform: translateY(-50%); /* 将元素上移50%以垂直居中 */
}
/*末级节点时，折叠时的标题提示*/
/*.el-prompt.el-prompt-position {
  height: 24px;
  margin-top: 6px !important;
  margin-left: 90px;
}*/
</style>
