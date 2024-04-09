/**
 * treeData: 树数据，id: 节点id
 * @returns num == 0 ，返回节点children，num == 1，返回节点label
 */
export function getNodeData(treeData, id, num) {
  var returnedItem = null;
  var find = function (arr, id) {
    if (arr == undefined || arr == null || arr.length == 0) {
      return;
    }
    // 利用foreach循环遍历
    arr.forEach((item) => {
      // 判断递归结束条件
      if (item.id == id) {
        if (num == 0) {
          returnedItem = item.children;
        } else {
          returnedItem = item.label;
        }
        return returnedItem;
        // 判断chlidren是否有数据
      } else if (item.children.length > 0) {
        // 递归调用
        find(item.children, id);
      }
    });
  };
  // 根据nodeId查询children
  find(treeData, id);
  return returnedItem;
}
// 搜索高亮
export function brightenKeyword(val, keyword) {
  if (keyword.length > 0) {
    const reg = new RegExp(keyword, 'ig');
    return val.replace(reg, (val) => {
      return `<span style="color:var(--c-themeColor)">${val}</span>`;
    });
  } else {
    return val;
  }
}
// 验证字符串是否是数字
export function checkNumber(theObj) {
  var reg = /^[0-9]+\.?[0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}
