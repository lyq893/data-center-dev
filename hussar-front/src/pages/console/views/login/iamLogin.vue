<template>
  <div />
</template>

<script>
import { handleLogin } from '@/pages/console/api/login/ssoCommon';
import * as loginExtend from '../../../../api/login/extends/loginExtend';

export default {
  name: 'IamLogin',
  mounted() {
    this.handleIamLogin();
  },
  methods: {
    handleIamLogin() {
      // 获取登录请求头
      const headers = this.getLoginHeader();
      // 调用平台登录方法
      handleLogin(this, headers);
    },
    // 登录请求头
    getLoginHeader() {
      // 获取登录类型
      const loginType = this.getLoginType();
      // todo: 认证参数，以服务端或跳转时实际传过来的为准，后台扩展登录时可以使用此值
      let loginCode = this.$route.query.code;
      if (loginCode === undefined || loginCode === null || loginCode === '') {
        loginCode = this.getCode();
      }
      // 设置请求头参数（loginType：请求类型，loginCode：认证参数）
      return {
        loginType: loginType,
        loginCode: encodeURIComponent(loginCode)
      };
    },
    // 登录类型
    getLoginType() {
      // todo: 此处需判断登录类型
      return loginExtend.getLoginType(this.$route);
    },
    // 获取code
    getCode() {
      const pathName = window.location.search;
      const str = pathName.substring(pathName.indexOf('code=') + 5);
      let endIndex = str.indexOf('&state');
      if (endIndex == -1) {
        endIndex = str.indexOf('%26state');
      }
      const res = str.substring(0, endIndex);
      return res;
    }
  }
};
</script>

<style scoped>

</style>
