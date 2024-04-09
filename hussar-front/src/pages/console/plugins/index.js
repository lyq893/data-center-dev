import directives from '@/directives/directives';

import loading from './loading';

export default {
  install(Vue) {
    Vue.use(directives);
    Vue.use(loading);
  }
};
