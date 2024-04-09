import pkg from '../../package.json';

window.hussar_pkg = pkg;
window.baseUrl = process.env.VUE_APP_HUSSAR_DEFAULT_API;
window.appVfgUrl = process.env.VUE_APP_VFG_URL;
window.tokenName = process.env.VUE_APP_TOKEN_NAME;
window.tokenExpireIn = process.env.VUE_APP_TOKEN_EXPIRE_IN;
window.username = process.env.VUE_APP_USERNAME;
window.appRole = process.env.VUE_APP_ROLE;
window.appTheme = process.env.VUE_APP_THEME;
window.appPermission = process.env.VUE_APP_PERMISSION;
window.appGradeAdmin = process.env.VUE_APP_GRADEADMIN;
window.appTabSwitchOver = process.env.VUE_APP_TABSWITCHOVER;
window.appWebsocket = process.env.VUE_APP_WEBSOCKET;
window.appUserId = process.env.VUE_APP_USERID;
window.appEmployeeId = process.env.VUE_APP_EMPLOYEEID;
window.appUserAccount = process.env.VUE_APP_USEACCOUNT;
window.appUserAccountStatus = process.env.VUE_APP_USEACCOUNTSTATUS;

window.appDeptId = process.env.VUE_APP_DEPTID;
window.appDeptName = process.env.VUE_APP_DEPTNAME;
window.appDeptIcon = process.env.VUE_APP_DEPT_ICON;
window.appTenantCode = process.env.VUE_APP_TENANT_CODE;
window.appBpmTenantId = process.env.VUE_APP_BPM_TENANT_ID;
window.appBpmTenantCipher = process.env.VUE_APP_BPM_TENANT_CIPHER;
window.appTenantName = process.env.VUE_APP_TENANT_NAME;
window.appShowTenant = process.env.VUE_APP_SHOW_TENANT;
window.appStandAlone = process.env.VUE_APP_STAND_ALONE;
window.appSecurityLevel = process.env.VUE_APP_SECURITY_LEVEL;
window.appAdminType = process.env.VUE_APP_ADMIN_TYPE;
window.appOpenType = process.env.VUE_APP_OPEN_TYPE;
window.appMultiple = process.env.VUE_APP_MULTIPLE;
window.appHussarBackPath = process.env.VUE_APP_HUSSAR_BACK_PATH;
window.loginmethod = process.env.VUE_APP_LOGINMETHOD;

window.enableEncrypt = process.env.VUE_APP_ENABLE_ENCRYPT;
window.enabledEncryptSign = process.env.VUE_APP_ENABLED_ENCRYPT_SIGN;
window.enableEncryptCbcMode = process.env.VUE_APP_ENABLE_ENCRYPT_CBC_MODE;
window.headerEncrypt = process.env.VUE_APP_HEADER_ENCRYPT;
window.hussarFP = process.env.VUE_APP_FRONT_PRI_KEY;
window.hussarBP = process.env.VUE_APP_BACKEND_PUB_KEY;
window.enablePwEncryption = process.env.VUE_APP_ENABLE_PW_ENCRYPTION;
window.hussarET = process.env.VUE_APP_PW_ENCRYPTION_TYPE;
window.hussarEK = process.env.VUE_APP_PW_ENCRYPTION_KEY;

window.vueAppFileType = process.env.VUE_APP_FILE_TYPE;
window.appPageType = process.env.VUE_APP_PAGE_TYPE;
window.cachingNamespace = process.env.VUE_APP_CACHING_NAMESPACE;

// 自定义清除缓存的key值
// window.clearUserInfoList =  [
//   'refreshToken',
//   'expiresIn',
//   'HussarToken'
// ]

window.mobileComMod = process.env.VUE_APP_MOBILE_COM_MOD;
window.wechatBase = process.env.VUE_APP_WECHAT_BASE;
window.intergatedIAM = process.env.VUE_APP_INTEGRATED_IAM;
window.appManage = process.env.VUE_APP_APPMANAGE;
