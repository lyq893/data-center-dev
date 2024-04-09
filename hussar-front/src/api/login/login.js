import * as loginExtend from './extends/loginExtend';

/**
 * 登录页面白名单
 */
export function getLoginWhiteList() {
  return loginExtend.loginWhiteList;
}

/**
 * 有效的登录类型
 */
export function getLoginTypeList() {
  return loginExtend.loginTypeList;
}

/**
 * 获取登录类型标识
 */
export function getLoginType(to, from) {
  return loginExtend.getLoginType(to, from);
}

/**
 * 调用不同登录类型的方法
 */
export function toLogin(loginType, to, from, next) {
  // 引入对应登录类型的js文件
  const loginJs = require('./extends/' + loginType);
  return loginJs.login(to, from, next);
}
