<template>
  <div />
</template>

<script>
import { handleLogin } from '@/pages/index/api/login/ssoCommon';

export default {
  name: 'SsoLogin',
  mounted() {
    this.handleSsoLogin();
  },
  methods: {
    handleSsoLogin() {
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
      const loginCode = this.$route.query.token;
      // 设置请求头参数（loginType：请求类型，loginCode：认证参数）
      return {
        loginType: loginType,
        loginCode: loginCode
      };
    },
    // 登录类型
    getLoginType() {
      // todo: 此处需判断登录类型
      return 'ssoLogin';
    }
  }
};
</script>

<style scoped>

</style>
