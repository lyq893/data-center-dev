import { AxiosConfig } from 'hussar-base';
import { requestTimeout, successCode, noPermissionCode, requestFileTimeout, singleMsg } from '../config/index';
AxiosConfig.initAxios({
  baseURL: process.env.VUE_APP_HUSSAR_DEFAULT_API,
  requestTimeout,
  successCode,
  noPermissionCode,
  requestFileTimeout,
  singleMsg,
  requestInterceptor(config) {
    return config;
  },
  responseInterceptor(response) {
    return response;
  }
});
