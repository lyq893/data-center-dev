import * as _ from 'lodash';

export default (store) => {
  store.$events = {};
  store.$on = (evt, fn) => {
    const eventName = `$${evt}`;
    if (!_.has(store.$events, eventName)) {
      store.$events[eventName] = [];
    }
    store.$events[eventName].push(fn);
  };
  store.$set = (evt, fn) => {
    const eventName = `$${evt}`;
    store.$events[eventName] = [];
    store.$events[eventName].push(fn);
  };
  store.$off = (evt, fn) => {
    const eventName = `$${evt}`;
    if (store.$events[eventName]) {
      const index = store.$events[eventName].indexOf(fn);
      if (index > -1) {
        store.$events[eventName].splice(index, 1);
      }
    }
  };
  store.$emit = (evt, data) => {
    const eventName = `$${evt}`;
    if (!_.has(store.$events, eventName)) return;
    for (let i = 0; i < store.$events[eventName].length; i++) {
      if (_.isFunction(store.$events[eventName][i])) {
        try {
          store.$events[eventName][i](data);
        } catch (e) {
          console.warn(`${eventName}执行函数错误,错误信息：`);
          console.warn(e);
        }
      } else {
        console.warn(`${eventName}触发错误,错误信息：`);
        console.warn(data);
      }
    }
  };
};
