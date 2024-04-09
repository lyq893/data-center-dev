/**
 * @description 导出默认网路配置
 **/
const network = {
  //最长请求时间(公共)
  requestTimeout: 60 * 1000,
  requestFileTimeout: -1,
  //操作正常code，支持String、Array、int多种类型
  successCode: [200, 10000,'1'],
  //无权限code
  noPermissionCode: 403,
  singleMsg: false
}
module.exports = network
