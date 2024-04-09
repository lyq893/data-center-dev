import { hussarRequest } from 'hussar-base';
/**
* 自由驳回
*/
export function freeReject(url, data) {
  return hussarRequest.postJson(url + '/freeReject'
    , data);
}
