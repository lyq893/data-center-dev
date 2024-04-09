import { hussarRequest } from 'hussar-base';
// 组织机构下拉树初始化数据查询
export function getOrganTreeInitVos(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getOrganTreeInitVos', data);
}
// 根据父节点id查询下一级组织机构数据
export function getChildrenOrgan(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getChildrenOrgan', data);
}
// 根据关键字查询组织机构数据
export function getOrgansLikeName(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getOrgansLikeName', data);
}
// 1.5根据组织机构id查询组织机构数据
export function getOrganInfoById(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getOrganInfoById', data);
}
// 2.2根据父节点id查询下一级用户数据
export function getChildrenUsersByParentId(data) {
  return hussarRequest.get('/hussarBase/authorization/permit/user/getChildrenUsersByParentId', data);
}
// 1.4根据组织机构id查询父级组织机构树形数据
export function getUpOrganTreeByOrganId(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getUpOrganTreeByOrganId', data);
}
// 2.6根据父节点id查询本级及其下级所有用户数据
export function getUsersByParentId(data) {
  return hussarRequest.get('/hussarBase/authorization/permit/user/getUsersByParentId', data);
}
