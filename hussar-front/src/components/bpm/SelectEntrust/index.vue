<!--对应事件【任务转办】，勾选【指定转办人】配置项-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择转办人"
    :visible="selectEntrustShow"
    custom-class="workFlow-dialog"
    class="consignorDialogVisible lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    width="970px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="selectEntrust-content">
      <div class="content-right">
        <div class="cont-left">
          <div class="cont-tree">
            <!-- 搜索弹出框组件 -->
            <div class="cont-inp-box">
              <el-popover
                placement="bottom"
                width="258"
                popper-class="popCls"
                trigger="manual"
                v-model="visible"
              >
                <div slot="reference" style="position: relative">
                  <el-input
                    class="tree-inp jxd_ins_elInput default"
                    :class="{'no-bg': isbg}"
                    prefix-icon="el-icon-search"
                    :placeholder="inputSelect === '' ? '按Enter键搜索' : ''"
                  />
                  <el-input
                    ref="popInp"
                    prefix-icon="el-icon-search"
                    @focus="inpFocus"
                    @blur="isbg = false"
                    v-model="inputSelect"
                    clearable
                    @keyup.enter.native="changeFilter"
                    class="tree-inp copy-inp jxd_ins_elInput default"
                  />
                </div>
                <div class="pop-box" v-clickoutside="closePop" @scroll.passive="handleScroll" ref="popBox">
                  <div v-for="(group, index) in options" :key="index" class="fixed-item">
                    <div class="div-label fixed-title">
                      <span>{{ group.label }}</span>
                      <span
                        class="label-btn"
                        @click="getNewData(group)"
                        v-if="group.options.length > 5"
                      >{{ group.currentLength >= group.options.length ? "收起" : "更多" }}</span>
                    </div>
                    <div v-if="group.show">
                      <div v-for="item in group.options" :key="item.id">
                        <div
                          class="div-label div-pop"
                          @click="changeInput(item)"
                        >
                          <span
                            v-for="(it, ind) in item.label"
                            :key="'span' + ind"
                            :style="{color: inputSelect.indexOf(it) > -1 ? 'var(--c-themeColor)' : ''}"
                          >{{ it }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="max-height">
                      <div
                        v-for="item in group.options.slice(0, group.currentLength)"
                        :key="item.id"
                      >
                        <div
                          class="div-label div-pop"
                          @click="changeInput(item)"
                        >
                          <span
                            v-for="(it, ind) in item.label"
                            :key="'span' + ind"
                            :style="{color: inputSelect.indexOf(it) > -1 ? 'var(--c-themeColor)' : ''}"
                          >{{ it }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
            <!-- 搜索查询-组织机构树 -->
            <div class="cont-tree-box" v-if="treeData.length">
              <VueEasyTree
                ref="tree-normal"
                @node-click="handleNodeClick"
                :data="treeData"
                :indent="8"
                :item-size="36"
                class="roleTree lcdp-tree work-tree work-tree1 vue-easy-tree"
                :props="props"
                :default-expand-all="true"
                node-key="id"
                :render-content="renderContent"
                :highlight-current="true"
              />
            </div>
            <!-- 懒加载-组织机构树 -->
            <div class="cont-tree-box" v-else>
              <VueEasyTree
                ref="tree-lazy"
                :key="treeKey"
                @node-click="handleNodeClick"
                :indent="8"
                :item-size="36"
                class="roleTree lcdp-tree work-tree work-tree2 vue-easy-tree"
                :props="props"
                node-key="id"
                :load="loadNode"
                :render-content="renderContent"
                :highlight-current="true"
                lazy
              />
            </div>
          </div>
          <!-- 表格及分页 -->
          <div class="cont-table">
            <!-- 表格组件 -->
            <div class="table-tit">
              {{ tableList.length && JSON.stringify(tableItem) !== "{}" ? tableList[0].parentName : "" }}
              <span v-if="tableList.length && JSON.stringify(tableItem) !== '{}'">（{{ totalCount }}）</span>
            </div>
            <div class="table_box jxd_ins_elTable default">
              <el-table
                ref="multipleTable"
                :data="tableList"
                :row-key="getRowKey"
                v-loading="tableLoading"
                highlight-current-row
                height="100%"
                @current-change="tableChange"
                tooltip-effect="dark"
                style="width: 100%"
                class="lcdp-table workflow-table"
              >
                <el-table-column label=" " width="30">
                  <template slot-scope="scope">
                    <el-radio
                      v-model="selection"
                      :label="scope.row"
                    ><i /></el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="label" label="用户名称" />
                <el-table-column prop="parentName" label="部门" />
              </el-table>
            </div>
            <!-- 分页组件 -->
            <div class="page-box">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                @size-change="handleSizeChange"
                :page-size="PageSize"
                :page-sizes="pageSizes"
                :total="totalCount"
                :pager-count="5"
                layout="total, sizes, prev, pager, next"
              />
            </div>
          </div>
        </div>
        <!-- 最右侧已选列表 -->
        <div class="cont-right">
          <div class="list-tit">
            已选
            <img src="@/assets/icon/clear.png" @click="delAllSelection">
          </div>
          <ul class="node-ul">
            <li v-for="(item, index) in selectList" :key="index">
              <div class="item-name">{{ item.label }}</div>
              <i class="el-icon-delete" @click="delSelection(item, index)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 弹窗底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button class="dialog-cancel jxd_ins_elButton default lay-btn button_additional" @click="cancelSelect">{{
        $t("common.cancel")
      }}</el-button>
      <el-button class="dialog-save jxd_ins_elButton default lay-btn button_additional" type="primary" @click="confirmSelect">{{
        $t("common.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarAxiosRequestUtils, hussarRequest } from 'hussar-base';
import { workFlowApi } from '@/api/flow/workFlowApi';
import * as HussarRouter from '@/utils/HussarRouter';
import VueEasyTree from '@wchbrad/vue-easy-tree';
// 样式文件，可以根据需要自定义样式或主题
import '@wchbrad/vue-easy-tree/src/assets/index.scss';

export default {
  name: 'SelectEntrust',
  props: {
    selectEntrustShow: Boolean
  },
  components: {
    VueEasyTree
  },
  data() {
    return {
      // 表格加载层
      tableLoading: true,
      // 搜索内容
      searchContent: '',
      // 页码数
      PageCount: 5,
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 15, 20, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 选项
      selection: {},
      // 当前页结果
      filterData: [],
      // 组织机构树
      treeData: [],
      treeKey: new Date() + 'tree',
      // 人员树配置
      props: {
        id: 'id',
        label: 'label',
        children: 'childrenList',
        isLeaf: 'isLeaf'
      },
      tableList: [],
      // 表格搜索条件
      tableItem: {},
      // 已选列表
      selectList: [],
      // 表格数据条数
      totalCount: 0,
      // 搜索弹出框组件显示
      visible: false,
      // 搜索输入内容
      inputSelect: '',
      // 人员树过滤关键字
      filterText: '',
      // 模糊查询数据
      options: [],
      isbg: false,
      scrollT: 0
    };
  },
  methods: {
    // 行数据的 Key
    getRowKey(row) {
      return row.consignorId;
    },
    // 点击取消关闭页面
    cancelSelect() {
      this.$emit('close');
      this.$nextTick(() => {
        this.treeData = [];
        this.currentPage = 1;
        this.tableList = [];
        this.options = [];
        this.visible = false;
        this.filterText = '';
        this.inputSelect = '';
        this.selectList = [];
        this.selection = {};
      });
    },
    // 点击确定
    confirmSelect() {
      if (this.selectList.length === 0) {
        HussarRouter.showMsg(this, '请选择转办人', 'warning');
      } else {
        const sel = this.selectList[0];
        const selectValue = sel.id;
        const names = sel.label;
        this.$emit('save', {
          consignors: selectValue,
          consignorNames: names,
          tableSelects: sel
        });
      }
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.currentPage = 1;
      this.getTableList();
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      this.getTableList();
    },
    // 关闭弹窗底部按钮
    handleClose() {
      this.$emit('close');
      this.$nextTick(() => {
        this.treeData = [];
        this.currentPage = 1;
        this.tableList = [];
        this.options = [];
        this.visible = false;
        this.filterText = '';
        this.inputSelect = '';
        this.selectList = [];
        this.selection = {};
      });
    },
    // 懒加载树
    loadNode(node, resolve) {
      let id = '11';
      if (node.level !== 0) {
        id = node.data.id;
      }
      const data = { id: id };
      hussarRequest
        .get(workFlowApi.dept, data)
        .then((res) => {
          if (res.code === 10000) {
            return resolve(res.data);
          } else {
            HussarRouter.showMsg(this, '获取人员树异常', 'error');
          }
        })
        .catch((e) => {
          HussarRouter.showMsg(this, '获取人员树异常', 'error');
        });
    },
    // 渲染树节点
    renderContent(h, { node }) {
      let iconType = '';
      if (node.level === 1) {
        iconType = 'tree-com';
      } else if (node.level === 2) {
        iconType = 'tree-department';
      } else {
        iconType = 'unit';
      }
      return (
        <div class='tree-div'>
          <span class='staff-tree'>
            <span className='svg-icon'>
              <svg-icon icon-class={iconType} />
            </span>
            {node.label}
          </span>
        </div>
      );
    },
    // 树节点点击
    handleNodeClick(item) {
      this.tableItem = item;
      this.getTableList(item);
    },
    // 清空已选
    delAllSelection() {
      this.$refs.multipleTable.setCurrentRow();
      this.selectList = [];
      this.selection = {};
    },
    // 删除已选
    delSelection() {
      this.delAllSelection();
    },
    // 搜索框获取焦点
    inpFocus() {
      this.isbg = true;
      if (this.options.length) {
        this.visible = true;
      }
    },
    // 搜索回车
    changeFilter() {
      this.enterMethod(this.inputSelect);
    },
    // 关闭搜索弹窗
    closePop() {
      if (!this.$refs.popInp.focused) {
        this.visible = false;
      }
    },
    // 模糊查询树的下拉
    enterMethod(query) {
      this.visible = false;
      if (query !== '') {
        this.loading = true;
        hussarRequest
          .get(workFlowApi.queryUserTree, {
            organName: query
          })
          .then((res) => {
            if (res.code === 10000) {
              this.options = [];
              this.loading = false;
              const user = [];
              const organ = [];
              res.data.forEach((item) => {
                if (item.type === 'user') {
                  user.push(item);
                } else {
                  organ.push(item);
                }
              });
              this.options.push({
                label: `员工（${user.length}）`,
                options: [...user],
                show: false,
                currentLength: 5
              });
              this.options.push({
                label: `部门（${organ.length}）`,
                options: [...organ],
                show: false,
                currentLength: 5
              });
              this.visible = true;
            } else {
              HussarRouter.showMsg(this, '获取人员树异常', 'error');
            }
          })
          .catch((e) => {
            HussarRouter.showMsg(this, '获取人员树异常', 'error');
          });
      } else {
        this.tableItem = {};
        this.getTableList();
      }
    },
    // 点击查询到的列表数据
    changeInput(item) {
      this.filterText = item;
      this.inputSelect = item.label;
      this.visible = false;
    },
    // 获取table数据
    getTableList(n = this.tableItem) {
      this.tableList = [];
      hussarRequest
        .get(workFlowApi.queryUserListByPage, {
          ...{ ...n, ...{ childrenList: [] }},
          size: this.PageSize,
          current: this.currentPage
        })
        .then((res) => {
          this.tableLoading = false;
          if (res.code === 10000) {
            this.tableList = [...res.data.records];
            this.totalCount = res.data.total;
          }
        });
    },
    // 切换单选
    tableChange(item) {
      this.selection = item;
    },
    getNewData(group) {
      if (group.currentLength < group.options.length) {
        group.currentLength += 20;
      } else {
        group.currentLength = 5;
      }
    },
    handleScroll() {
      if (this.$refs.popBox) {
        this.scrollT = this.$refs.popBox.scrollTop;
        const user = this.$refs.popBox.getElementsByClassName('fixed-title')[0];
        const organ = this.$refs.popBox.getElementsByClassName('fixed-title')[1];
        if (this.scrollT) {
          const dom = this.$refs.popBox.getElementsByClassName('max-height')[0];
          if (dom) {
            const currentHeight = dom.clientHeight;
            if (this.scrollT > currentHeight) {
              organ.classList.add('fixed-title-item');
              user.classList.remove('fixed-title-item');
            } else if (this.scrollT > 32) {
              user.classList.add('fixed-title-item');
              organ.classList.remove('fixed-title-item');
            } else {
              user.classList.remove('fixed-title-item');
              organ.classList.remove('fixed-title-item');
            }
          }
        } else if (this.scrollT === 0) {
          user.classList.remove('fixed-title-item');
          organ.classList.remove('fixed-title-item');
        }
        console.log(this.scrollT, user.classList, organ.classList);
      }
    }
  },
  watch: {
    // 监听弹窗开启关闭
    selectEntrustShow: {
      handler(n) {
        if (n) {
          this.searchContent = '';
          this.selection = {};
          this.treeKey = new Date() + 'tree';
          this.visible = false;
          this.selection = {};
          this.tableItem = {};
          this.getTableList({});
        }
      },
      deep: true
    },
    // 过滤树节点
    filterText: {
      handler(n) {
        this.currentPage = 1;
        if (n === '') {
          this.visible = false;
          this.options = [];
          this.treeData = [];
          this.tableList = [];
          this.tableItem = {};
          this.getTableList();
        } else {
          // 选中的部门，表格显示部门内的人员，刷新树
          // 选中的人员，表格显示选中的人员，刷新树
          this.tableItem = n;
          this.getTableList(n);
          hussarRequest.get(workFlowApi.queryDeptTreeByChildren, { ...n }).then((res) => {
            if (res.code === 10000) {
              if (Object.keys(res.data).length !== 0) {
                this.treeData = [...res.data];
              }
            }
          });
        }
      },
      deep: true
    },
    // 监听模糊查询输入框内容
    inputSelect: {
      handler(n) {
        if (n === '') {
          this.filterText = '';
        }
      },
      deep: true
    },
    // 监听单选切换
    selection: {
      handler(n) {
        if (JSON.stringify(n) !== '{}' && n !== null) {
          this.selectList = [n];
        }
      },
      deep: true
    },
    // 监听table数据变化
    tableList: {
      handler(n) {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.setCurrentRow();
        }
        if (this.selectList.length) {
          const sel = this.selectList[0];
          n.forEach((item) => {
            if (item.id === sel.id) {
              this.$refs.multipleTable.setCurrentRow(item);
            }
          });
        }
      },
      deep: true
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/css/workFlow.scss";
.div-label {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  &.div-pop {
    cursor: pointer;
    &:hover {
      background: #DDE5E3;
      color: #045340;
    }
  }
}
::v-deep .workFlow-dialog {
  height: 544px;
  .el-table .el-table__row .cell {
    padding: 0 5px;
  }
  .el-dialog__body {
    padding: 15px 16px 0;
  }
  .selectEntrust-content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .content-right {
      @include myBorder;
      width: 100%;
      height: 100%;
      display: flex;
      .cont-left {
        width: calc(100% - 190px);
        height: 100%;
        display: flex;
        > div {
          height: 100%;
        }
        .cont-tree {
          width: 258px;
          margin-right: 8px;
          height: 100%;
          padding: 10px 0;
          box-sizing: border-box;
          .cont-inp-box {
            margin-bottom: 10px;
            padding-left: 16px;
            position: relative;
            .myPlace {
              position: absolute;
              top: 6px;
              right: 10px;
              font-size: 14px;
              color: #c0c4cc;
            }
          }
          .cont-tree-box {
            width: 100%;
            height: calc(100% - 86px);
            overflow: auto;
            .tree-div {
              width: calc(92.7% - 24px);
              .staff-tree {
                display: block;
                width: 100%;
                height: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
            }
          }
        }
        .cont-table {
          width: calc(100% - 266px);
          box-sizing: border-box;
          padding-right: 16px;
        }
        .table-tit {
          @include cardTit;
          margin: 9px 7px;
          span {
            color: #bcbdbf;
            font-weight: normal;
          }
        }
        .table_box {
          height: calc(100% - 106px);
        }
        .page-box {
          margin-right: 16px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
      .cont-right {
        width: 190px;
        height: 100%;
        border-left: 1px solid #e7e7e7;
        box-sizing: border-box;
        .list-tit {
          @include cardTit;
          display: flex;
          justify-content: space-between;
          i {
            cursor: pointer;
            &:hover {
              color: #045340;
            }
          }
          img {
            cursor: pointer;
            width: 16px;
            height: 16px;
          }
        }
        .node-ul {
          li {
            cursor: default;
            padding-right: 10px;
            i {
              display: none;
              cursor: pointer;
            }
            &:hover {
              i {
                display: block;
              }
              color: #4a4c66;
              .item-name {
                color: inherit;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped>
/* -------主题修改样式--------- */
/* 按钮 */
.lcdp_axe.theme-config-front ::v-deep .dialog-cancel {
  background-color: #ffffff;
  color: var(--c-themeColor);
  border: 1px solid var(--c-themeColor);
}
.lcdp_axe.theme-config-front /deep/ .dialog-cancel :hover{
  color: #fff;
}
/* 输入框 */
.lcdp_axe.theme-config-front ::v-deep .el-input__inner:hover {
  border-color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front ::v-deep .tree-inp.jxd_ins_elInput.default.el-input.el-input--prefix {
  width: 100%;
  height: 100%;
}
.lcdp_axe.theme-config-front ::v-deep .el-input__inner {
  background: none !important;
}
/* 分页 */
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover{
  color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  color: #FFFFFF;
  background-color: var(--c-themeColor);
}
/* 输入框 */
.lcdp_axe.theme-config-front ::v-deep .el-input__inner:hover {
  border-color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front ::v-deep .tree-inp.jxd_ins_elInput.default.el-input.el-input--prefix, .tree-inp.copy-inp.jxd_ins_elSelect.default.el-input.el-input--prefix.el-input--suffix {
  width: 100%;
  height: 100%;
}
.lcdp_axe.theme-config-front ::v-deep .el-input__inner {
  background: none !important;
}
.lcdp_axe.theme-config-front ::v-deep .tree-inp .el-input__inner::placeholder {
  text-align: right;
}
.lcdp_axe.theme-config-front ::v-deep .tree-inp.copy-inp .el-input__inner::placeholder {
  text-align: left;
}
/* 查询下拉样式 */
.div-label.div-pop:hover {
  color: var(--c-themeColor);
  background-color: var(--c-lineAreaColor);
}
/* 树选择 */
.lcdp_axe.theme-config-front ::v-deep .work-tree .el-tree-node.is-current > .el-tree-node__content {
  color: var(--c-themeColor) !important;
  background: var(--c-lightColor) !important;
}
.lcdp_axe.theme-config-front ::v-deep .lcdp-tree .el-tree-node__content:hover {
  background: var(--c-lightColor) !important;
}
/* 表格 */
.lcdp_axe.theme-config-front ::v-deep .table_box.jxd_ins_elTable.default {
  border: none;
  width: auto;
}
.lcdp_axe.theme-config-front ::v-deep .lcdp-table .el-radio__input.is-checked .el-radio__inner  {
  border-color: var(--c-themeColor) !important;
}
.lcdp_axe.theme-config-front ::v-deep .lcdp-table .el-radio__input.is-checked .el-radio__inner::after {
  background-color: var(--c-themeColor) !important;
}
.lcdp_axe.theme-config-front ::v-deep  .lcdp-table .el-radio__inner:hover {
  border-color: var(--c-themeColor) !important;
}
.workFlow-dialog .node-ul li i:hover {
  color: var(--c-themeColor);
}
.workFlow-dialog .node-ul li:hover {
  background-color: var(--c-lightColor);
}
.lcdp_axe.theme-config-front .content-right .cont-inp-box ::v-deep .el-input input {
  padding-right: 30px;
}
.lcdp_axe.theme-config-front .page-box ::v-deep .el-pagination .el-input__inner {
  width: 100%;
}
.lcdp_axe.theme-config-front .page-box ::v-deep .el-pagination button {
  padding-top: 0px;
}

.fixed-title-item {
  position: absolute;
  top: 0;
  background-color: white;
  width: calc(100% - 16px);
}
</style>
