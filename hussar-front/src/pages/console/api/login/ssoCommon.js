import { HussarPasswordEncryption, caching } from 'hussar-base';

export function handleLogin(self, headers, loginParams) {
  // 获取平台加密密钥等基础信息接口
  self.$store.dispatch('getBaseDataEncryption').then(() => {
    handleSsoLogin(self, headers, loginParams);
  }).catch((err) => {
    console.log(err);
  });
}

function handleSsoLogin(self, headers, loginParams) {
  const passwordEncryption = new HussarPasswordEncryption();
  // 用户名和密码字段必传，单点登录可使用固定值，实际用户通过token从后台获取
  const userInfo = {
    username: 'user',
    password: passwordEncryption.encrypt('111111'), // pwd
    code: '',
    randomStr: 'blockPuzzle',
    isIndex: 'console',
    kaptcha: '',
    totp: '',
    kaptchasuffix: ''
  };
  // 登录参数以调用方传递的优先
  if (loginParams) {
    setCustomProperties(userInfo, loginParams);
  }

  // 登录接口
  self.$store.dispatch('Login', { userInfo, headers }).then((res) => {
    // 登录成功后跳转到平台页面
    // 获取登录后要访问的页面，默认访问首页
    const path = getToPath(self);
    if (res) {
      const origin = window.location.origin;
      if (path !== undefined && path !== '' && path !== null) {
        if (path.indexOf('hussarvfg') > -1) {
          window.location.href = origin + '/hussarvfg/#/';
        } else {
          window.location.href = origin + '/console.html#' + path;
        }
      } else {
        if (window.location.href.indexOf('console.html')) {
          window.location.href = origin + '/console.html#/index';
        } else {
          window.location.href = origin + '/index';
        }
      }
    }
    // self.$router.push({ path: path, query: { ...self.$route.query, toPath: '', systemParams: self.$route.query.systemParams }});
    caching.session.remove('toPath');
  }).catch((res) => {
    console.log(res.message);
  });
}

function setCustomProperties(params, customParams) {
  // 设置属性
  let keys = [];
  if (customParams) {
    keys = Object.getOwnPropertyNames(customParams);
  }
  if (keys !== undefined && keys !== null && keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      params[key] = customParams[key];
    }
  }
}

function getToPath(self) {
  // 从页面参数获取要跳转的路由
  let path = self.$route.query.toPath;
  if (!path) {
    // 从缓存中获取要跳转的路由
    path = caching.session.get('toPath');
  }
  return path;
}
