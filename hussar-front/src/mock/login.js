import { UtilsIndex } from 'hussar-base';
const userMap = {
  superadmin: {
    code: 200,
    data: {
      accessToken: 'superadmin',
      expiresIn: 6,
      userName: '超级',
      permissions: [1, 2, 3],
      authority: ['superadmin']
    }
  },
  editor: {
    code: 200,
    data: {
      accessToken: 'editor',
      expiresIn: 6,
      userName: '超级',
      permissions: [1, 2, 3],
      authority: ['superadmin']
    }
  }
};

const RoleMap = {
  superadmin: {
    roles: ['superadmin'],
    token: 'superadmin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
};
export default {
  login: config => {
    const account = 'superadmin';
    return userMap[account];
  },
  getUserInfo: config => {
    const { token } = UtilsIndex.param2Obj(config.url);
    if (RoleMap[token]) {
      return RoleMap[token];
    } else {
      return false;
    }
  },
  logout: () => 'success',
  addLoginLog: config => {
    const response = {
      code: 200,
      data: {},
      msg: '',
      success: true
    };
    return response;
  }
};
