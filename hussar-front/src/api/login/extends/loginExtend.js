// 注册的登录页面路由，/ssoLogin为示例页面路由
import { caching } from 'hussar-base';

export const loginWhiteList = ['/ssoLogin', '/iamLogin'];
// 有效的登录类型，getLoginType返回的登录类型不在此数组里时取默认登录类型，ssoLogin为示例登录类型
export const loginTypeList = ['ssoLogin', 'iamLogin'];

/**
 * 获取登录类型标识
 */
export function getLoginType(to) {
  // 直接传登录类型参数
  let loginType = to.query.loginType;
  // 获取到登录类型参数直接返回
  if (loginType !== null && loginType !== undefined && loginType !== '') {
    return loginType;
  }

  // 未获取到登录类型参数，判断登录类型，可根据传递的参数或从后台接口获取
  // todo：此处需进行自定义扩展，根据不同登录方式的差异性判断登录类型
  // default为平台默认登录页，如果想默认跳转到某个单点登录的登录页，此处需改为相应登录类型值，如ssoLogin
  if (process.env.VUE_APP_INTEGRATED_IAM != 'true') {
    loginType = 'default';
  } else {
    loginType = 'iamLogin';
  }
  return loginType;
}
