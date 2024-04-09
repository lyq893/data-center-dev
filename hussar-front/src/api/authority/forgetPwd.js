import { hussarRequest } from 'hussar-base';
/**
 * 获取用户的密保
 */
export function getQues(account) {
  return hussarRequest.postJson('/getBackPwdFront/getQues', {
    userAccount: account
  });
}

/**
 * 验证用户的密保
 */
export function checkAnswer(data) {
  return hussarRequest.postJson('/getBackPwdFront/validateKey', data);
}

/**
 * 重设新密码
 */
export function resetPwd(data) {
  return hussarRequest.postJson('/getBackPwdFront/setNewPwd', data);
}

/**
 * 判断当前用户是否设置了密保
 */
export function hasSetSecret() {
  return hussarRequest.postJson('/security/forgetPwd/hasSet');
}

/**
 * 当前用户设置密保
 */
export function setSecret(form) {
  return hussarRequest.postJson('/userFront/setGetBackPwd', form);
}
