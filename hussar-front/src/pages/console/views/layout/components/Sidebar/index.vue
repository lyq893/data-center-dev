<template>
  <div style="background-color: #ffffff" v-if="menuData && menuData.length !== 0">
    <el-scrollbar wrap-class="scrollbar-wrapper menus-box" style="height: 100%">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        mode="vertical"
      >
        <sidebar-item v-for="(route) in menuData" :key="route.path" :item="route" :base-path="route.path" :deep="0" />
      </el-menu>
    </el-scrollbar>
    <!--    <Hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" :visibility="isHome" class="hamburger-container"/>-->
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from '@/pages/console/views/layout/components/Sidebar/SidebarItem';
import { caching } from 'hussar-base';

export default {
  components: { SidebarItem },
  props: {
    isWelcome: {
      type: Boolean,
      default: false,
      required: false
    },
    index: Array
  },
  data() {
    return {
      menuData: []
    };
  },
  watch: {
    // $route: {
    //   handler: function(val, oldVal){
    //     console.log(val)
    //   },
    //   // 深度观察监听
    //   deep: true
    // }
    index(newValue) {
      this.getMenu();
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened;
    },
    isHome() {
      const flag = !!this.isWelcome;
      return flag;
    },
    twoArr() {
      var arr = JSON.parse(this.$route.params.data);
      var arr2 = arr[0].children;
      // if (arr2){
      //   $('.main-container').css('margin-left','220px');
      // }
      return arr2;
    }
  },
  mounted() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      var arr = this.index;
      if (arr && arr.length !== 0) {
        // let arr2 = arr[0].children;
        if (caching.session.get('isIAM') != 'true') {
          this.menuData = arr[0].children;
        } else {
          arr[0].children.forEach(item => {
            if (item.hasOwnProperty('children')) {
              item.children = item.children.filter(item1 =>
                ((item1.meta.title != '类型定义') && (item1.meta.title != '规则定义') && (item1.meta.title != '机构审核') &&
                  (item1.meta.title != '人员审核') && (item1.meta.title != '用户审核') && (item1.meta.title != '不相容角色集') && (item1.meta.title != '用户角色审核')));
            }
          });
          this.menuData = arr[0].children;
        }
      }
      // if (arr2){
      //   $('.main-container').css('margin-left','220px');
      // }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    }
  }
};
</script>
<style scoped>
  .hamburger-container {
    height: 20px;
    width: 20px;
    position: absolute;
    z-index: 10;
    bottom: 36px;
    right: 20px;
  }
</style>
