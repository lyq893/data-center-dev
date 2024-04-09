<template>
  <el-scrollbar
    wrap-class="scrollbar-wrapper menus-box left-right-layout-scrollbar"
    class="side-bar-container" :class="{ 'is-collapse': isCollapse }"
  >
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="true"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.menuId"
        :item="route"
        :todoCount="todoCount"
        :base-path="route.path"
        :deep="0"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
import { caching } from 'hussar-base';
import SidebarItem from './SidebarItem/index.vue';

export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'layoutLogo',
      'layoutSysname'
    ]),
    // 侧边栏是否折叠
    isCollapse() {
      return !this.sidebar.opened;
    },
    // 当前框架页配置中激活的框架类型
    layoutConfigActive() {
      return this.$store.state.configIndex.layoutType;
    }
  },
  data() {
    return {
      socket: null,
      todoCount: {}, // 催办和待办数量
      url: '',
      websocketEdit: false
    };
  },
  methods: {
    // 切换侧边栏的展开状态
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    }
  },
  created() {
    let userId = sessionStorage.getItem('HussarUserId').substring(sessionStorage.getItem('HussarUserId').indexOf('"') + 1, sessionStorage.getItem('HussarUserId').lastIndexOf('"'));
    this.websocketEdit = caching.local.get(window.appWebsocket);
    const hussarBackPath = process.env.VUE_APP_HUSSAR_BACK_PATH;
    const index = hussarBackPath.indexOf('//');
    if (index !== -1) {
      this.url = 'ws://' + hussarBackPath.substring(index + 2) + '/api/websocket/' + userId;
    }
    // 建立 WebSocket 连接
    if (!this.socket && this.websocketEdit) {
      this.socket = new WebSocket(this.url);
      console.log('websocket连接成功。。。。');
      this.socket.addEventListener('open', () => {
        // 连接成功后发送消息获取待办数量
        this.socket.send(JSON.stringify({ userId: userId }));
      });
      // 监听服务端传来的催办和待办数量信息
      this.socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        // 更新催办和待办数量数据
        this.todoCount = {
          reminder: data.reminder,
          pending: data.pending
        };
      });
      this.socket.addEventListener('error', (error) => {
        console.error('WebSocket 错误:', error);
      });
      this.socket.addEventListener('close', () => {
        console.log('WebSocket 连接已关闭。。。。');
      });
    }
  },
  beforeDestroy() {
    // 在 beforeDestroy 钩子函数中关闭 WebSocket 连接
    if (this.socket) {
      this.socket.close();
      console.log('关闭websocket连接。。。');
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/styles/index/variables.scss";
/*hussar-front/src/pages/index/views/layout/components/Sidebar/index.vue*/
/**
  鼠标悬浮时、菜单激活时颜色 不应写在此组件中，而应写到布局类型LayoutType中，
  因为不同布局类型的菜单颜色不一致
 */
.side-bar-container {
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 0;
  // 页签右键z-index是1970，此处比页签大就行
  z-index: 1980;
  width: $base-left-menu-width;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 1px 5px 0 #E2E2E2;
  transition: width $base-transition-time;

  // 菜单折叠
  &.is-collapse {
    width: $base-left-menu-width-min;
    border-right: 0;

    ::v-deep {
      /*菜单折叠时,收起的侧边菜单栏一级菜单*/
      .el-menu.el-menu--collapse {
        border-right: 0;
        width: $base-left-menu-width-min;

        /*末级节点*/
        > a.menu-wrapper {
          .el-menu-item.submenu-title-noDropdown {
            /*覆盖默认style*/
            padding: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;

            .svg-icon {
              margin-right: 0;
            }

            span {
              display: none;
            }
          }
        }

        /*含有下级的一级菜单*/
        .menu-wrapper.el-submenu[deep='0'] {
          display: flex;
          justify-content: center;
          align-items: center;
          height: $base-menu-item-height;

          & > .el-submenu__title {
            /*覆盖默认style*/
            padding: 0 !important;
            width: 100%;
            height: 100%;
            line-height: $base-menu-item-height;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;

            & > span {
              height: 100%;
              display: none;
            }
          }

          .el-menu--inline .svg-icon {
            width: 100%;
            height: 20px;
          }
        }
      }
    }
  }

  ::v-deep {
    .scrollbar-wrapper {
      /* 解决自定义滚动条 x 轴显示问题 */
      overflow-x: hidden;
      /*底部折叠图标还占一定高度*/
      height: calc(100% -  74px);
    }

    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      transform: rotate(0deg);
    }

    .el-menu {
      border: 0;
      width: $base-left-menu-width;

      .el-menu-item,
      .el-submenu__title {
        height: 100%;
        overflow: hidden;
        line-height: $base-menu-item-height;
        vertical-align: middle;

        &>label {
          display: inline-flex;
          align-items: center;

          .svg-icon {
            width: 20px;
            height: 20px;
          }

          span {
            font-weight: 400;
            max-width: 98px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 15px;
          }
        }

        label {
          cursor: pointer;
          font-weight: 400;
        }

        i {
          transform: rotate(-90deg);
        }
      }
    }
  }
}

.submenu-title-noDropdown,
.el-submenu__title {
  font-weight: 500;
  font-size: $base-font-size-default;
  height: $base-menu-item-height;
  line-height: $base-menu-item-height;
  letter-spacing: -1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 30px;
}

//滚动条
::v-deep .el-scrollbar__bar.is-vertical {
  width: 0;
}
</style>
<style lang="scss" scoped>
@import '@/styles/index/variables.scss';
/*hussar-front/src/pages/index/views/layout/components/Sidebar/index.vue*/

/* 以下为 收起侧边栏的二级菜单样式*/
::v-deep .el-menu--vertical {
  background: $base-color-white;
  border-radius: 2px;

  .el-menu.el-menu--popup.el-menu--popup-right-start {
    width: fit-content;
    min-width: unset;
    max-height: 100vh;
    color: #fff;
    margin: 0;
    background: $base-color-white !important;

    /*非一级菜单（嵌套菜单）*/
    .menu-wrapper.nest-menu {
      width: fit-content;
      min-width: unset;

      /*末级菜单*/
      .el-menu-item.submenu-title-noDropdown {
        color: $base-menu-color;
        width: fit-content;
        min-width: unset;
        height: $base-menu-item-height;
        line-height: $base-menu-item-height;
        font-size: $base-font-size-default;
        display: flex;
        align-content: center;
      }

      /*非末级菜单*/
      &.el-submenu {
        width: 100%;
        height: $base-menu-item-height;
        line-height: $base-menu-item-height;
        font-size: $base-font-size-default;

        .el-submenu__title {
          height: 100%;
          display: flex;
          padding-left: 16px;
          justify-content: center;
          align-items: center;

          /*文字*/
          > span {
            height: 100%;
            display: inline-block;
          }

          i {
            width: 14px;
            height: 12px;
            margin-right: -5px;
            margin-top: -5px;
            text-align: center;
            color: $base-menu-color;
          }
        }
      }
    }
  }

  /*末级和非末级公共的样式*/
  .nest-menu.el-submenu > .el-submenu__title,
  .el-menu-item {
    padding: 0 34px 0 16px;
    height: $base-menu-item-height;
    line-height: $base-menu-item-height;
    font-size: $base-font-size-default;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /*多级菜单取消图标显示*/
  & > .el-menu {
    .svg-icon {
      display: none;
      margin-right: 16px;
    }
  }

  // 嵌套菜单箭头
  .el-submenu {
    i.el-submenu__icon-arrow {
      width: 16px;
      height: 16px;
      margin-top: -5px;
      text-align: center;
      transform: rotate(0deg);
    }

    &.is-opened > .el-submenu__title {
      font-family: inherit;
      //箭头
      i.el-submenu__icon-arrow {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
