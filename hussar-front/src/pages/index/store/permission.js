/* ！
 * permission.js
 * 资源权限处理
 * @author luzhanzhao
 */

// 导入store
import store from '@/pages/index/store/index';

/**
 * 获取缓存中的资源权限列表
 * @method getPermissionList
 * @returns {void|*|never|string[]|Array}
 */
function getPermissionList() {
  const permissionStr = store.getters.permissions;
  return permissionStr;
}

/**
 * 获取缓存中的角色列表
 * @method getPermissionList
 * @returns {void|*|never|string[]|Array}
 */
function getRoles() {
  const rolesStr = store.getters.roles;
  return rolesStr;
}
// 定义权限允许实体
const permission = {};
/**
 * 判断当前登录用户是否拥有该资源的权限
 * @method hasPermission
 * @param p 资源标识
 * @returns {boolean} true：拥有该资源的权限，false：未拥有该资源的权限
 */
permission.hasPermission = (p) => {
  const ps = getPermissionList();
  return ps.indexOf(p) !== -1;
};
/**
 * 判断当前登录用户是否拥有该角色
 * @method hasRole
 * @param role 角色标识
 * @returns {boolean} true：拥有该角色，false：未拥有该角色
 */
permission.hasRole = (role) => {
  const roles = getRoles();
  return roles.indexOf(role) !== -1;
};
// 导出实体
export default permission;
