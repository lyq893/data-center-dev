import { caching } from 'hussar-base';

const getters = {
  internationalization: state => state.app.internationalization,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: () => caching.local.get(window.tokenName),
  avatar: state => state.user.avatar,
  name: () => caching.session.get(window.username),
  userId: state => state.user.userId,
  deptId: state => state.user.deptId,
  deptName: state => state.user.deptName,
  deptCode: state => state.user.deptCode,
  roles: () => caching.session.get(window.appRole),
  permission_routers: state => state.permission.routers,
  arrHead: state => state.permission.arrHead,
  addRouters: state => state.permission.addRouters,
  theRouters: state => state.permission.theRouters,
  permissions: () => caching.session.get(window.appPermission),
  tenantCode: () => caching.session.get(window.appTenantCode),
  tenantName: () => caching.session.get(window.appTenantName),
  showTenant: () => caching.session.get(window.appShowTenant),
  layoutLogo: state => state.config.layoutLogo,
  layoutSysname: state => state.config.layoutSysname,
  layoutType: state => state.config.layoutType
};
export default getters;
