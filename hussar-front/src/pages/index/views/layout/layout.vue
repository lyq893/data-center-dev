<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="layout" v-if="layoutConf.type === '0'">
      <ChangZi />
    </div>
    <div class="layout" v-if="layoutConf.type === '1'">
      <LeftRight />
    </div>
  </div>
</template>

<script>
import ChangZi from '@/pages/index/views/layout/components/LayoutType/ChangZi';
import LeftRight from '@/pages/index/views/layout/components/LayoutType/LeftRight';
import ResizeMixin from '@/pages/index/views/layout/mixin/ResizeHandler';
import { personalizedConfApi } from 'hussar-config';
import { hussarAxiosRequestUtils, caching } from 'hussar-base';

export default {
  name: 'Layout',
  components: {
    ChangZi,
    LeftRight
  },
  data() {
    return {
      layoutConf: []
    };
  },
  mixins: [ResizeMixin],
  computed: {
    // refreshTime() {
    //   return this.$store.state.user.refreshTime
    // },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    language() {
      return this.$store.getters.language;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    getConfigData() {
      const self = this;
      hussarAxiosRequestUtils.getAction(personalizedConfApi.WithinPersonalizedConfApi.getLayoutConfig).then((res) => {
        if (res.code === 10000) {
          const data = res.data;
          self.layoutConf = data;
          // 设置logo
          if (self.layoutConf.logo) {
            data.logo = '/attachment/showPicture?image=' + data.logo;
          }
          // 设置浏览器标签页标题
          if (data.sysname) {
            document.getElementById('indexTitle').innerText = data.sysname;
          }
          // 设置浏览器标签页icon
          if (self.layoutConf.relationIcon) {
            const api = process.env.VUE_APP_HUSSAR_DEFAULT_API;
            const relationIcon = api + '/sysBaseConfigFront/showPicture?id=' + self.layoutConf.relationIcon;
            document.getElementById('indexIcon').href = relationIcon;
          }
          // 将框架页logo\名称\类型 存储到vuex中，方便LogoArea等组件使用
          self.$store.commit('SET_LAYOUTLOGO', data.logo);
          self.$store.commit('SET_LAYOUTSYSNAME', data.sysname);
          self.$store.commit('SET_LAYOUTTYPE', data.type);
          caching.session.set('HussarIndexTheme', 'default');
        } else {
          self.$message.error(self.$t('common.error'));
        }
      }).catch((res) => {
        console.error(res.log);
      });
    }
  },
  created() {
    this.getConfigData();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "@/styles/index/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 99;
  }

  .layout {
    height: 100%;
    width: 100%;
  }
}

//侧边栏收起
.hideSidebar {
  ::v-deep .changzi .hussar-body {
    .sidebar-container {
      width: $base-left-menu-width-min;
    }

    .main-container {
      width: $base-right-content-width-min;
      margin-left: $base-left-menu-width-min;
    }
  }

  //左右布局
  ::v-deep .left-right {
    .left {
      width: $base-left-menu-width-min;
      background: $base-color-default url("~@/assets/business/layout/hide-sidebg.png") no-repeat;
      background-size: 100% 100%;

      .sidebar-container {
        width: $base-left-menu-width-min;
      }
    }

    .right {
      width: $base-right-content-width-min;
      margin-left: $base-left-menu-width-min;
    }
  }

  ::v-deep .left-right .logo-area1 {
    width: 54px !important;

    img {
      margin: 0 8px;
    }
  }
}
</style>
