import { hussarAxiosRequestUtils, useI18n$t, useMessage, useStore } from 'hussar-base';
import { personalizedConfApi } from 'hussar-config';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

// 定义在函数外，可以多个页面公用
const background = ref('');
const innerBackground = ref('');

export function useLoginConfig() {
  const $store = useStore();
  const $router = useRouter();
  const $route = useRoute();
  const $message = useMessage();
  const $t = useI18n$t();

  const personalizedConfig = ref({
    type: '',
    logo: '',
    background: '',
    innerBackground: ''
  });

  /**
   * 登录页面获取配置数据
   */
  function getConfigData() {
    hussarAxiosRequestUtils.getAction(personalizedConfApi.WithinPersonalizedConfApi.getLoginConfig).then(res => {
      if (res.code === 10000) {
        const data = res.data;
        personalizedConfig.value = data;
        // 请求后端获取背景图片
        backgroundImage();
        innerBackgroundImage();
        if (personalizedConfig.value.logo) {
          personalizedConfig.value.logo = '/sysBaseConfigFront/showPicture?id=' + personalizedConfig.value.logo;
        }
      }
    }).catch(res => {
      console.log(res);
    });
  }

  async function backgroundImage() {
    if (personalizedConfig.value.background) {
      const backgroundLinks = '/sysBaseConfigFront/showPicture?id=' + personalizedConfig.value.background;
      const blob = await hussarAxiosRequestUtils.getImg(backgroundLinks);
      background.value = `url('${URL.createObjectURL(blob)}') no-repeat`;
    } else {
      if (personalizedConfig.value.type === '0') {
        background.value = `url('${require('@/assets/business/login/blue/bg.png')}') no-repeat`;
      } else {
        background.value = `url('${require('@/assets/business/login/green/login-transparent.png')}') no-repeat`;
      }
    }
  }

  async function innerBackgroundImage() {
    if (personalizedConfig.value.innerBackground) {
      const innerBackgroundLinks = '/sysBaseConfigFront/showPicture?id=' + personalizedConfig.value.innerBackground;
      const blob = await hussarAxiosRequestUtils.getImg(innerBackgroundLinks);
      innerBackground.value = `url('${URL.createObjectURL(blob)}') no-repeat`;
    } else {
      if (personalizedConfig.value.type === '0') {
        innerBackground.value = `url('${require('@/assets/business/login/blue/login-transparent.png')}') no-repeat`;
      } else {
        innerBackground.value = '';
      }
    }
  }

  /**
   * 获取框架页配置信息
   */
  function getLayoutData() {
    // /homePage/getHomePageInfo
    hussarAxiosRequestUtils.getAction(personalizedConfApi.WithinPersonalizedConfApi.getLayoutConfig).then(res => {
      if (res.code === 10000) {
        const data = res.data;
        // 设置浏览器标签页标题
        if (data.sysname) {
          document.getElementById('indexTitle').innerText = data.sysname;
        }
        // 设置浏览器标签页ico
        if (data.relationIcon) {
          const api = process.env.VUE_APP_HUSSAR_DEFAULT_API;
          const relationIcon = api + '/sysBaseConfigFront/showPicture?id=' + data.relationIcon;
          document.getElementById('indexIcon').href = relationIcon;
        }
      } else {
        $message.error($t('common.error'));
      }
    }).catch(res => {
      console.error(res.log);
    });
  }

  /**
   * 获取公共属性加解密
   */
  function getBaseDataEncryption() {
    $store.dispatch('getBaseDataEncryption');
  }

  /**
   * 中英文切换（暂不支持）
   * @param value
   */
  function changeLanguage(value) {
    this.$i18n.locale = value;
    $store.dispatch('setLanguage', value);
    window.document.documentElement.setAttribute('international-style', value);
  }

  return {
    personalizedConfig,
    background,
    innerBackground,
    getConfigData,
    getLayoutData,
    getBaseDataEncryption
  };
}
