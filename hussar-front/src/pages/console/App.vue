<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';
import { caching } from 'hussar-base';
export default {
  name: 'App',
  created() {
    this.getThemeColor();
  },
  methods: {
    getThemeColor() {
      const url = process.env.VUE_APP_HUSSAR_DEFAULT_API + '/themeConfig/getThemeColor';
      axios.get(url).then((res) => {
        if (res.data.code === 10000) {
          const data = res.data;// 主题色
          // document.documentElement.style.setProperty('--theme-login-color', data.data.$themeColor);
          document.documentElement.style.setProperty('--theme-login-color', '#045340');
        }
      });
    }
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
