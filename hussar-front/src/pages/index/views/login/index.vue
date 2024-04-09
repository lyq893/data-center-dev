<template>
  <div style="width: 100%;height: 100%">
    <login-center
      v-if="personalizedConfig.type === '0'"
      :personalized-config="personalizedConfig"
      ref="loginCenterRef"
    />
    <login-right
      v-if="personalizedConfig.type === '1'"
      :personalized-config="personalizedConfig"
      ref="loginRightRef"
    />
  </div>
</template>

<script setup>
import LoginCenter from './loginCenter';
import LoginRight from './loginRight';
import { onMounted } from 'vue';
import { useLoginConfig } from './useLoginConfig';
const {
  personalizedConfig,
  getConfigData,
  getBaseDataEncryption
} = useLoginConfig();

onMounted(() => {
  // 登录页面获取配置数据
  getConfigData();
  // 获取公共属性加解密
  getBaseDataEncryption();
});

</script>
