function excelDownloadForArea(colIndex) {
  const ordA = 'A'.charCodeAt(0);
  const ordZ = 'Z'.charCodeAt(0);
  const len = ordZ - ordA + 1;
  let str = '';
  while (colIndex >= 0) {
    str = String.fromCharCode(colIndex % len + ordA) + str;
    colIndex = Math.floor(colIndex / len) - 1;
  }
  return str;
}

function tableToolTipsDisplay(type) {
  const toolTips = document.getElementsByClassName('el-tooltip__popper');
  toolTips.forEach((e) => {
    e.style.display = type;
  });
}

function tableShowSortTypePublic(key, self) {
  const orders = self[key + 'ForOrderType'];
  const columns = self.$refs[key + 'TableRef'].collectColumn;
  const orderTemp = [];
  let realCols = [];
  function getCols(columns) {
    columns.forEach((column) => {
      if (column.children && column.children.length > 0) {
        getCols(column.children);
      } else {
        realCols = realCols.concat(column);
      }
    });
  }
  getCols(columns);
  realCols.forEach((column) => {
    column.order = null;
    orders.forEach((order) => {
      if (column.property === order.property && orderTemp.indexOf(order.property) === -1) {
        orderTemp.push(order.property);
        column.order = order.order;
      }
      if (column.property === order.column && orderTemp.indexOf(order.column) === -1) {
        orderTemp.push(order.column);
        column.order = order.asc ? 'asc' : 'desc';
      }
    });
  });
  self[key + 'TableLoad']();
}

function tableScrollbarPublic(key, self) {
  self.$nextTick(() => {
    if (self.$refs && self.$refs[key + 'TableRef']?.layout) {
      self.$refs[key + 'TableRef'].layout.gutterWidth = 9;
      self.$refs[key + 'TableRef'].doLayout();
    }
  });
}

function treeTableColSumDealDataPublic(key, data) {
  let flag = [];
  data.forEach((item) => {
    flag.push(item);
    if (item.children.length > 0) {
      flag = flag.concat(treeTableColSumDealDataPublic(key, item.children));
    }
  });
  return flag;
}

function treeTableToggleSelectionPublic(key, self, row, select) {
  if (row) {
    self.$nextTick(() => {
      self.$refs[key + 'TableRef'] && self.$refs[key + 'TableRef'].toggleRowSelection(row, select);
    });
  }
}

function treeTableTraversePublic(key, self, data, id) {
  Object.keys(data).forEach((i) => {
    if (data[i].id === id) {
      self.$refs[key + 'TableRef'].setCurrentRow(data[i]);
    }
    if (data[i].children) {
      treeTableTraversePublic(key, self, data[i].children, id);
    }
  });
}

function treeTableChildrenDataLoadPublic(key, self, datas, rootDataArray) {
  for (let j = 0; j < rootDataArray.length; j++) {
    const dataArrayIndex = rootDataArray[j];
    const childrenArray = [];
    const id = dataArrayIndex.id;
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const pid = data.pid;
      if (pid == id) {
        const objTem = {
          id: data.id,
          pid: pid,
          ...data
        };
        childrenArray.push(objTem);
      }
    }
    dataArrayIndex.children = childrenArray;
    if (childrenArray.length > 0) {
      treeTableChildrenDataLoadPublic(key, self, self[key + 'Data'], childrenArray);
    }
  }
  return rootDataArray;
}

export
{
  excelDownloadForArea,
  tableToolTipsDisplay,
  tableShowSortTypePublic,
  tableScrollbarPublic,
  treeTableColSumDealDataPublic,
  treeTableToggleSelectionPublic,
  treeTableTraversePublic,
  treeTableChildrenDataLoadPublic
};
