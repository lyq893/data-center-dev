<template>
  <div style="height: 64px;float: left; background: transparent;">
    <div class="logo-area1">
      <blob-img v-if="layoutLogo !== '' && layoutLogo !== undefined" :src="layoutLogo" alt="" />
      <img v-else src="@/assets/business/layout/layout-logo.png">
      <label v-if="layoutSysname !== '' && layoutSysname !== undefined">{{ layoutSysname }}</label>
      <label v-else>统一门户</label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BlobImg } from 'hussar-base';
export default {
  name: 'logoArea',
  computed: {
    ...mapGetters([
      'layoutLogo',
      'layoutSysname'
    ])
  },
  components: { BlobImg },
  mounted() {
    this.setLogoFontSize();
  },
  methods: {
    // 处理logo右侧系统名称字数较多的情况
    setLogoFontSize() {
      let logoFontSize = '24px';
      if (this.layoutSysname.length > 6) {
        logoFontSize = '14px';
      }
      document.documentElement.style.setProperty('--logo-font-size', logoFontSize);
    }
  }
};
</script>

<style scoped lang="scss">
.logo-area1 {
  float: left;
  height: 100%;
  display: flex;
  align-items: center;
  img,blob-img {
    background-color: unset !important;
    border: unset !important;
    width: 40px;
    height: auto;
    margin: 0 8px 0 31px;
    color: #FFFFFF;
  }
  label {
      font-size: var(--logo-font-size);
      font-family: bus-PingFangSC;
      font-weight: 700;
      text-align: left;
      color: #ffffff;
      line-height: 33px;
  }
  i {
      color: #FFFFFF;
      font-size: 40px;
      margin: 0 8px 0 31px;
  }
}
</style>
