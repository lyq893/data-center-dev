// 用于格式化日期时间
function formatDate(date, fmt) {
  let ret;
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  Object.keys(opt).forEach((key) => {
    ret = new RegExp('(' + key + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[key] : opt[key].padStart(ret[1].length, '0'));
    }
  });
  return fmt;
}

// 添加到保存流程表单和提交流程表单动作中，判断两个对象是否相等
function isObjectsEqual(objA, objB, self) {
  // 相等
  if (objA === objB) return objA !== 0 || 1 / objA === 1 / objB;
  // 空判断
  if (objA == null || objB == null) return objA === objB;
  // 类型判断
  if (Object.prototype.toString.call(objA) !== Object.prototype.toString.call(objB)) {
    return false;
  }
  switch (Object.prototype.toString.call(objA)) {
    case '[object RegExp]':
    case '[object String]':
      // 字符串转换比较
      return objA === objB;
    case '[object Number]': {
      // 数字转换比较,判断是否为NaN
      const x = parseInt(objA, 10);
      const y = parseInt(objB, 10);
      if (Number.isNaN(x)) {
        return Number.isNaN(y);
      }
      return +objA === 0 ? 1 / +objA === 1 / objB : +objA === +objB;
    }
    case '[object Date]':
    case '[object Boolean]':
      return +objA === +objB;
    case '[object Array]':
      // 判断数组
      if (objA.length !== objB.length) {
        return false;
      } else {
        for (let i = 0; i < objA.length; i++) {
          if (!isObjectsEqual(objA[i], objB[i], self)) return false;
        }
        return true;
      }
    case '[object Object]': {
      // 判断对象
      let keys = Object.keys(objA);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === '_XID') {
          continue;
        }
        if (Object.prototype.toString.call(objA[keys[i]]) !== Object.prototype.toString.call(objB[keys[i]])) {
          if (Object.prototype.toString.call(objA[keys[i]]) === '[object Date]' || Object.prototype.toString.call(objB[keys[i]]) === '[object Date]') {
            const selector = '[' + keys[i].toLowerCase() + ']';
            const tempDate1 = formatDate(new Date(objA[keys[i]]), self.$el.querySelector(selector).getAttribute(keys[i].toLowerCase()));
            const tempDate2 = formatDate(new Date(objB[keys[i]]), self.$el.querySelector(selector).getAttribute(keys[i].toLowerCase()));
            if (!isObjectsEqual(tempDate1, tempDate2, self)) return false;
            // return true;
          } else {
            if (!isObjectsEqual(objA[keys[i]], objB[keys[i]], self)) return false;
          }
        } else {
          if (!isObjectsEqual(objA[keys[i]], objB[keys[i]], self)) return false;
        }
      }
      keys = Object.keys(objB);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === '_XID') {
          continue;
        }
        if (Object.prototype.toString.call(objA[keys[i]]) !== Object.prototype.toString.call(objB[keys[i]])) {
          if (Object.prototype.toString.call(objA[keys[i]]) === '[object Date]' || Object.prototype.toString.call(objB[keys[i]]) === '[object Date]') {
            const selector = '[' + keys[i].toLowerCase() + ']';
            const tempDate1 = formatDate(new Date(objA[keys[i]]), self.$el.querySelector(selector).getAttribute(keys[i].toLowerCase()));
            const tempDate2 = formatDate(new Date(objB[keys[i]]), self.$el.querySelector(selector).getAttribute(keys[i].toLowerCase()));
            if (!isObjectsEqual(tempDate1, tempDate2, self)) return false;
            // return true;
          } else {
            if (!isObjectsEqual(objA[keys[i]], objB[keys[i]], self)) return false;
          }
        } else {
          if (!isObjectsEqual(objA[keys[i]], objB[keys[i]], self)) return false;
        }
      }
      return true;
    }
    default:
      return false;
  }
}

export { formatDate, isObjectsEqual };
