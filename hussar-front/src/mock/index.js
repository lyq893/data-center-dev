
import Mock from 'mockjs';
import loginAPI from '@/pages/index/mock/login';

// 登录相关
Mock.mock(/\/auth\/token/, 'post', loginAPI.login);
Mock.mock(/\/auth\/addLoginLog/, 'get', loginAPI.addLoginLog);
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo);

export default Mock;
