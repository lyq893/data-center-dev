// 忘记密码
export const ForgetPwdApi = {
  getQues: '/getBackPwdFront/getQues', // 获取用户的密保
  getQuesByKaptcha: '/getBackPwdFront/getQuesByKaptcha', // 获取用户的密保
  checkAnswer: '/getBackPwdFront/validateKey', // 验证用户的密保
  resetPwd: '/getBackPwdFront/setNewPwd', // 重设新密码
  hasSetSecret: '/security/forgetPwd/hasSet', // 判断当前用户是否设置了密保
  setSecret: '/userFront/setGetBackPwd' // 当前用户设置密保
};
