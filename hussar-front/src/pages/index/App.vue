<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

import { caching } from 'hussar-base';
export default {
  name: 'App',
  methods: {
    checkIsNameDiff(path, name) {
      name = decodeURI(name);
      this.$store.commit('tagsView/UPDATE_VISITED_VIEW_NAME', {
        path: path,
        name
      });
    }
  },
  mounted() {
    window.addEventListener('message', (e) => {
      if (e.data && e.data.name && e.data.path) {
        this.$store.dispatch('GenerateRoutes', null).then(() => { // 根据roles权限生成可访问的路由表
          const name = e.data.name;
          const path = e.data.path;
          this.checkIsNameDiff(path, name);
        });
      }
    });
  }
};
</script>
<style>
@import "~@/assets/font/font.css";
</style>
<style>
/*body{*/
/*  margin:0px;*/
/*  width:100%;*/
/*  min-width:1500px;*/
/*  max-width:100%;*/
/*  height:100%;*/
/*  background-color:#F0F0F0;*/
/*}*/
</style>
