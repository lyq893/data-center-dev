import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
function installScrollBar(el, binding) {
  if (!binding.value) {
    el._ps = new PerfectScrollbar(el, {});
  } else {
    let className = '';
    let options = {};
    const str = binding.value;
    if ((typeof str === 'string') && str.constructor === String) {
      className = binding.value;
    } else if (Object.prototype.toString.call(str) === '[object Object]') {
      className = binding.value.className;
      options = binding.value.options || {};
    }
    if (className) {
      const targetEl = el.querySelector(className);
      if (targetEl) {
        el._ps = new PerfectScrollbar(targetEl, options);
      }
    } else {
      el._ps = new PerfectScrollbar(el, options);
    }
  }
}

/**
 * 基于perfect-scrollbar 封装的滚动条指令
 * 使用示例：v-scrollbar="{className:`.el-table__body-wrapper`}"
 * v-scrollbar="`.el-table__body-wrapper`"
 * v-scrollbar="`.vue-easy-tree`"
 * @type {null}
 */

export default {
  inserted(el, binding) {
    installScrollBar(el, binding);
  },

  componentUpdated(el, binding) {
    if (el._ps) {
      setTimeout(() => {
        el._ps && el._ps.update();
      }, 500);
    } else {
      installScrollBar(el, binding);
    }
  },

  unbind(el) {
    el._ps && el._ps.destroy();
    el._ps = null;
  }
};
