<template>
  <section class="app-main" :class="$route.path == '/index' ? 'app-mainClass':''">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    }
  }
};
</script>

<style scoped>
.app-main {
  height: calc(100% - 35px);
  position: relative;
  padding: 8px;
  overflow: auto;
}
.app-mainClass{
  height: 100%;
}
</style>
