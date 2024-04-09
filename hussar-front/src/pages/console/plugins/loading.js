export default {
  install(Vue) {
    let loading = null;
    Vue.prototype.$openLoading = () => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: '正在导入中，请稍后操作。',
        background: 'rgba(0, 0, 0, 0.4)',
        customClass: 'loadingClass'
      });
    };
    Vue.prototype.$closeLoading = () => {
      if (loading) {
        loading.close();
      }
    };
    Vue.prototype.$openDownLoading = () => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: '正在下载中，请稍后操作。',
        background: 'rgba(0, 0, 0, 0.4)',
        customClass: 'loadingClass'
      });
    };
    Vue.prototype.$closeDownLoading = () => {
      if (loading) {
        loading.close();
      }
    };
    Vue.prototype.$openResetLoading = () => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: '正在还原中，请稍后操作。',
        background: 'rgba(0, 0, 0, 0.4)',
        customClass: 'loadingClass'
      });
    };
    Vue.prototype.$closeResetLoading = () => {
      if (loading) {
        loading.close();
      }
    };
    Vue.prototype.$openSubmitLoading = () => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: '正在提交中，请稍后操作。',
        background: 'rgba(0, 0, 0, 0.4)',
        customClass: 'loadingClass'
      });
    };
    Vue.prototype.$closeSubmitLoading = () => {
      if (loading) {
        loading.close();
      }
    };
    Vue.prototype.$openObtainLoading = () => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: '正在获取中，请稍后操作。',
        background: 'rgba(0, 0, 0, 0.4)',
        customClass: 'loadingClass'
      });
    };
    Vue.prototype.$closeObtainLoading = () => {
      if (loading) {
        loading.close();
      }
    };
    Vue.prototype.$openAppLoading = (text) => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: '正在' + text + '中，请稍后操作。',
        background: 'rgba(0, 0, 0, 0.4)',
        customClass: 'loadingClass'
      });
    };
    Vue.prototype.$closeAppLoading = () => {
      if (loading) {
        loading.close();
      }
    };
  }
};
