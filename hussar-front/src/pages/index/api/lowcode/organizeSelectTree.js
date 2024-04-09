import { hussarRequest } from 'hussar-base';

/**
 * 组织机构
 * @returns {*}
 */
// 查询组织树数据
export function getOrganTreeInitVos(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getOrganTreeInitVos', data);
}

// 根据父节点id查询组织机构数据
export function getChildrenOrgan(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getChildrenOrgan', data);
}

// 根据关键字查询组织机构数据
export function getOrgansLikeName(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getOrgansLikeName', data);
}

// 根据id查询全路径
export function getOrganInfoById(data) {
  return hussarRequest.get('/hussarBase/authorization/organ/getOrganInfoById', data);
}

/**
 * 人员
 * @returns {*}
 */
// 查询组织树数据
export function getStaffTreeInitVos(data) {
  return hussarRequest.get('/hussarBase/authorization/staff/getStaffTreeInitVos', data);
}

// 根据父节点id查询组织机构数据
export function getChildrenStaff(data) {
  return hussarRequest.get('/hussarBase/authorization/staff/getChildrenStaff', data);
}

// 根据关键字查询组织机构数据
export function getStaffsLikeName(data) {
  return hussarRequest.get('/hussarBase/authorization/staff/getStaffsLikeName', data);
}

// 根据id查询全路径
export function getStaffInfoById(data) {
  return hussarRequest.get('/hussarBase/authorization/staff/getStaffInfoById', data);
}

/**
 * 用户
 * @returns {*}
 */
// 查询组织树数据
export function getUserTreeInitVos(data) {
  return hussarRequest.get('/hussarBase/authorization/permit/user/getUserTreeInitVos', data);
}

// 根据父节点id查询组织机构数据
export function getChildrenUser(data) {
  return hussarRequest.get('/hussarBase/authorization/permit/user/getChildrenUsersByParentId', data);
}

// 根据关键字查询组织机构数据
export function getUsersLikeName(data) {
  return hussarRequest.get('/hussarBase/authorization/permit/user/getUsersLikeName', data);
}

// 根据id查询全路径
export function getUserInfoById(data) {
  return hussarRequest.get('/hussarBase/authorization/permit/user/getUserInfoByUserId', data);
}
