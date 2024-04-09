/**
 * todo: 此处为示例文件，在/api/login/extends路径下创建根据登录类型命名的js文件，并实现login方法
 * todo: login方法目的是携带认证参数跳转到当前登录类型的登录页面，或访问服务端认证地址
 */
import { hussarAxiosRequestUtils, caching } from 'hussar-base';
export function login(to, from, next) {
  // 获取登录后想要访问的页面路由，to.fullPath或to.path
  const toPath = to.fullPath;
  let loginType = to.query.loginType;
  if (loginType === undefined || loginType === null || loginType === '') {
    loginType = 'iamLogin';
  }
  // 如果是访问服务端认证地址，路由参数可能丢失，存入前台缓存
  caching.session.set('toPath', toPath);
  const ipAddress = window.location.host;
  const protocol = window.location.protocol;
  window.location.href = 'https://idp.qd-metro.com/idp/oauth2/authorize?client_id=LCDP&response_type=code&state=111&redirect_uri=' + protocol + '//' + ipAddress + '/console.html%23/iamLogin%3FloginType=' + loginType;
}
