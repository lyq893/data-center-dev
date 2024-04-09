import { hussarRequest } from 'hussar-base';
/**
 * 获取根据表单ID与流程标识获取相应工作流权限配置
 */
export function getAllAuthConfigs(data) {
  return hussarRequest.postJson('/flowAuth/getAllAuthConfigs', data);
}

/**
 * 获取根据表单ID与流程标识获取相应工作流权限配置
 */
export function getOnlineConfig() {
  return hussarRequest.get('/bpm/publicProcess/getModifyConfigurationOnline');
}
