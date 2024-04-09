// 登录
export const LoginApi = {
  login: '/hussarAuth/oauth2/token', // saas用户登录接口
  baseLogin: '/frontLogin/login', // 平台用户登录接口
  getTotpKapcha: '/frontLogin/getTotpKapcha',
  getKaptchaUrl: '/kaptcha',
  getMenu: '/frontMenu/getMenu',
  getMasterMenu: '/frontMenu/getMasterMenu', //
  getResource: '/resourceFront/getResources', //
  getMasterResources: '/resourceFront/getMasterResources', //
  baseLogout: '/frontLogin/logout', // 平台用户退出接口
  logout: '/hussarAuth/oauth2/logout', // saas用户退出接口
  addLoginLog: '/auth/addLoginLog', //
  getInitEncryptInfo: '/vue/baseData/getBaseData', // 获取加解密信息
  getPublicKey: '/authClientModel/getPublicKey', //
  kaptchaFront: '/kaptchaFront', //
  validateLogin: '/frontLogin/validateLogin', //
  validateLogout: '/frontLogin/validateLogout', //
  casLogin: '/casFrontLogin/login', //
  isCasActive: '/frontLogin/isCasActive', //
  getTenantCodeByDomain: '/frontLogin/getTenantCodeByDomain', //
  changeTenant: '/frontLogin/changeTenant', //
  changeTenantNeedPwd: '/frontLogin/changeTenantNeedPwd',
  getInformation: '/frontLogin/getLoginUserInfo',
  getThemeColor: '/themeConfig/getThemeColor' // 获取主题色
};
