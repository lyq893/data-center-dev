<!--对应页面【选择参与者】组件，组件-基础-流程-选择参与者-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择参与者"
    :visible="participantDialogVisible"
    custom-class="workFlow-dialog"
    class="participantDialogVisible lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    width="970px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="Participant-content">
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
                    class="tree-inp copy-inp jxd_ins_elSelect default"
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
              <el-tooltip class="item" v-if="tableList.length && JSON.stringify(tableItem) !== '{}'" effect="dark" :content="tableList.length && JSON.stringify(tableItem) !== '{}' ? tableList[0].parentName : ''" placement="top-start">
                <p>{{ tableList.length && JSON.stringify(tableItem) !== "{}" ? tableList[0].parentName : "" }}</p>
              </el-tooltip>
              <span
                v-if="tableList.length && JSON.stringify(tableItem) !== '{}'"
              >（{{ totalCount }}）</span>
            </div>
            <div class="table_box jxd_ins_elTable default">
              <el-table
                ref="multipleTable"
                :data="tableList"
                v-loading="tableLoading"
                highlight-current-row
                height="100%"
                tooltip-effect="dark"
                style="width: 100%"
                class="lcdp-table workflow-table"
                @selection-change="handleSelectionChange"
                @select="handleSelect"
                @select-all="selectAll"
              >
                <el-table-column
                  type="selection"
                  width="35"
                />
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
                :pager-count="PageCount"
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
          <ul class="node-ul ul-scroll">
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
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">{{
        $t("common.cancel")
      }}</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="confirmSelect">{{
        $t("common.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarRequest } from 'hussar-base';
import { workFlowApi } from '@/api/flow/workFlowApi';
import * as HussarRouter from '@/utils/HussarRouter';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import VueEasyTree from '@wchbrad/vue-easy-tree';
// 样式文件，可以根据需要自定义样式或主题
import '@wchbrad/vue-easy-tree/src/assets/index.scss';

export default {
  name: 'ParticipantDialog',
  props: {
    // 对话框是否显示
    participantDialogVisible: Boolean,
    taskId: String,
    nodeId: String,
    processDefinitionKey: String,
    // 外部传入的tableData数据，在这里需要进一步处理
    tableData: Array,
    // 已选列表数据备份
    selectionBackup: Array
  },
  components: {
    VueEasyTree
  },
  data() {
    return {
      // 表格加载层
      tableLoading: true,
      searchContent: '',
      // 搜索结果
      searchResult: [],
      // 页码数
      PageCount: 5,
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 15, 20, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 搜索弹出框组件显示
      visible: false,
      // 多选选项
      multipleSelection: [],
      // 当前页结果
      filterData: [],
      // 人员树过滤关键字
      filterText: '',
      // 搜索输入内容
      inputSelect: '',
      // 模糊查询数据
      options: [],
      loading: false,
      // 组织机构树
      treeData: [],
      // 懒加载树key
      treeKey: new Date() + 'tree',
      // 人员树配置
      props: {
        id: 'id',
        label: 'label',
        children: 'childrenList',
        isLeaf: 'isLeaf'
      },
      // 表格数据
      tableList: [],
      // 表格搜索条件
      tableItem: {},
      // 已选列表
      selectList: [],
      // 表格数据条数
      totalCount: 0,
      isbg: false,
      //  perfectScrollbar实例
      ulScroll: undefined,
      scrollT: 0
    };
  },
  methods: {
    // // 行数据的 Key
    // getRowKey(row) {
    //   return row.participantId;
    // },
    // 确认保存
    confirmSelect() {
      const selectValue = [];
      const names = [];
      this.selectList.forEach((element) => {
        selectValue.push(element.id);
        names.push(element.label);
      });
      // 将所需数据传递给父级页面
      this.$emit('comfirm', {
        participants: selectValue.join(','),
        participantNames: names.join(','),
        tableSelects: this.multipleSelection
      });
      this.$emit('close');
    },
    // 搜索框获取焦点
    inpFocus() {
      this.isbg = true;
      if (this.options.length) {
        this.visible = true;
      }
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.PageSize = val;
      this.currentPage = 1;
      this.getTableList();
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      // this.tableDataReset();
      this.getTableList();
    },
    // 关闭当前弹窗
    handleClose() {
      this.$emit('close');
      this.$nextTick(() => {
        // 清空相关的数据
        this.$refs.multipleTable.clearSelection();
        this.filterText = '';
        this.treeData = [];
        this.currentPage = 1;
        this.tableList = [];
        this.options = [];
        this.visible = false;
        this.inputSelect = '';
        if (this.ulScroll !== null) {
          this.ulScroll.destroy();
          this.ulScroll = null;
        }
      });
    },
    // table多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格多选切换
    handleSelect(selection, row) {
      // 相当于取消选中
      if (selection.indexOf(row) < 0) {
        const index = this.selectList.findIndex((it) => it.id === row.id);
        this.selectList.splice(index, 1);
      }
    },
    // table点击全选复选框
    selectAll(val) {
      if (val.length === 0) {
        this.selectList = [];
      }
    },
    // 根据分页或者搜索刷新table数据
    tableDataReset() {
      this.tableLoading = true;
      var input = this.searchContent && this.searchContent.toLowerCase();
      var items = this.tableData;
      var items1;
      if (input) {
        items1 = items.filter(function(item) {
          return Object.keys(item).some(function(key1) {
            return String(item[key1]).toLowerCase().match(input);
          });
        });
      } else {
        items1 = items;
      }
      items1.forEach((element, index) => {
        element.index = index + 1;
      });
      this.searchResult = items1;
      // 将处理好的数据传递
      this.filterData = this.searchResult.slice(
        (this.currentPage - 1) * this.PageSize,
        this.currentPage * this.PageSize
      );
      this.tableLoading = false;
    },
    // 重置选择
    resetSelect() {
      if (this.$refs.multipleTable) {
        this.tableData.forEach((elem) => {
          this.$refs.multipleTable.toggleRowSelection(elem, false);
          this.selectionBackup.forEach((elem1) => {
            if (elem1.participantId === elem.participantId) {
              this.$refs.multipleTable.toggleRowSelection(elem, true);
            }
          });
        });
      }
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
        // 发送请求
        hussarRequest
          .get(workFlowApi.queryNodeAssigneeAndDept, {
            processKey: this.processDefinitionKey,
            nodeId: this.nodeId,
            organName: query,
            taskId: this.taskId
          })
          .then((res) => {
            if (res.code === 10000) {
              this.options = [];
              this.loading = false;
              const user = [];
              const organ = [];
              // 将返回的数据进行分类，再分别进行渲染处理
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
          .catch(() => {
            HussarRouter.showMsg(this, '获取人员树异常', 'error');
          });
      } else {
        // 清空搜索数据，重新查询列表
        this.tableItem = {};
        this.getTableList();
      }
    },
    // 搜索回车
    changeFilter() {
      this.enterMethod(this.inputSelect);
    },
    // 点击查询到的列表数据
    changeInput(item) {
      this.filterText = item;
      this.inputSelect = item.label;
      this.visible = false;
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
        .catch(() => {
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
    // 获取table数据
    getTableList(n = this.tableItem) {
      this.tableList = [];
      hussarRequest
        .get(workFlowApi.queryNodeAssigneeListByPage, {
          ...{ ...n, ...{ childrenList: [] }},
          size: this.PageSize,
          current: this.currentPage,
          processKey: this.processDefinitionKey,
          nodeId: this.nodeId,
          taskId: this.taskId
        })
        .then((res) => {
          this.tableLoading = false;
          if (res.code === 10000) {
            this.tableList = [...res.data.records];
            this.totalCount = res.data.total;
          }
        });
    },
    // 清空已选
    delAllSelection() {
      this.$refs.multipleTable.clearSelection();
      this.selectList = [];
    },
    // 删除已选
    delSelection(item, index) {
      this.multipleSelection.findIndex((it) => {
        const findIndex = it.id === item.id;
        if (findIndex) {
          this.$refs.multipleTable.toggleRowSelection(it, false);
        }
      });
      this.selectList.splice(index, 1);
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
          console.log(dom);
          console.log(this.scrollT);
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
      }
    }
  },
  watch: {
    // 监听弹窗开启关闭
    participantDialogVisible: {
      handler(n) {
        // 开启弹窗清空之前残留的数据
        if (n) {
          this.searchContent = '';
          this.tableDataReset();
          this.resetSelect();
          this.treeKey = new Date() + 'tree';
          if (this.selectionBackup.length <= 0) {
            this.selectList = [];
          }
          this.tableItem = {};
          this.getTableList();
        }
      },
      deep: true
    },
    // 父组件传参
    selectionBackup() {
      // 该属性没有值或者是空数组的话，就会清空表格
      if (
        (!this.selectionBackup || this.selectionBackup.length === 0) &&
        this.$refs.multipleTable
      ) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 监听模糊查询输入框内容
    inputSelect: {
      handler(n) {
        // 清空输入框内容，隐藏搜索弹出框组件
        if (n === '') {
          this.filterText = '';
          this.visible = false;
        }
      },
      deep: true
    },
    // 过滤树节点
    filterText: {
      handler(n) {
        this.currentPage = 1;
        // 清空后重新获取数据
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
    // 监听table数据变化
    tableList: {
      handler(n) {
        if (n.length) {
          const self = this;
          this.$nextTick(() => {
            // 清空多选表格选择项
            self.$refs.multipleTable.clearSelection();
            self.selectList.forEach((item) => {
              n.findIndex((it) => {
                const index = it.id === item.id;
                // 如果选中列表的数据项在表格中存在，则将其勾选
                if (index) {
                  self.$refs.multipleTable.toggleRowSelection(it, true);
                }
              });
            });
          });
        }
      },
      deep: true
    },
    // 监听被选中表格数据
    multipleSelection: {
      deep: true,
      handler(n) {
        n.forEach((item) => {
          const index = this.selectList.findIndex((it) => it.id === item.id);
          // 防止传入给已选列表出现重复数据项的情况
          if (index < 0) {
            this.selectList.push(item);
          }
        });
      }
    },
    // 监听已选列表，发生变化就渲染新的滚动条
    selectList: {
      handler() {
        this.$nextTick(() => {
          this.ulScroll = new PerfectScrollbar('.ul-scroll', {});
        });
      },
      deep: true
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/css/workFlow.scss";
::v-deep .workFlow-dialog {
  height: 544px;
  .el-table-column--selection .cell {
    padding: 0 10px;
  }
  .el-dialog__body {
    padding: 15px 16px 0;
  }
  .Participant-content {
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
          p {
            height: 20px;
            width: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          span {
            color: #BCBDBF;
            font-weight: normal;
            display: inline-block;
            white-space: nowrap;
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
          padding-right: 16px;
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
          position: relative;
          li {
            cursor: default;
            padding-right: 17px;
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
.jxd_additional.lcdp_axe .jxd_ins_elButton.default:hover:not(.is-disabled){
  color:  #FFF !important;
}
.lcdp_axe.theme-config-front ::v-deep .dialog-cancel {
  background-color: #ffffff;
  color: var(--c-themeColor);
  border: 1px solid var(--c-themeColor);
}
.lcdp_axe.theme-config-front /deep/ .dialog-cancel :hover{
  color: #fff;
}
/* 分页 */
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover{
  color: var(--c-themeColor);::v-deep
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
.lcdp_axe.theme-config-front ::v-deep .lcdp-table .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: var(--c-themeColor) !important;
  background-color: var(--c-themeColor) !important;
}
.lcdp_axe.theme-config-front ::v-deep  .lcdp-table .el-checkbox__input .el-checkbox__inner:hover {
  border-color: var(--c-themeColor) !important;
}
.lcdp-table ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: var(--c-themeColor)!important;
  border: var(--c-themeColor)!important;
}
.lcdp_axe.theme-config-front .cont-inp-box ::v-deep .el-input input {
  padding-right: 30px;
}
.lcdp_axe.theme-config-front .page-box ::v-deep .el-pagination .el-input__inner {
  width: 100%;
}
.lcdp_axe.theme-config-front .page-box ::v-deep .el-pagination .btn-prev, .lcdp_axe.theme-config-front .page-box ::v-deep .el-pagination .btn-next {
  padding-top: 0;
}

.fixed-title-item {
  position: absolute;
  top: 0;
  background-color: white;
  width: calc(100% - 16px);
}
</style>
