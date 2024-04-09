import { hussarRequest } from 'hussar-base';
// 获取历史记录信息
export function getTreeRecordInfo(data) {
  return hussarRequest.get('hussarBase/treeRecord/getTreeRecordInfo', data);
}
// 保存历史记录信息
export function insertTreeRecordInfo(data) {
  return hussarRequest.postJson('hussarBase/treeRecord/insert', data);
}
// 修改历史记录信息
export function updateTreeRecordInfo(data) {
  return hussarRequest.postJson('hussarBase/treeRecord/update', data);
}
