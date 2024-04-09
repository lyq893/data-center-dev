
import { hussarRequest } from 'hussar-base';

/**
 * 换肤
 */
export function changeskin(data) {
  return new Promise((resolve, reject) => {
    hussarRequest.postForm('/theme/setTheme', data).then(res => {
      resolve(res);
    }).catch((err) => {
      self.$message.error('异常');
      reject(err);
    });
  });
}

