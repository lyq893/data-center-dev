<template>
  <div class="left-right">
    <div class="left">
      <logo-area />
      <sidebar class="sidebar-container" />
      <UserIndex :toggle-click="toggleSideBar" :is-active="sidebar.opened"
                 class="hamburger-container business-hamburger" :class="{'business-hamburger-active':sidebar.opened}"
      />
    </div>
    <div class="right">
      <div class="hussar-head left-right-layout">
        <head-style />
      </div>
      <div class="main-container">
        <tags-view style="margin: 0 24px;" />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { HeadStyle, AppMain, Sidebar, TagsView } from '@/pages/index/views/layout/components';
import LogoArea from '@/pages/index/views/layout/components/LogoArea';
import { mapGetters } from 'vuex';
import { UserIndex } from 'hussar-common';

export default {
  name: 'LeftRight',
  data() {
    return {
      themeColor: ''
    };
  },
  components: {
    AppMain,
    HeadStyle,
    Sidebar,
    TagsView,
    LogoArea,
    UserIndex
  },
  mounted() {
    this.setSideBarBg();
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    // 侧边栏背景色透明度
    setSideBarBg() {
      let themeColor = document.documentElement.style.getPropertyValue('--c-keyDownColor');
      const sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + themeColor.slice(i, i + 2)));
      }
      // 一级菜单展开
      themeColor = sColorChange.join(',') + ',0.25';
      // 二级菜单展开
      const themeColor2 = sColorChange.join(',') + ',0.25';
      document.documentElement.style.setProperty('--theme-sidebar-bg', themeColor);
      document.documentElement.style.setProperty('--theme-sidebar-bg2', themeColor2);
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "@/styles/index/variables.scss";
/*【左右布局】菜单激活时的颜色*/
@mixin active {
  &:hover {
    color: $leftright-menu-color-hover;
    background-color: $leftright-menu-background-hover !important;
  }

  &.is-active {
    color: $leftright-menu-color-active;
    background-color: $leftright-menu-background-active !important;
  }
}

@mixin hover {
  &:hover {
    color: $leftright-menu-color-hover;
    background-color: $leftright-menu-background-hover !important;

    > .el-submenu__title {
      > label {
        color: $leftright-menu-color-hover;

        > .svg-icon {
          color: #FFFFFF !important;
        }
      }
    }
  }
}

.left-right {
  height: 100%;

  //侧边栏
  .left {
    background-size: 100% 100%;
    width: $base-left-menu-width;
    height: 100%;
    position: relative;
    float: left;
    background: $base-color-default url('~@/assets/business/layout/sidebg10.png') no-repeat;

    ::v-deep .sidebar-container {
      height: $base-body-height;
      width: $base-left-menu-width;
      box-shadow: unset;

      /*非折叠情况的菜单*/
      &:not(.is-collapse) {

        .el-menu {
          background-color: transparent;

          .menu-wrapper {

            /*嵌套菜单 通用样式*/
            &.el-submenu {
              @include hover;

              .el-submenu__title {
                @include active;

                > label {
                  color: hsla(0, 0%, 100%, .7);
                }

                .el-submenu__icon-arrow {
                  color: #FFFFFF !important;
                }
              }

              &.is-opened, .is-active {
                .el-menu.el-menu--inline {
                  background-color: rgba(var(--theme-sidebar-bg)) !important;

                  .menu-wrapper {
                    .el-menu-item.submenu-title-noDropdown {
                      label {
                        color: hsla(0, 0%, 100%, .7);
                      }

                      &:hover {
                        label {
                          .svg-icon {
                            color: #FFFFFF;
                          }

                          span {
                            color: #FFFFFF;
                          }
                        }
                      }
                    }
                  }

                  .el-submenu {
                    &.is-opened, .is-active {
                      .el-menu.el-menu--inline {
                        background-color: rgba(var(--theme-sidebar-bg2)) !important;
                      }
                    }
                  }

                }
              }
            }

            /*末级菜单 通用样式*/
            .el-menu-item.submenu-title-noDropdown {
              label {
                color: hsla(0, 0%, 100%, .7);
              }

              &:hover {
                /*覆盖默认style*/
                background-color: transparent !important;

                label {
                  color: #fff;
                }

                .svg-icon {
                  color: #fff;
                }
              }

              &.is-active {
                /*覆盖默认style*/
                background-color: transparent !important;

                label {
                  color: #FFFFFF !important;
                }

                .svg-icon {
                  color: #fff;
                }
              }
            }
          }

          span, .el-submenu__title label {
            cursor: pointer;
          }
        }

      }

      /*折叠菜单*/
      &.is-collapse {
        .el-menu--collapse.el-menu {
          background-color: transparent;

          /*折叠时一级菜单*/
          .menu-wrapper[deep='0'] {
            /*(非末级)*/
            &.el-submenu {
              .el-submenu__title {
                &:hover {
                  background-color: transparent !important;
                }

                label {
                  //color: hsla(0, 0%, 100%, .7);

                  .svg-icon {

                  }
                }
              }
            }

            /*折叠时一级菜单(末级)*/
            > .el-menu-item.submenu-title-noDropdown {
              &.is-active {
                background-color: transparent !important;
              }

              &:hover {
                background-color: transparent !important;
              }

              label {
                color: hsla(0, 0%, 100%, .7);
              }
            }
          }

          /*折叠时非一级菜单*/
          .el-menu--vertical {
            .el-menu.el-menu--popup.el-menu--popup-right-start {
              /*非一级菜单（嵌套菜单）*/
              .menu-wrapper.nest-menu {
                /*末级菜单*/
                .el-menu-item.submenu-title-noDropdown {
                  &:hover {
                    background-color: $base-menu-background-hover;
                  }

                  &.is-active {
                    background-color: $base-menu-background-active;
                  }
                }

                /*非末级菜单*/
                &.el-submenu {
                  .el-submenu__title {
                    &:hover {
                      background-color: $base-menu-background-hover;
                    }

                    &.is-active {
                      background-color: $base-menu-background-active;
                    }
                  }
                }
              }

              // 菜单选中行前面的蓝色小条
              .router-link-active {
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
          }
        }
      }
    }

    //菜单图标
    ::v-deep .svg-icon {
      width: 20px !important;
      height: 20px !important;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  //选中项白条
  ::v-deep .router-link-active {
    .el-menu-item:before {
      content: '';
      width: 3px;
      height: $base-menu-item-height;
      background-color: #FFFFFF;
      left: 0;
      position: absolute;
    }

    .svg-icon {
      color: #FFFFFF;
    }
  }

  //顶部和内容区
  .right {
    height: 100%;
    margin-left: $base-left-menu-width;

    .main-container {
      height: calc(100% - 64px);
      background: #f6f7f8;
    }
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
    fill: #FFFFFF;
  }
}
</style>
