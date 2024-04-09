import { hussarRequest } from 'hussar-base';
// 获取自定义列表字段
export function getCustomTableOptions(data) {
  return hussarRequest.get('hussarBase/customTable/queryList', data);
}
// 保存自定义列表字段
export function saveCustomTableOptions(data) {
  return hussarRequest.postJson('hussarBase/customTable/insertOrUpdate', data);
}
