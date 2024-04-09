<template>
  <div :class="classObj" class="app-wrapper app-home">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="hussar-head">
      <navbar @changeIndex="changeIndex" />
    </div>
    <div class="hussar-body">
      <sidebar class="sidebar-container" :index="index" />
      <div class="main-container">
        <!--        <tags-view style="margin: 0 24px;"/>-->
        <tags-view />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from '@/pages/console/views/layout/components';
import ResizeMixin from '@/pages/console/views/layout/mixin/ResizeHandler';
import { caching, validate } from 'hussar-base';
import { mapGetters } from 'vuex';
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    return {
      index: [],
      arrHead: []
    };
  },
  mixins: [ResizeMixin],
  // watch: {
  //   $route: {
  //     handler: function(val, oldVal){
  //       document.getElementsByClassName('app-wrapper')[0].classList.remove("app-home");
  //     },
  //       // 深度观察监听
  //       deep: true
  //   }
  // },
  computed: {
    // refreshTime() {
    //   return this.$store.state.user.refreshTime
    // },
    ...mapGetters([
      'permission_routers'
    ]),
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
  created() {
    const arr = this.permission_routers;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].hidden) {
        if (arr[i].meta.title != '工作流' && arr[i].meta.title != '管理' && arr[i].meta.title != '演示') { this.arrHead.push(arr[i]); }
      }
    }
    this.changeIndex(this.arrHead);
    // todo 支持服务功能需将配置的路由添加到此
    if (!(this.$route.path === '/index' || this.$route.path === '/staffInfo')) {
      this.$nextTick(function() {
        document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
      });
    }
  },
  mounted() {
    // let visitedRouters = this.$store.state.tagsView.visitedViews;
    // visitedRouters.forEach(item=>{
    //     if(item.path === '/index'){
    //         this.$store.dispatch('tagsView/delView', item);
    //     }
    // })
    caching.session.set('HussarIndexTheme', 'default');
    window.document.documentElement.setAttribute('data-theme', 'default');
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
    },
    changeIndex(index) {
      this.index = index;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.hussar-head{
  position:relative;
  z-index:100;
  height:80px;
  overflow: hidden;
  box-shadow:0px 1px 5px 0px rgba(226,226,226,1);
}
.hussar-body{
  position:relative;
  height:calc(100% - 80px);
  background:#E6EAF0;
  overflow: hidden;
}
.main-container{
  height: 100%;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar{
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 99;
}
</style>
