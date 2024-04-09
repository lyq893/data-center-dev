import { setCustomResponseCodeHandler } from 'hussar-base';

export default function refreshEncryptionSetup(app) {
  // 注册自定义响应码 4106 的响应处理器，刷新密钥数据但不重发请求，只提示用户重新操作
  setCustomResponseCodeHandler(4106, function(response) {
    app.$message({ type: 'error', message: '页面信息已过期，请重新登录！' });
    app.$store.dispatch('getBaseDataEncryption');
    throw new Error(`请求 ${response.config.url} 解密失败：页面信息已过期，请重新登录！`);
  });
}
