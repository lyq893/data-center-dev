/**
 * todo: 此处为示例文件，在/api/login/extends路径下创建根据登录类型命名的js文件，并实现login方法
 * todo: login方法目的是携带认证参数跳转到当前登录类型的登录页面，或访问服务端认证地址
 */
import { caching } from 'hussar-base';
export function login(to, from, next) {
  // 单点登录时，如果存在认证参数，跳转到单点登录页面；如果没有认证参数，重定向到服务端认证接口
  // 例：从页面参数中获取认证参数
  const token = to.query.token;
  // 获取登录后想要访问的页面路由，to.fullPath或to.path
  const toPath = to.fullPath;
  if (token !== null && token !== undefined && token !== '') {
    // 认证参数不为空，跳转到处理此单点登录的页面，携带认证参数
    next('/ssoLogin?token=' + token + '&toPath=' + toPath);
  } else {
    // 认证参数为空，获取服务端认证地址并跳转，可在前台配置或从后台接口获取
    // 例：后台实现一个返回服务端认证地址的接口，前台调用并访问服务端认证地址
    // hussarAxiosRequestUtils.getAction(LoginApi.getServerUrl).then(res => {
    //   window.location.href = res.serverUrl;
    // }).catch(err => {
    // });
    const username = to.query.username;
    const loginType = to.query.loginType;
    next('/ssoLogin?username=' + username + '&loginType=' + loginType);
    // 如果是访问服务端认证地址，路由参数可能丢失，存入前台缓存
    caching.session.set('toPath', toPath);
  }
}
