<template>
  <div>
    <el-dialog
      :visible="isDialogShow"
      :modal-append-to-body="true"
      :append-to-body="true"
      class="participantDialogVisible lcdp-dialog"
      title="排序"
      @close="handleClose"
    >
      <div class="table-title">
        <div class="tool-btns">
          <el-button class="dialog-save" type="primary" @click="addSortCondition">添加</el-button>
          <el-button class="btn-del" type="primary" @click="delSortCondition">删除</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <vxe-table
          show-overflow
          :border="sortDialogBorderStyle"
          class="lcdp-table"
          ref="sortDialogTableRef"
          @checkbox-change="sortDialogSelectRow"
          @checkbox-all="sortDialogSelectAll"
          :cell-style="sortDialogCellStyle"
          :data="sortDialogData"
        >
          <vxe-table-column align="center" type="checkbox" :width="50" />
          <vxe-table-column align="center" header-align="center" field="fieldShow" title="排序列" :min-width="54" :edit-render="{}">
            <template slot-scope="scope">
              <span>{{ showLabel(scope) }}</span>
              <el-select v-model="scope.row.fieldShow" @change="$refs.sortDialogTableRef.updateStatus(scope)">
                <el-option v-for="item in fieldList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </vxe-table-column>
          <vxe-table-column align="center" header-align="center" field="fieldOrder" title="次序" :min-width="68" :edit-render="{}">
            <template slot-scope="scope">
              <el-select v-model="scope.row.fieldOrder" @change="$refs.sortDialogTableRef.updateStatus(scope)">
                <el-option v-for="item in fieldOrderList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog-save" type="primary" @click="tableQueryByUser">查询</el-button>
        <el-button class="dialog-cancel" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HussarRouter from '@/utils/HussarRouter';

export default {
  name: 'SortTableOverall',
  props: {
    isDialogShow: Boolean,
    fieldList: Array,
    sortOrders: Object
  },
  data() {
    return {
      isShow: false,
      sortTableRow: [],
      sortDialogBorderStyle: 'default',
      sortDialogTableLoading: false,
      sortDialogData: [],
      fieldOrderList: [{
        label: '升序',
        value: 'asc'
      }, {
        label: '降序',
        value: 'desc'
      }],
      sortDialogOptCols: [{
        field: 'field',
        colEditComponent: 'select'
      }, {
        field: 'fieldOrder',
        colEditComponent: 'select'
      }],
      sortDialogTableDataChecked: []
    };
  },
  computed: {
  },
  watch: {
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    /**
     * @description: 展示最近查询方式
     */
    showEditorData() {
      const self = this;
      const showData = [];
      if (self.sortOrders && self.sortOrders.orders && self.sortOrders.orders.length > 0) {
        const { orders } = self.sortOrders;
        orders.forEach((order) => {
          const orderItem = {};
          // orderItem.fieldShow = self.toHump(order.column);
          orderItem.fieldShow = order.column;
          orderItem.fieldOrder = order.asc ? 'asc' : 'desc';
          showData.push(orderItem);
        });
      }
      self.sortDialogData = showData;
    },
    /**
     * @description: 展示主次关键字
     * @param {type} scope - description
     */
    showLabel(scope) {
      if (scope.$rowIndex === 0) {
        return '主要关键字：';
      } else {
        return '次要关键字：';
      }
    },
    /**
     * @description: 用户查询
     */
    tableQueryByUser() {
      const self = this;
      const { tableData } = self.$refs.sortDialogTableRef;
      const orders = [];
      self.sortOrders.orders = [];
      // fieldShow和fieldOrder写死，，，，column和asc写死
      if (tableData && tableData.length > 0) {
        tableData.forEach((tableItem) => {
          const order = {};
          // order.column = self.toLine(tableItem.fieldShow);
          order.column = tableItem.fieldShow;
          order.asc = tableItem.fieldOrder === 'asc';
          orders.push(order);
        });
        this.sortOrders.orders = orders;
      }
      this.$emit('close');
      this.$emit('sort-table', this.sortOrders);
    },
    sortDialogCellStyle(row) {
      const self = this;
      if (row.column.property === 'fieldShow') {
        return 'background-color: null;background-image: linear-gradient(null, null), linear-gradient(null, null);color: null;font-family: null;';
      }
      if (row.column.property === 'fieldOrder') {
        return 'background-color: null;background-image: linear-gradient(null, null), linear-gradient(null, null);color: null;font-family: null;';
      }
    },
    sortDialogSelectAll({ selection }) {
      const self = this;
      self.sortDialogTableDataChecked = [];
      selection.forEach((item) => {
        self.sortDialogTableDataChecked.push(item);
      });
    },
    sortDialogSelectRow({ selection }) {
      const self = this;
      self.sortDialogTableDataChecked = [];
      selection.forEach((item) => {
        self.sortDialogTableDataChecked.push(item);
      });
    },
    addSortCondition() {
      const self = this;
      if (self.sortDialogOptCols.length > 0) {
        const sortDialogAddItem = {};
        let firstField = '';
        for (let i = 0; i < self.sortDialogOptCols.length; i++) {
          if (i === 0) {
            firstField = self.sortDialogOptCols[i].field;
          }
          const fieldStr = self.sortDialogOptCols[i].field;
          if (self.sortDialogOptCols[i].colEditComponent === 'input' || self.sortDialogOptCols[i].colEditComponent === '') {
            sortDialogAddItem[fieldStr] = '';
          } else if (self.sortDialogOptCols[i].colEditComponent === 'number') {
            sortDialogAddItem[fieldStr] = 0;
          } else if (self.sortDialogOptCols[i].colEditComponent === 'date') {
            sortDialogAddItem[fieldStr] = new Date();
          } else {
            sortDialogAddItem[fieldStr] = '';
          }
        }
        self.$refs.sortDialogTableRef.insertAt(sortDialogAddItem, -1);
        self.$refs.sortDialogTableRef.setActiveCell(self.$refs.sortDialogTableRef.afterFullData[self.$refs.sortDialogTableRef.afterFullData.length - 1], firstField);
      } else {
        self.$refs.sortDialogTableRef.insertAt({}, -1);
      }
    },
    delSortCondition() {
      const self = this;
      const selectData = self.$refs.sortDialogTableRef.getCheckboxRecords();
      if (selectData.length <= 0) {
        HussarRouter.showMsg(self, '请至少选择一条数据', 'warning');
      }
      self.$refs.sortDialogTableRef.removeCheckboxRow();
    }
  }
};
</script>

<style scoped>
.table-wrap >>> .vxe-table--body-wrapper{
  height: 230px;
}
.dialog-body {
  height: 519px;
}
.dialog-body {
  width: 974px;
}
.el-dialog .dialog-header {
  overflow: hidden;
}
.el-dialog .dialog-header {
  text-overflow: ellipsis;
}
.el-dialog .dialog-header {
  white-space: nowrap;
}
.el-dialog .dialog-header {
  width: 100%;
}
.el-dialog__headerbtn {
  height: auto;
}
.el-dialog__headerbtn {
  line-height: 0;
}
.el-dialog__headerbtn {
  width: auto;
}
.el-dialog {
  background-color: initial;
  box-shadow: 0 0 0;
}
.el-dialog {
  margin: auto;
}
.el-dialog {
  top: 154px;
}
 .sortDialog ::v-deep .vxe-loading {
  position: fixed;
}
 .sortDialog ::v-deep .vxe-table .vxe-body--column.col--ellipsis>.vxe-cell {
  max-height: none;
}
 .sortDialog ::v-deep .vxe-table div.vxe-table--border-line {
  z-index: 0;
}
 .sortDialog ::v-deep .vxe-table--empty-placeholder {
  color: #909399;
}
 .sortDialog ::v-deep thead .vxe-header--row .vxe-header--gutter {}
 .sortDialog {
  top: 58px;
  left: 20px;
  display: block;
  width: calc(100% - 20px - 20px);
  right: 20px;
  position: absolute;
  height: 397px;
}
.participantDialogVisible #body,
.participantDialogVisible #footer {
  width: 100%;
}
.participantDialogVisible #body {
  height: calc(100% - 47px);
}
.participantDialogVisible .el-dialog {
  width: 600px;
  height: 85%;
  max-height: 85%;
}
.participantDialogVisible .el-dialog__body {
  width: 100%;
  height: calc(100% - 47px);
  padding: 0;
}
.participantDialogVisible .el-aside {
  color: #333;
  text-align: center;
  margin: 10px 5px 10px 10px;
  border: solid 1px rgb(226, 226, 226);
}

.participantDialogVisible .el-main {
  color: #333;
  text-align: center;
  margin: 10px 10px 10px 5px;
  border: solid 1px rgb(226, 226, 226);
}

.participantDialogVisible .el-main .el-table {
  width: 100%;
}
.participantDialogVisible .el-main > .el-input {
  width: 200px;
  height: 34px;
  float: left;
  margin-bottom: 10px;
  margin-right: 0;
}
.participantDialogVisible .el-container {
  height: 100%;
}
.participantDialogVisible .el-main .el-table {
  height: calc(100% - 37px);
}
.participantDialogVisible .el-dialog__footer {
  border-top: solid 1px rgb(226, 226, 226);
}
.participantDialogVisible .search_button {
  float: left;
  margin-left: 10px;
  color: #ffffff;
  background: #045340;
}
.participantDialogVisible .comfirm_button {
  float: right;
  color: #ffffff;
  background: #045340;
}
.participantDialogVisible .lcdp-table .el-table__body tr.current-row > td {
  border-top: 1px solid #ebeef5 !important;
  border-bottom: 1px solid #ebeef5 !important;
}
</style>
