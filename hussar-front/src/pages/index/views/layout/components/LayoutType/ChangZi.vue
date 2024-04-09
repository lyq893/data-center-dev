<template>
  <div style="height: 100%" class="changzi">
    <div class="hussar-head">
      <logo-area />
      <head-style />
    </div>
    <div class="hussar-body">
      <UserIndex :toggle-click="toggleSideBar" :is-active="sidebar.opened"
                 class="hamburger-container" :class="{'business-hamburger-active':sidebar.opened}"
      />
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <tags-view />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { HeadStyle, AppMain, Sidebar, TagsView } from '@/pages/index/views/layout/components';
import LogoArea from '@/pages/index/views/layout/components/LogoArea';
import { UserIndex } from 'hussar-common';
import { mapGetters } from 'vuex';

export default {
  name: 'ChangZi',
  components: {
    AppMain,
    HeadStyle,
    Sidebar,
    TagsView,
    LogoArea,
    UserIndex
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/index/variables.scss";

//侧边栏
::v-deep .sidebar-container {
  background-color: $base-color-white;

  .svg-icon {
    color: $base-color-default;
  }

  .scrollbar-wrapper {
    background: $base-color-white;

    .submenu-title-noDropdown, .el-submenu__title {
      i {
        color: $base-menu-color;
      }
    }

    .el-submenu .el-menu-item:hover {
      color: $base-color-default;
    }
  }

}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/index/variables.scss";

@mixin active {
  &:hover {
    color: $base-menu-color-hover;
    background-color: $base-menu-background-hover !important;
  }

  &.is-active {
    color: $base-menu-color-active;
    background-color: $base-menu-background-active !important;
  }
}

.changzi {
  .hussar-head {
    position: relative;
    z-index: 1;
    height: $base-nav-bar-height;
    overflow: hidden;
    background-color: $base-color-default;
    //顶部
    ::v-deep .navbar {
      margin-left: $base-left-menu-width;
      background-color: $base-color-default !important;
      border-bottom: none;
    }
  }

  .hussar-body {
    position: relative;
    //display: flex;
    height: $base-body-height;
    background: #f6f7f8;

    .sidebar-container {
      width: $base-left-menu-width;
      height: calc(100% -  74px);

      ::v-deep .el-menu {
        .el-menu-item,
        .el-submenu__title {
          /*鼠标悬浮时、菜单激活时颜色*/
          @include active;
        }
      }

      &.is-collapse {
        /*菜单折叠时,收起的侧边菜单栏一级菜单*/
        ::v-deep .el-menu.el-menu--collapse {

        }
      }

      ::v-deep .el-menu--vertical {
        /*收起侧边栏的二级菜单样式*/
        .el-menu.el-menu--popup.el-menu--popup-right-start {
          /*末级菜单*/
          .el-menu-item.submenu-title-noDropdown{
            @include active;
          }
          /*非末级菜单*/
          &.el-submenu {
            @include active;
          }
        }
      }
      ::v-deep :not(.is-collapse) {
        .menu-wrapper {

          &.el-submenu {

            .el-menu.el-menu--inline {
              .el-menu-item {
                background-color: #f6f8fb !important;
              }

              .menu-wrapper.nest-menu.el-submenu {
                background-color: #f6f8fb !important;
              }
            }

          }
        }
      }

      //选中项白条
      ::v-deep .router-link-active {
        .el-menu-item:before {
          content: '';
          width: 3px;
          height: $base-menu-item-height;
          background-color: $base-color-default;
          left: 0;
          position: absolute;
        }
      }
    }

    .main-container {
      //flex: 1;
      width: $base-right-content-width;
      height: 100%;
      margin-left: $base-left-menu-width;
    }
  }

  //左下角收放键
  .hamburger-container {
    position: fixed;
    bottom: 18px;
    left: 17.5px;
    // 左侧菜单z-index为1980.要高于这个值
    z-index: 1990;

    &.business-hamburger-active {
      transform: rotateY(180deg);
      left: 30px;
    }

    ::v-deep .hamburger.visibility {
      fill: #bfbfbf;
    }
  }
}

</style>
