import { reactive, ref, watch } from 'vue';
import { hussarAxiosRequestUtils, HussarPasswordEncryption, useStore, useI18n$t } from 'hussar-base';
import { v1 as uuid } from 'uuid';
import { LoginApi } from '@/api/loginApi';
import { useRouter, useRoute } from 'vue-router/composables';

export function useLogin() {
  const $store = useStore();
  const $router = useRouter();
  const $route = useRoute();
  const $t = useI18n$t();

  const loginForm = reactive({
    username: '',
    password: '',
    kaptcha: '',
    totp: '',
    kaptchasuffix: ''
  });
  var validateUserName = (rule, value, callback) => {
    if (value === '') {
      callback(new Error($t('login.userNameNotNull')));
      showUsrInputStyle.value = 'inputStyle';
    } else {
      showUsrInputStyle.value = '';
      callback();
    }
  };
  var validatePwd = (rule, value, callback) => {
    if (value === '') {
      callback(new Error($t('login.passwordNotNull')));
      showPwdInputStyle.value = 'inputStyle';
    } else {
      showPwdInputStyle.value = '';
      callback();
    }
  };
  var validateKaptcha = (rule, value, callback) => {
    if (value === '') {
      callback(new Error($t('login.verificationNotNull')));
      showKapInputStyle.value = 'inputStyle';
    } else {
      showKapInputStyle.value = '';
      callback();
    }
  };
  var validateTotp = (rule, value, callback) => {
    if (value === '') {
      callback(new Error($t('login.DPasswordNotNull')));
      showTotpInputStyle.value = 'inputStyle';
    } else {
      showTotpInputStyle.value = '';
      callback();
    }
  };
  const rules = reactive({
    username: [
      { validator: validateUserName, trigger: 'blur' }
    ],
    password: [
      { validator: validatePwd, trigger: 'blur' }
    ],
    kaptcha: [
      { validator: validateKaptcha, trigger: 'blur' }
    ],
    totp: [
      { validator: validateTotp, trigger: 'blur' }
    ]
  });

  const loading = ref(false);
  const kaptchaUrl = ref('');
  // 是否展示动态密码
  const showTotp = ref(false);
  // 是否展示验证码
  const showKaptcha = ref(false);
  const remberPwdChecked = ref(false);

  const redirect = ref('');
  const loginFormRef = ref('');
  const showUsrInputStyle = ref('');
  const showPwdInputStyle = ref('');
  const showKapInputStyle = ref('');
  const showTotpInputStyle = ref('');
  watch($route, () => {
    redirect.value = $route.query && $route.query.redirect;
  });

  /**
   * 跳转到忘记密码
   */
  function forgetPwd() {
    $router.push({
      path: '/forgetPwd'
    });
  }

  /**
   * 点击登录按钮触发
   */
  function handleLogin() {
    if (loading.value) {
      return;
    }
    if (loginForm.username === '') {
      loginFormRef.value.validateField('username');
      showUsrInputStyle.value = 'inputStyle';
      return;
    }
    if (loginForm.password === '') {
      loginFormRef.value.validateField('password');
      showPwdInputStyle.value = 'inputStyle';
      return;
    }
    if (showKaptcha.value && loginForm.kaptcha === '') {
      loginFormRef.value.validateField('kaptcha');
      showKapInputStyle.value = 'inputStyle';
      return;
    }
    if (showTotp.value && loginForm.totp === '') {
      loginFormRef.value.validateField('totp');
      showTotpInputStyle.value = 'inputStyle';
      return;
    }
    loading.value = true;
    const passwordEncryption = new HussarPasswordEncryption();
    const userInfo = {
      username: loginForm.username,
      password: passwordEncryption.encrypt(loginForm.password), // pwd
      code: '',
      randomStr: 'blockPuzzle',
      isIndex: 'index',
      kaptcha: loginForm.kaptcha,
      totp: loginForm.totp,
      kaptchasuffix: loginForm.kaptchasuffix
    };
    $store.dispatch('Login', { userInfo }).then(() => {
      loading.value = false;
      let query = {};
      let path = $route.query.redirect;
      if (!path) {
        path = '/';
        query = {
          ...$route.query
        };
      } else {
        const paramsPath = path.split('?')[1];
        const mySearchParams = new URLSearchParams(paramsPath);
        for (const [key, value] of mySearchParams) {
          query[key] = value;
        }
        query = {
          ...query,
          ...$route.query
        };
        delete query.redirect;
      }
      const redirectPath = path.split('?')[0];
      $router.push({ path: redirectPath, query: query });
    }).catch(() => {
      loginForm.kaptcha = '';
      loginForm.totp = '';
      loading.value = false;
      if (showKaptcha.value) {
        getKaptcha();
      }
    });
  }

  /**
   * 获取是否开启验证码
   */
  function checkVerificationCodeShow() {
    // /frontLogin/getTotpKapcha
    hussarAxiosRequestUtils.postAction(LoginApi.getTotpKapcha).then(res => {
      if (res.code === 10000) {
        // 是否开启动态密码
        showTotp.value = res.data.totp;
        // 是否开启验证码
        showKaptcha.value = res.data.indexKaptcha;
        if (showKaptcha.value) {
          getKaptcha();
        }
      }
    });
  }

  /**
   * 获取验证码
   */
  function getKaptcha() {
    const api = window.baseUrl;
    const randomUuid = uuid();
    loginForm.kaptchasuffix = randomUuid;
    kaptchaUrl.value = api + LoginApi.getKaptchaUrl + '?t=' + new Date().getTime() + '&kaptchasuffix=' + randomUuid;
  }

  return {
    rules,
    showUsrInputStyle,
    showPwdInputStyle,
    showKapInputStyle,
    showTotpInputStyle,
    loginFormRef,
    loginForm,
    loading,
    showTotp,
    showKaptcha,
    remberPwdChecked,
    kaptchaUrl,
    forgetPwd,
    handleLogin,
    getKaptcha,
    checkVerificationCodeShow
  };
}
