<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <template v-if="$route.meta && !$route.meta.strategy">
          <router-view :key="routerKey" />
        </template>
      </keep-alive>
    </transition>
    <Frame v-show="$route.meta.strategy" />
  </section>
</template>

<script>
import * as HussarRouter from '@/utils/HussarRouter';
import Frame from '@/components/frame/index';
export default {
  name: 'AppMain',
  components: { Frame },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    routerKey() {
      for (let i = 0; i < this.$children.length; i++) {
        if (this.$children[i] && this.$children[i].$vnode.parent && this.$children[i].$vnode.parent.componentInstance) {
          this.$store.dispatch('tagsView/updateCaCheKeys', this.$children[i].$vnode.parent.componentInstance.cache);
          break;
        }
      }
      if (this.$route && this.$route.query && this.$route.query.systemParams) {
        return HussarRouter.getFullPath(this.$route, true);
      }
      if (this.$route.query && this.$route.query.tabName) {
        return this.$route.query.tabName;
      }
      if (this.$route.query && this.$route.query.refresh) {
        if (Object.keys(this.$route.query).length === 1) {
          return this.$route.path;
        } else {
          let fullPath = this.$route.fullPath;
          if (fullPath.indexOf('?refresh=true') > 0) {
            fullPath = fullPath.replace('refresh=true&', '');
          } else if (fullPath.indexOf('&refresh=true') > 0) {
            fullPath = fullPath.replace('&refresh=true', '');
          }
          return fullPath;
        }
      }
      return this.$route.fullPath;
    }
  }
};
</script>

<style scoped>
  .app-main {
    height: calc(100% - 32px);
    position: relative;
    padding:0;
    overflow: auto;
  }
</style>
