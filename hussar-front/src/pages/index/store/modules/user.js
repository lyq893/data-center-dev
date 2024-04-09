import { tokenUtil, checkToken, hussarAxiosRequestUtils, userUtils, caching } from 'hussar-base';

import { LoginApi } from '@/api/loginApi';
import axios from 'axios';
import * as AuthCommon from '../../api/AuthCommon';

const user = {
  state: {
    // 刷新token定时器
    refreshTime: '',
    token: tokenUtil.getToken(),
    refresh_token: tokenUtil.getRefreshToken(),
    expires_in: tokenUtil.getExpiresIn(),
    refresh_expires_in: tokenUtil.getRefreshExpiresIn(),
    name: '',
    avatar: '',
    roles: [],
    tenantId: '',
    appName: '',
    deptId: '',
    deptName: '',
    deptCode: '',
    userId: '',
    employeeId: '',
    account: '',
    accountStatus: ''
  },

  mutations: {
    // 刷新token定时器
    SET_REFRESHTIME: (state, refreshTime) => {
      state.refreshTime = refreshTime;
    },
    SET_PART: (state, part) => {
      state.part = part;
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId;
      caching.session.set('TENANTID', tenantId);
      caching.local.set('TENANTID', tenantId);
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
      tokenUtil.setToken(token);
    },
    SET_REFRESH_TOKEN: (state, refresh_token) => {
      state.refresh_token = refresh_token;
      caching.session.set('refresh-token', refresh_token);
      caching.local.set('refresh-token', refresh_token);
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in;
      caching.session.set('expires-in', expires_in);
      caching.local.set('expires-in', expires_in);
    },
    SET_REFRESH_EXPIRES_IN: (state, refresh_expires_in) => {
      state.refresh_expires_in = refresh_expires_in;
      caching.session.set('refresh-expires-in', refresh_expires_in);
      caching.local.set('refresh-expires-in', refresh_expires_in);
    },
    SET_NAME: (state, name) => {
      state.name = name;
      caching.session.set(window.username, name);
      caching.local.set(window.username, name);
    },
    SET_EXPIRE_IN: (state, expireIn) => {
      state.expireIn = expireIn;
      caching.session.set(window.tokenExpireIn, expireIn);
      caching.local.set(window.tokenExpireIn, expireIn);
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      caching.session.set(window.appRole, roles);
      caching.local.set(window.appRole, roles);
    },
    SET_THEME: (state, theme) => {
      state.theme = theme;
      caching.session.set(window.appTheme, theme);
      caching.local.set(window.appTheme, theme);
      window.document.documentElement.setAttribute('data-theme', caching.session.get(window.appTheme));
    },
    SET_PERMISSION: (state, permissions) => {
      state.permissions = permissions;
      caching.session.set(window.appPermission, permissions);
      caching.local.set(window.appPermission, permissions);
    },
    SET_GRADEADMIN: (state, gradeAdmin) => {
      state.gradeAdmin = gradeAdmin;
      caching.session.set(window.appGradeAdmin, gradeAdmin);
      caching.local.set(window.appGradeAdmin, gradeAdmin);
    },
    TAB_SWITCHOVER: (state, tabSwitchover) => {
      state.tabSwitchover = tabSwitchover;
      caching.session.set(window.appTabSwitchOver, tabSwitchover);
      caching.local.set(window.appTabSwitchOver, tabSwitchover);
    },
    WEBSOCKET_EDIT: (state, websocket) => {
      state.websocket = websocket;
      caching.session.set(window.appWebsocket, websocket);
      caching.local.set(window.appWebsocket, websocket);
    },
    SET_ID: (state, id) => {
      state.id = id;
      state.userId = id;
      caching.session.set(window.appUserId, id);
      caching.local.set(window.appUserId, id);
    },
    SET_EMPLOYEEID: (state, employeeId) => {
      state.employeeId = employeeId;
      caching.session.set(window.appEmployeeId, employeeId);
      caching.local.set(window.appEmployeeId, employeeId);
    },
    SET_USER_ACCOUNT: (state, account) => {
      state.account = account;
      caching.session.set(window.appUserAccount, account);
      caching.local.set(window.appUserAccount, account);
    },
    SET_USER_ACCOUNT_STATUS: (state, accountStatus) => {
      state.accountStatus = accountStatus;
      caching.session.set(window.appUserAccountStatus, accountStatus);
      caching.local.set(window.appUserAccountStatus, accountStatus);
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId;
      caching.session.set(window.appDeptId, deptId);
      caching.local.set(window.appDeptId, deptId);
    },
    SET_DEPTNAME: (state, deptName) => {
      state.deptName = deptName;
      caching.session.set(window.appDeptName, deptName);
      caching.local.set(window.appDeptName, deptName);
    },
    SET_DEPTCODE: (state, deptCode) => {
      state.deptCode = deptCode;
      caching.session.set('deptCode', deptCode);
      caching.local.set('deptCode', deptCode);
    },
    SET_TENANT_CODE: (state, tenantCode) => {
      state.tenantCode = tenantCode;
      caching.session.set(window.appTenantCode, tenantCode);
      caching.local.set(window.appTenantCode, tenantCode);
    },
    SET_BPM_TENANT_ID: (state, bpmTenantId) => {
      state.bpmTenantId = bpmTenantId;
      caching.session.set(window.appBpmTenantId, bpmTenantId);
      caching.local.set(window.appBpmTenantId, bpmTenantId);
    },
    SET_BPM_TENANT_CIPHER: (state, bpmTenantCipher) => {
      state.bpmTenantCipher = bpmTenantCipher;
      caching.session.set(window.appBpmTenantCipher, bpmTenantCipher);
      caching.local.set(window.appBpmTenantCipher, bpmTenantCipher);
    },
    SET_TENANT_NAME: (state, tenantName) => {
      state.tenantName = tenantName;
      caching.session.set(window.appTenantName, tenantName);
      caching.local.set(window.appTenantName, tenantName);
    },
    SET_SHOW_TENANT: (state, showTenant) => {
      state.showTenant = showTenant;
      caching.session.set(window.appShowTenant, showTenant);
      caching.local.set(window.appShowTenant, showTenant);
    },
    STAND_ALONE: (state, standAlone) => {
      state.standAlone = standAlone;
      caching.session.set(window.appStandAlone, standAlone);
      caching.local.set(window.appStandAlone, standAlone);
    },
    SET_ADMIN_TYPE: (state, adminType) => {
      state.adminType = adminType;
      caching.session.set(window.appAdminType, adminType);
      caching.local.set(window.appAdminType, adminType);
    },
    SET_OPEN_TYPE: (state, openType) => {
      state.openType = openType;
      caching.session.set(window.appOpenType, openType);
      caching.local.set(window.appOpenType, openType);
    },
    SET_MULTIPLE: (state, isMultiple) => {
      state.isMultiple = isMultiple;
      caching.session.set(window.appMultiple, isMultiple);
      caching.local.set(window.appMultiple, isMultiple);
    },
    SET_ALL_ASSIST_ORGAN_NAME: (state, allAssistOrganName) => {
      state.allAssistOrganName = allAssistOrganName;
      caching.session.set(window.appMultiple, allAssistOrganName);
      caching.local.set(window.appMultiple, allAssistOrganName);
    },
    SET_ALL_ORGANS: (state, allOrgans) => {
      state.allOrgans = allOrgans;
      caching.session.set(window.appMultiple, allOrgans);
      caching.local.set(window.appMultiple, allOrgans);
    },
    SET_APP_NAME: (state, appName) => {
      state.appName = appName;
      caching.session.set('appName', appName);
      caching.local.set('appName', appName);
    },
    /* <%-- frontPriKey --%> */
    SET_HUSSAR_FP: (state, hussarFP) => {
      state.hussarFP = hussarFP;
      caching.local.set(window.hussarFP, hussarFP);
    },
    /* <%-- backendPubKey --%> */
    SET_HUSSAR_BP: (state, hussarBP) => {
      state.hussarBP = hussarBP;
      caching.local.set(window.hussarBP, hussarBP);
    },
    SET_HEADER_ENCRYPT: (state, headerEncrypt) => {
      state.headerEncrypt = headerEncrypt;
      caching.local.set(window.headerEncrypt, headerEncrypt);
    },
    SET_ENABLED_ENCRYPT_SIGN: (state, enabledEncryptSign) => {
      state.enabledEncryptSign = enabledEncryptSign;
      caching.local.set(window.enabledEncryptSign, enabledEncryptSign);
    },
    SET_ENABLE_ENCRYPT_CBC_MODE: (state, enableEncryptCbcMode) => {
      state.enableEncryptCbcMode = enableEncryptCbcMode;
      caching.local.set(window.enableEncryptCbcMode, enableEncryptCbcMode);
    },
    SET_ENABLE_ENCRYPT: (state, enableEncrypt) => {
      state.enableEncrypt = enableEncrypt;
      caching.local.set(window.enableEncrypt, enableEncrypt);
    },
    SET_ENABLE_PW_ENCRYPTION: (state, enablePwEncryption) => {
      state.enablePwEncryption = enablePwEncryption;
      caching.local.set(window.enablePwEncryption, enablePwEncryption);
    },
    /* <%-- pwEncryptionType --%> */
    SET_HUSSAR_ET: (state, hussarET) => {
      state.hussarET = hussarET;
      caching.local.set(window.hussarET, hussarET);
    },
    /* <%-- pwEncryptionKey --%> */
    SET_HUSSAR_EK: (state, hussarEK) => {
      state.hussarEK = hussarEK;
      caching.local.set(window.hussarEK, hussarEK);
    }
  },
  actions: {
    // 登录
    Login({ commit }, { userInfo, headers }) {
      return new Promise((resolve, reject) => {
        // 调用登录接口
        hussarAxiosRequestUtils.logInAction(LoginApi.login, userInfo, null, headers).then(response => {
          commit('SET_TOKEN', response.data['access-token']);
          // 天斧开发环境会用到
          tokenUtil.setCookieToken(response.data['access-token']);
          tokenUtil.setMobileComMod(window.mobileComMod);
          tokenUtil.setWechatBase(window.wechatBase);
          caching.session.set('isIAM', window.intergatedIAM);
          caching.session.set('isAppMANAGE', window.appManage);
          commit('SET_REFRESH_TOKEN', response.data['refresh-token']);
          // commit('SET_TENANT_ID', response.data.user_info.tenantId);
          commit('SET_EXPIRES_IN', response.data['expires-in']);
          commit('SET_REFRESH_EXPIRES_IN', response.data['refresh-expires-in']);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    LoginUserInfo({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 调用登录接口
        hussarAxiosRequestUtils.getAction(LoginApi.getInformation, userInfo).then(response => {
          // // 设置当前登录用户名
          // commit('SET_TOKEN', response.data.accessToken);
          // 设置当前登录用户名
          commit('SET_NAME', response.data.userName);
          // 设置权限列表
          commit('SET_PERMISSION', response.data.extendUserMap.permissions);
          commit('SET_ROLES', response.data.rolesList);
          commit('SET_GRADEADMIN', response.data.extendUserMap.gradeAdmin);
          // commit('SET_ADMIN_TYPE', data.adminType);
          // 设置用户id
          commit('SET_ID', response.data.userId);
          // 设置人员id
          commit('SET_EMPLOYEEID', response.data.employeeId);
          // 登录账号
          commit('SET_USER_ACCOUNT', response.data.account);
          commit('SET_USER_ACCOUNT_STATUS', response.data.accountStatus);
          // 设置部门id
          commit('SET_DEPTID', response.data.deptId);
          // 设置部门名称
          commit('SET_DEPTNAME', response.data.deptName);
          // 设置部门编码
          commit('SET_DEPTCODE', response.data.deptCode);
          // commit('SET_THEME', response.data.extendUserMap.theme);
          // 设置租户信息
          commit('SET_TENANT_CODE', response.data.tenantCode);
          commit('SET_TENANT_NAME', response.data.tenantName);
          commit('SET_SHOW_TENANT', response.data.extendUserMap.showTenant);
          commit('SET_BPM_TENANT_ID', response.data.extendUserMap.bpmTenantId);
          commit('SET_BPM_TENANT_CIPHER', response.data.extendUserMap.bpmTenantCipher);
          commit('SET_ALL_ASSIST_ORGAN_NAME', response.data.allAssistOrganName);
          commit('SET_ALL_ORGANS', response.data.allOrgans);
          userUtils.initUserInfo();
          tokenUtil.setLoginState();
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 登出操作，调用登出接口
        hussarAxiosRequestUtils.postAction(LoginApi.logout, '').then(res => {
          // 清空缓存
          commit('SET_REFRESH_TOKEN', '');
          commit('SET_EXPIRES_IN', '');
          commit('SET_REFRESH_EXPIRES_IN', '');
          tokenUtil.removeCache();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    /**
         * 获取公共属性加解密
         * @param commit
         * @returns {}
         * boolean enableEncrypt 是否开启加密
         * boolean enabledEncryptSign 是否开启签名
         * String headerEncrypt 请求中header中添加此header中的值 才进行加解密
         * String frontPriKey 前台私钥
         * String backendPubKey 后台公钥
         */
    getBaseDataEncryption({ commit }) {
      return new Promise((resolve, reject) => {
        hussarAxiosRequestUtils.getAction(LoginApi.getInitEncryptInfo).then(response => {
          if (response.code === 10000) {
            // 获取数据
            const data = response.data;
            // 加解密相关
            if (data.enableEncrypt) {
              commit('SET_HUSSAR_FP', data.hussarFP);
              commit('SET_HUSSAR_BP', data.hussarBP);
              commit('SET_HEADER_ENCRYPT', data.headerEncrypt);
              commit('SET_ENABLED_ENCRYPT_SIGN', data.enabledEncryptSign);
              commit('SET_ENABLE_ENCRYPT_CBC_MODE', data.enableEncryptCbcMode);
            }
            commit('SET_ENABLE_ENCRYPT', data.enableEncrypt);
            // 密码加密相关
            if (data.enablePwEncryption) {
              commit('SET_HUSSAR_ET', data.hussarET);
              commit('SET_HUSSAR_EK', data.hussarEK);
            }
            commit('SET_ENABLE_PW_ENCRYPTION', data.enablePwEncryption);
            // tab页切换
            commit('TAB_SWITCHOVER', data.tabSwitchover);
            // websocket
            commit('WEBSOCKET_EDIT', data.websocket);
            // HussarOperations/src/views/service/cache/performance.vue中使用
            commit('STAND_ALONE', data.standAlone);
            // HussarSchedule/src/views/schedule/scheduleManagement.vue中使用
            commit('SET_APP_NAME', data.appName);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 切换租户
    ChangeTenant({ commit }, param) {
      return new Promise((resolve, reject) => {
        // 调用切换租户接口
        hussarAxiosRequestUtils.postAction(LoginApi.changeTenant, param).then(response => {
          if (response.code === 10000) {
            // 用户登录成功
            // 获取数据
            const data = response.data;
            // 保存token
            checkToken.saveToken(data.accessToken);
            // 设置token
            commit('SET_TOKEN', data.accessToken);
            // 设置当前登录用户名
            commit('SET_NAME', data.userName);
            // 设置权限列表
            commit('SET_PERMISSION', data.permissions);
            commit('SET_ROLES', data.roles);
            commit('SET_GRADEADMIN', data.gradeAdmin);
            commit('SET_ADMIN_TYPE', data.adminType);
            // 设置用户id
            commit('SET_ID', data.userId);
            // 设置部门id
            commit('SET_DEPTID', data.deptId);
            // 设置部门名称
            commit('SET_DEPTNAME', data.deptName);
            // commit('SET_THEME', data.theme);
            // 设置租户信息
            commit('SET_TENANT_CODE', data.tenantCode);
            commit('SET_TENANT_NAME', data.tenantName);
            commit('SET_SHOW_TENANT', data.showTenant);
            commit('SET_BPM_TENANT_ID', data.bpmTenantId);
            commit('SET_BPM_TENANT_CIPHER', data.bpmTenantCipher);
            // 设置打开方式
            commit('SET_OPEN_TYPE', data.openType);
            // 是否允许打开多个页面
            commit('SET_MULTIPLE', data.isMultiple);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};
export default user;
