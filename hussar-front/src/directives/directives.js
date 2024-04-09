import vScrollbar from './scrollbar';

const install = (Vue) => {
  Vue.directive('scrollbar', vScrollbar);
};

export default install;
