<!--对应事件【提交流程表单】，勾选【指定参与者】配置项，beta6之前使用此组件-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择参与者"
    :visible="selectParticipantShow"
    custom-class="workFlow-dialog"
    class="selectParticipantDialogVisible lcdp-dialog"
    width="970px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="selectParticipant-content">
      <!-- 左侧选择节点列表 -->
      <div class="content-left">
        <div class="node-tit">选择节点</div>
        <ul class="node-ul">
          <li
            v-for="(item, index) in nextNodeOptions"
            :key="index"
            @click="clickNodeList(item)"
            :class="{actLi: item.value === nextNodeValue}"
          >
            <div class="item-name">{{ item.name }}</div>
          </li>
        </ul>
      </div>
      <!-- 右侧布局 -->
      <div class="content-right">
        <div class="cont-left">
          <div class="cont-tree">
            <!-- 搜索弹出框组件 -->
            <div class="cont-inp-box">
              <el-popover
                placement="bottom"
                width="200"
                popper-class="popCls"
                trigger="manual"
                v-model="visible"
              >
                <div slot="reference" style="position: relative">
                  <el-input
                    class="tree-inp"
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
                    class="tree-inp copy-inp"
                  />
                </div>
                <div class="pop-box" v-clickoutside="closePop">
                  <div
                    v-for="(group, index) in options"
                    :key="index"
                  >
                    <div class="div-label">
                      <span>{{ group.label }}</span>
                      <span
                        class="label-btn"
                        @click="group.show = !group.show"
                        v-if="group.options.length > 5"
                      >
                        {{ group.show ? '收起' : '更多' }}
                      </span>
                    </div>
                    <div v-if="group.show">
                      <div
                        v-for="item in group.options"
                        :key="item.id"
                      >
                        <div
                          class="div-label div-pop"
                          @click="changeInput(item)"
                        >
                          <span
                            v-for="(it, ind) in item.label"
                            :key="'span' + ind"
                            :style="{color: inputSelect.indexOf(it) > -1 ? '#045340' : ''}"
                          >{{ it }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div
                        v-for="item in group.options.slice(0, 5)"
                        :key="item.id"
                      >
                        <div
                          class="div-label div-pop"
                          @click="changeInput(item)"
                        >
                          <span
                            v-for="(it, ind) in item.label"
                            :key="'span' + ind"
                            :style="{color: inputSelect.indexOf(it) > -1 ? '#045340' : ''}"
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
              <el-tree
                ref="tree-normal"
                @node-click="handleNodeClick"
                :data="treeData"
                :indent="8"
                class="roleTree lcdp-tree work-tree work-tree1"
                :props="props"
                :default-expand-all="true"
                node-key="id"
                :render-content="renderContent"
                :highlight-current="true"
              />
            </div>
            <!-- 懒加载-组织机构树 -->
            <div class="cont-tree-box" v-else>
              <el-tree
                ref="tree-lazy"
                :key="treeKey"
                @node-click="handleNodeClick"
                :indent="8"
                class="roleTree lcdp-tree work-tree work-tree2"
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
            <div class="table_box">
              <el-table
                ref="multipleTable"
                :data="tableList"
                :row-key="getRowKey"
                v-loading="tableLoading"
                highlight-current-row
                height="100%"
                tooltip-effect="dark"
                style="width: 100%;"
                class="lcdp-table workflow-table"
                @selection-change="handleSelectionChange"
                @select="handleSelect"
                @select-all="selectAll"
              >
                <el-table-column
                  type="selection"
                  width="35"
                />
                <el-table-column
                  prop="label"
                  label="用户名称"
                />
                <el-table-column
                  prop="parentName"
                  label="部门"
                />
              </el-table>
            </div>
            <!-- 分页组件 -->
            <div class="page-box">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="PageSize"
                :total="totalCount"
                prev-text="上页"
                next-text="下页"
                layout="prev, pager, next, jumper"
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
      <el-button class="dialog-cancel" @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button class="dialog-save" type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarRequest } from 'hussar-base';
import { workFlowApi } from '@/api/flow/workFlowApi';
import * as HussarRouter from '@/utils/HussarRouter';

export default {
  name: 'SelectParticipant',
  props: {
    selectParticipantShow: Boolean,
    taskId: String,
    processDefinitionKey: String,
    doneListIdentification: String
  },
  data() {
    return {
      tableData: [],
      // 选择节点列表
      nextNodeOptions: [],
      // 选中节点
      nextNodeValue: '',
      nextNodeType: '',
      // 表格加载层
      tableLoading: false,
      searchContent: '',
      // 搜索结果
      searchResult: [],
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 15, 20, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 多选选项
      multipleSelection: [],
      // 当前页结果
      filterData: [],
      // 表格数据
      tableList: [],
      // 人员树过滤关键字
      filterText: '',
      // 搜索输入内容
      inputSelect: '',
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
      // 模糊查询树加载
      loading: false,
      // 模糊查询数据
      options: [],
      treeId: '11', // 默认为11
      treeNode: null,
      treeResolve: null,
      // 表格数据条数
      totalCount: 0,
      // 表格搜索条件
      tableItem: {},
      // 已选列表
      selectList: [],
      // 搜索弹出框组件显示
      visible: false,
      isbg: false
    };
  },
  methods: {
    // 关闭搜索弹窗
    closePop() {
      if (!this.$refs.popInp.focused) {
        this.visible = false;
      }
    },
    // 模糊查询树的下拉
    enterMethod(query) {
      this.visible = false;
      this.options = [];
      if (query !== '') {
        this.loading = true;
        hussarRequest.get(workFlowApi.queryNodeAssigneeAndDept, {
          processKey: this.processDefinitionKey,
          nodeId: this.nextNodeValue,
          organName: query,
          taskId: this.taskId
        }).then((res) => {
          if (res.code === 10000) {
            this.loading = false;
            const user = [];
            const organ = [];
            res.data.forEach(item => {
              if (item.type === 'user') {
                user.push(item);
              } else {
                organ.push(item);
              }
            });
            this.options.push({
              label: `员工（${user.length}）`,
              options: [...user],
              show: false
            });
            this.options.push({
              label: `部门（${organ.length}）`,
              options: [...organ],
              show: false
            });
            this.visible = true;
          } else {
            HussarRouter.showMsg(this, '获取人员树异常', 'error');
          }
        }).catch((e) => {
          HussarRouter.showMsg(this, '获取人员树异常', 'error');
        });
      } else {
        this.options = [];
      }
    },
    // 初始化
    nextNodeDataLoad() {
      const self = this;
      const taskId = this.taskId;
      const processDefinitionKey = this.processDefinitionKey;
      function queryNextNode(data) {
        return hussarRequest.get(workFlowApi.queryNextNode, data);
      }
      const data = {
        processDefinitionKey,
        taskId
      };
      if (processDefinitionKey || taskId) {
        queryNextNode(data).then(res => {
          if (res.code === '1') {
            const result = res.result;
            if (result instanceof Array && result.length > 0) {
              self.nextNodeType = result[0].type;
              self.nextNodeValue = result[0].id;
              self.nextNodeChange();
              // 查全部
              self.currentPage = 1;
              self.getTableList();
            }
            self.nextNodeOptions = [];
            result.forEach((val) => {
              self.nextNodeOptions.push({
                value: val.id,
                name: val.name,
                type: val.type
              });
            });
          } else {
            if (self.doneListIdentification === '0') {
              HussarRouter.showMsg(this, res.msg, 'error');
            }
          }
        }).catch(function() {
          HussarRouter.showMsg(this, '下一节点数据请求异常', 'error');
        });
      }
    },
    // 选择节点点击事件
    clickNodeList(item) {
      this.nextNodeValue = item.value;
      this.nextNodeChange();
      this.options = [];
      this.filterText = '';
      this.inputSelect = '';
      this.selectList = [];
    },
    // 节点切换
    nextNodeChange() {
      const self = this;
      const taskId = this.taskId;
      const processDefinitionKey = this.processDefinitionKey;
      const nodeId = this.nextNodeValue;
      this.nextNodeOptions.forEach((option) => {
        if (option.value === nodeId) {
          this.nextNodeType = option.type;
        }
      });
      function queryNextAssignee(data) {
        return hussarRequest.get(workFlowApi.queryNextAssigneeByTaskIdAndNodeId, data);
      }
      const data = {
        processDefinitionKey,
        taskId,
        nodeId
      };
      if ((processDefinitionKey || taskId) && nodeId) {
        queryNextAssignee(data).then(res => {
          if (res.code === '1') {
            const result = res.result;
            self.tableData = [];
            result.forEach((val, index) => {
              self.tableData.push({
                participantId: val.id,
                label: val.name,
                index: index + 1
              });
            });
            this.tableDataReset();
            this.currentPage = 1;
            this.getTableList();
          } else {
            HussarRouter.showMsg(this, res.msg, 'error');
          }
        }).catch(function() {
          HussarRouter.showMsg(this, '参与者数据请求异常', 'error');
        });
      }
    },
    // 行数据的 Key
    getRowKey(row) {
      return row.participantId;
    },
    // 切换页面
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      // this.tableDataReset();
      this.getTableList();
    },
    // 关闭当前弹窗
    handleClose() {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
        this.treeData = [];
        this.currentPage = 1;
        this.tableList = [];
        this.options = [];
        this.visible = false;
        this.filterText = '';
        this.inputSelect = '';
      });
      this.$emit('close');
    },
    // 保存
    handleSave() {
      const selectValue = [];
      const names = [];
      this.selectList.forEach(element => {
        selectValue.push(element.id);
        names.push(element.label);
      });
      if (this.nextNodeType === 'userTask' && selectValue.length === 0) {
        HussarRouter.showMsg(this, '未选择参与者', 'error');
        return;
      }
      this.$emit('save', {
        flowSelect: this.nextNodeValue,
        participants: selectValue.join(',')
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
        const index = this.selectList.findIndex(it => it.id === row.id);
        this.selectList.splice(index, 1);
      }
    },
    // table点击全选复选框
    selectAll(val) {
      if (val.length === 0) {
        this.selectList = [];
      }
    },
    // 清空已选
    delAllSelection() {
      this.$refs.multipleTable.clearSelection();
      this.selectList = [];
    },
    // 删除已选
    delSelection(item, index) {
      this.multipleSelection.findIndex(it => {
        const findIndex = it.id === item.id;
        if (findIndex) {
          this.$refs.multipleTable.toggleRowSelection(it, false);
        }
      });
      this.selectList.splice(index, 1);
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
            return String(item[key1])
              .toLowerCase()
              .match(input);
          });
        });
      } else {
        items1 = items;
      }
      items1.forEach((element, index) => {
        element.index = index + 1;
      });
      this.searchResult = items1;
      this.filterData = this.searchResult.slice((this.currentPage - 1) * this.PageSize, this.currentPage * this.PageSize);
      this.tableLoading = false;
    },
    // 懒加载树数据
    loadNode(node, resolve) {
      let id = '11';
      if (node.level !== 0) {
        id = node.data.id;
      }
      const data = { id: id };
      hussarRequest.get(workFlowApi.dept, data).then((res) => {
        if (res.code === 10000) {
          return resolve(res.data);
        } else {
          HussarRouter.showMsg(this, '获取人员树异常', 'error');
        }
      }).catch(() => {
        HussarRouter.showMsg(this, '获取人员树异常', 'error');
      });
    },
    // 树节点点击
    handleNodeClick(item) {
      this.tableItem = item;
      this.getTableList(item);
    },
    // 获取table数据
    getTableList(n = this.tableItem) {
      this.tableList = [];
      hussarRequest.get(workFlowApi.queryNodeAssigneeListByPage, {
        ...{ ...n, ...{ childrenList: [] }},
        size: this.PageSize,
        current: this.currentPage,
        processKey: this.processDefinitionKey,
        nodeId: this.nextNodeValue,
        taskId: this.taskId
      }).then(res => {
        this.tableLoading = false;
        if (res.code === 10000) {
          this.tableList = [...res.data.records];
          this.totalCount = res.data.total;
        }
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
            <span className='svg-icon'><svg-icon icon-class={iconType}/></span>
            {node.label}
          </span>
        </div>
      );
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
    // 搜索框获取焦点
    inpFocus() {
      this.isbg = true;
      if (this.options.length) {
        this.visible = true;
      }
    }
  },
  watch: {
    // 监听弹窗开启关闭
    selectParticipantShow: {
      handler(n) {
        if (n) {
          this.searchContent = '';
          this.nextNodeDataLoad();
          this.treeKey = new Date() + 'tree';
          // 清空已选
          this.selectList = [];
          this.visible = false;
          this.tableItem = {};
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
            self.$refs.multipleTable.clearSelection();
            self.selectList.forEach(item => {
              n.findIndex(it => {
                const index = it.id === item.id;
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
          hussarRequest.get(workFlowApi.queryDeptTreeByChildren, { ...n }).then(res => {
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
    // 监听被选中表格数据
    multipleSelection: {
      deep: true,
      handler(n) {
        n.forEach(item => {
          const index = this.selectList.findIndex(it => it.id === item.id);
          if (index < 0) {
            this.selectList.push(item);
          }
        });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .popCls {
    padding: 12px 0;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/assets/css/workFlow.scss';
  ::v-deep .workFlow-dialog {
    height: 544px;
    .el-table-column--selection .cell {
      padding: 0 10px;
    }
    .el-dialog__body {
      padding: 15px 16px 0;
    }
    .selectParticipant-content {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      .content-left {
        @include myBorder;
        width: 152px;
        height: 100%;
        margin-right: 16px;
        .node-tit {
          @include cardTit;
        }
        .node-ul {
          .item-name {
            width: 100% !important;
          }
        }
      }
      .content-right {
        @include myBorder;
        width: calc(100% - 168px);
        height: 100%;
        display: flex;
        .cont-left {
          width: calc(100% - 152px);
          height: 100%;
          display: flex;
          >div {
            height: 100%;
          }
          .cont-tree {
            width: 212px;
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
                color: #C0C4CC;
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
            width: calc(100% - 220px);
            box-sizing: border-box;
            padding-right: 16px;
          }
          .table-tit {
            @include cardTit;
            margin: 9px 7px;
            span {
              color: #BCBDBF;
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
          width: 152px;
          height: 100%;
          border-left: 1px solid #E7E7E7;
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
            li{
              cursor: default;
              i {
                display: none;
                cursor: pointer;
              }
              &:hover {
                i { display: block; }
                color: #4A4C66;
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
  ::v-deep .work-tree {
    .el-tree-node.is-current {
      >.el-tree-node__content {
        background: #DDE5E3 !important;
        color: #045340;
        border-radius: 0 18px 18px 0;
      }
    }
  }
</style>

