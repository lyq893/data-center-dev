// 缓存
import { caching } from 'hussar-base';

// 832升级834,开启兼容模式（开启后，忽略数据类型）
// localStorage.setItem('834-cache-compatibility-mode', true);

if (window.cachingNamespace) {
  caching.local.init(window.cachingNamespace);
  caching.session.init(window.cachingNamespace);
}
