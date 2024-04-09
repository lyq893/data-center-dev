<!--对应事件【提交流程表单】，勾选【指定参与者】配置项，beta6开始使用此组件-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择参与者"
    :visible="selectParticipantShow"
    custom-class="workFlow-dialog"
    class="selectParticipantDialogVisible lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    width="1020px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="selectParticipant-content">
      <!-- 左侧选择节点列表 -->
      <div class="content-left">
        <template v-for="(item, index) in nextNodeOptions">
          <div :class="{notActBranch: index !== checkBranch,nodePart: index !== nextNodeOptions.length -1}" :key="index">
            <div class="node-tit" @click="clickBranch(index, true)" :class="{actBranch: index === checkBranch,notActBranch: index !== checkBranch}">分组{{ index + 1 }}</div>
            <ul class="node-ul">
              <el-checkbox-group @change="checkboxChange" v-model="checkList">
                <li v-for="(item1, index1) in item" @click="clickNodeList(item1, index)" :key="index1" :class="{actLi: item1.id + ',' + index === nextCheckNode}">
                  <div v-if="item1.mustCheck" class="item-name">
                    <span>{{ item1.name }}</span>
                  </div>
                  <el-checkbox :label="item1.id + ',' + index" v-else>
                    <div class="clickLabel" @click.prevent>{{ item1.name }}</div>
                  </el-checkbox>
                  <span class="item-name-icon" style="font-size: 14px;line-height: 19px;" v-if="item1.selectList && item1.selectList.length > 0"><img style="width:20px;height:20px" src="@/assets/submitUser/user.svg"></span>
                </li>
              </el-checkbox-group>
            </ul>
          </div>
        </template>
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
                  <div
                    v-for="(group, index) in options"
                    :key="index"
                    class="fixed-item"
                  >
                    <div class="div-label fixed-title">
                      <span>{{ group.label }}</span>
                      <span
                        class="label-btn"
                        @click="getNewData(group)"
                        v-if="group.options.length > 5"
                      >
                        {{ group.currentLength >= group.options.length ? "收起" : "更多" }}
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
                class="roleTree lcdp-tree work-tree work-tree1 assignee-tree vue-easy-tree"
                :props="props"
                :default-expand-all="true"
                node-key="id"
                :render-content="renderContent"
                :highlight-current="true"
                @node-collapse="handleNode"
                @node-expand="handleNode"
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
                class="roleTree lcdp-tree work-tree work-tree2 assignee-tree vue-easy-tree"
                :props="props"
                node-key="id"
                :load="loadNode"
                :render-content="renderContent"
                :highlight-current="true"
                lazy
                @node-collapse="handleNode"
                @node-expand="handleNode"
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
              <span v-if="tableList.length && JSON.stringify(tableItem) !== '{}'">（{{ totalCount }}）</span>
            </div>
            <div class="table_box jxd_ins_elTable default">
              <el-table
                ref="multipleTable"
                :data="tableList"
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
                  :selectable="selectable"
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
          <ul class="node-ul ul-scroll1">
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
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
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
  name: 'SelectParticipantNew',
  props: {
    selectParticipantShow: Boolean,
    isGetRevokeNode: Boolean,
    taskId: String,
    processDefinitionKey: String,
    doneListIdentification: String
  },
  components: {
    VueEasyTree
  },
  data() {
    return {
      tableData: [],
      // 选择节点列表
      nextNodeOptions: [],
      nextNodeValue: '',
      isMustCheck: false,
      nextCheckNode: '',
      checkList: [],
      checkOldList: [],
      checkBranch: 0,
      mustCheckGroups: [],
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
      isbg: false,
      //  perfectScrollbar实例
      perfectScrollbar: undefined,
      ulScroll: undefined,
      scrollT: 0
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
      if (!this.nextNodeValue) {
        HussarRouter.showMsg(this, '请先选择节点', 'warning');
        return;
      }
      if (query !== '') {
        this.loading = true;
        hussarRequest.get(workFlowApi.queryNodeAssigneeAndDept, {
          processKey: this.processDefinitionKey,
          nodeId: this.nextNodeValue,
          organName: query,
          taskId: this.taskId
        }).then((res) => {
          if (res.code === 10000) {
            this.options = [];
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
        }).catch(() => {
          HussarRouter.showMsg(this, '获取人员树异常', 'error');
        });
      } else {
        this.tableItem = {};
        this.getTableList();
      }
    },
    // 初始化
    nextNodeDataLoad() {
      const self = this;
      const taskId = this.taskId;
      const processDefinitionKey = this.processDefinitionKey;
      const isGetRevokeNode = this.isGetRevokeNode;
      function queryNextNode(data) {
        return hussarRequest.get(workFlowApi.queryNextUserTask, data);
      }
      const data = {
        processDefinitionKey,
        taskId,
        isGetRevokeNode
      };
      if (processDefinitionKey || taskId) {
        queryNextNode(data).then(res => {
          if (res.code === '1') {
            const result = res.result;
            if (result instanceof Array && result.length > 0 && result[0].data.length > 0 && result[0].data[0].length > 0) {
              self.nextNodeType = result[0].data[0][0].type;
              self.checkBranch = 0;
              self.nextNodeChange();
              // 查全部
              self.currentPage = 1;
            }
            // 查全部
            self.currentPage = 1;
            self.nextNodeOptions = [];
            self.nextNodeOptions = result[0].data;
            self.mustCheckGroups = result[0].mustCheckGroups;
          } else {
            if (self.doneListIdentification === '0' || res.code === 10001) {
              HussarRouter.showMsg(this, res.msg, 'error');
            }
          }
        }).catch(function() {
          HussarRouter.showMsg(this, '下一节点数据请求异常', 'error');
        });
      }
    },
    // 选择节点点击事件
    clickNodeList(item, index, isAutoShow) {
      const oldCheckList = [...this.checkList];
      this.checkBranch = index;
      this.nextNodeValue = item.id;
      this.isMustCheck = item.mustCheck;
      this.nextCheckNode = item.id + ',' + index;
      this.nextNodeChange();
      this.options = [];
      this.filterText = '';
      this.inputSelect = '';
      if (!isAutoShow) {
        this.$nextTick(() => {
          const index1 = this.checkList.findIndex((it) => it === this.nextCheckNode);
          if (index1 !== -1) {
            this.checkList.splice(index1, 1);
          } else {
            this.checkList.push(this.nextCheckNode);
          }
        });
      }
      this.selectList = item.selectList ? item.selectList : [];
      this.$nextTick(() => {
        this.checkList = [...oldCheckList];
      });
    },
    // 选择支点点击事件
    clickBranch(index, isBranch) {
      const branch = this.checkBranch;
      this.nextNodeOptions.forEach((item, branchIndex) => {
        if (branchIndex !== index) {
          item.forEach(element => {
            element.selectList = [];
          });
        }
      });
      this.nextCheckNode = index === this.checkBranch ? this.nextCheckNode : '';
      this.checkBranch = index;
      const list = [];
      if (this.checkList.length > 0) {
        this.checkList.forEach(item => {
          if (item.includes(',' + this.checkBranch)) {
            list.push(item);
          }
        });
        this.checkList = list;
      }
      // 清空已选
      if (isBranch && branch !== index) {
        this.tableList = [];
        this.nextNodeValue = '';
        this.checkList = [];
        this.selectList = [];
        this.tableItem = {};
      }
    },
    // 节点切换
    nextNodeChange() {
      const self = this;
      const taskId = this.taskId;
      this.tableItem = {};
      this.$nextTick(() => {
        if (this.$refs['tree-lazy']) {
          this.$refs['tree-lazy'].setCurrentKey(null);
        } else {
          this.$refs['tree-normal'].setCurrentKey(null);
        }
      });
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
      return row.id;
    },
    checkboxChange(val) {
      if (val.length > this.checkOldList.length) {
        const newVal = val[val.length - 1];
        const autoShowItem = {};
        this.nextNodeOptions[this.checkBranch].forEach(item => {
          if (newVal.includes(',' + this.checkBranch) && item.id + ',' + this.checkBranch === newVal) {
            this.clickNodeList(item, this.checkBranch, true);
            if (item.relatedNodes.length > 0) {
              item.relatedNodes.forEach(itemNodes => {
                this.nextNodeOptions[this.checkBranch].forEach(options => {
                  if (!options.mustCheck && itemNodes === options.id && !val.includes(options.id + ',' + this.checkBranch)) {
                    val.push(options.id + ',' + this.checkBranch);
                  }
                });
              });
            }
          }
        });
      } else if (val.length < this.checkOldList.length) {
        const delVal = this.compare(this.checkOldList, val).del[0].replace(',' + this.checkBranch, '');
        this.nextNodeOptions[this.checkBranch].forEach(item => {
          if (item.relatedNodes.length > 0 && item.relatedNodes.includes(delVal)) {
            const index = val.findIndex(it => it === item.id + ',' + this.checkBranch);
            if (index !== -1) {
              val.splice(index, 1);
            }
          }
        });
      }
      this.checkOldList = val;
    },
    compare(beforeArr, afterArr) {
      const resObj = {
        add: [],
        del: []
      };
      const cenObj = {};
      // 把beforeArr数组去重放入cenObj
      for (let i = 0; i < beforeArr.length; i++) {
        cenObj[beforeArr[i]] = beforeArr[i];
      }
      // 遍历afterArr，查看其元素是否在cenObj中
      for (let j = 0; j < afterArr.length; j++) {
        if (!cenObj[afterArr[j]]) {
          resObj.add.push(afterArr[j]);
        } else {
          delete cenObj[afterArr[j]];
        }
      }
      let k1;
      for (k1 in cenObj) {
        resObj.del.push(k1);
      }
      return resObj;
    },
    handleSizeChange(val) {
      this.PageSize = val;
      this.currentPage = 1;
      this.getTableList();
    },
    // 切换页面
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      // this.tableDataReset();
      this.getTableList();
    },
    // 是否可选
    selectable() {
      if (this.checkList.includes(this.nextCheckNode) || this.isMustCheck) {
        return true;
      } else {
        return false;
      }
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
        this.checkOldList = [];
        this.filterText = '';
        this.inputSelect = '';
        if (this.perfectScrollbar !== null) {
          this.perfectScrollbar.destroy();
          this.perfectScrollbar = null;
        }
        if (this.ulScroll !== null) {
          this.ulScroll.destroy();
          this.ulScroll = null;
        }
      });
      this.$emit('close');
    },
    // 保存
    handleSave() {
      const names = [];
      const selectBranch = []; // 选中支点的id数组
      const selectValue = []; // 选中节点的id数组
      if (this.nextNodeOptions[this.checkBranch]) {
        this.nextNodeOptions[this.checkBranch].forEach(item => {
          selectBranch.push(item.id);
        });
      }
      const check = this.checkList.filter(item => {
        return item.includes(',' + this.checkBranch);
      });
      const check1 = check.map(item => {
        return item.replace(',' + this.checkBranch, '');
      });
      let select = [];
      if (this.nextNodeOptions.length > 0) {
        select = this.nextNodeOptions[this.checkBranch].filter(item => {
          let isSelect = false;
          isSelect = item.mustCheck || check1.includes(item.id);
          return isSelect;
        });
      }
      select.forEach(item => {
        selectValue.push(item.id);
      });
      // 校验方法
      if (select.length === 0) {
        HussarRouter.showMsg(this, '未选择节点', 'error');
        return;
      }
      // 校验必选节点组
      const isCheckMustGroup = this.checkMustGroup(select, selectBranch);
      if (isCheckMustGroup.isCheck) {
        HussarRouter.showMsg(this, '必选节点组' + isCheckMustGroup.notCheckGroup + '没有选上的', 'error');
        return;
      }
      // 校验相关节点
      const isCheckNodes = this.checkNodes(select, selectBranch, selectValue);
      if (!isCheckNodes.isCheck) {
        HussarRouter.showMsg(this, isCheckNodes.notCheckName + '节点的相关节点' + isCheckNodes.notCheckNodesName + '没有选上的', 'error');
        return;
      }
      // 校验相关节点组
      const isCheckNodesGroup = this.checkNodesGroup(select, selectBranch, selectValue);
      if (isCheckNodesGroup.isCheckGroup) {
        HussarRouter.showMsg(this, isCheckNodesGroup.notCheckNameGroup + '节点的相关节点组' + isCheckNodesGroup.notCheckNodesNameGroup + '必须要选上一个', 'error');
        return;
      }
      // 传出去的数组
      const selectBranchs = [];
      select.forEach(item => {
        const selectValue = [];
        if (item.selectList != null && item.selectList.length > 0) {
          item.selectList.forEach(element => {
            selectValue.push(element.id);
          });
        }
        selectBranchs.push({
          flowSelect: item.id,
          participants: selectValue.join(',')
        });
      });
      this.$emit('save', selectBranchs);
    },
    // 校验必选节点组
    checkMustGroup(select, selectBranch) {
      const selectCheckGroups = [];// 当前选中支点的必选节点组
      let notCheckGroup = [];
      const notCheckNodesName = [];
      let isCheck = false;
      this.mustCheckGroups.forEach(element => {
        const checkNode = [];
        element.forEach(item => {
          selectBranch.forEach(item1 => {
            if (item1 === item) {
              checkNode.push(item);
            }
          });
        });
        if (checkNode.length > 0) {
          selectCheckGroups.push(checkNode);
        }
      });
      const selectedValue = [];
      select.forEach(element => {
        selectedValue.push(element.id);
      });
      for (let i = 0; i < selectCheckGroups.length; i++) {
        const ischeck = [];
        for (let j = 0; j < selectCheckGroups[i].length; j++) {
          if (selectedValue.indexOf(selectCheckGroups[i][j]) !== -1) {
            ischeck.push(selectCheckGroups[i][j]);// 通过
          }
        }
        isCheck = ischeck.length === 0;
        if (isCheck) {
          notCheckGroup = selectCheckGroups[i];
          this.nextNodeOptions[this.checkBranch].forEach(item => {
            const selectValue = [];
            notCheckGroup.forEach(element => {
              if (element === item.id) {
                notCheckNodesName.push(item.name);
              }
            });
          });
          return { isCheck: isCheck, notCheckGroup: notCheckNodesName };
        }
      }
      return { isCheck: isCheck, notCheckGroup: notCheckNodesName };
    },
    // 校验相关节点
    checkNodes(select, selectBranch, selectValue) {
      // 相关节点都要选
      let notCheckNodes = [];
      const notCheckNodesName = [];
      let notCheckName = '';
      let isCheck = [];
      // relatedNodes relateGroups
      for (let i = 0; i < select.length; i++) {
        const notCheck = [];
        for (let j = 0; j < select[i].relatedNodes.length; j++) {
          if (selectBranch.indexOf(select[i].relatedNodes[j]) !== -1 && selectValue.indexOf(select[i].relatedNodes[j]) === -1) {
            notCheck.push(select[i].relatedNodes[j]);// 选中节点中有没选中的相关节点
          }
        }
        isCheck = notCheck.length === 0;
        if (!isCheck) {
          notCheckName = select[i].name;
          notCheckNodes = select[i].relatedNodes[i];
          this.nextNodeOptions[this.checkBranch].forEach(item => {
            if (notCheckNodes === item.id) {
              notCheckNodesName.push(item.name);
            }
          });
          break;
        }
      }
      return { isCheck: isCheck, notCheckName: notCheckName, notCheckNodesName: notCheckNodesName };
    },
    // 校验相关节点组
    checkNodesGroup(select, selectBranch, selectValue) {
      // 相关节点组每组都要选一个
      let notCheckNodes = [];// 没有选有的相关节点组
      const notCheckNodesName = [];// 没有选有的相关节点组的名字
      let notCheckName = '';// 没有选有的相关节点组当前节点名
      let isCheck = false;
      // relatedNodes relateGroups
      for (let i = 0; i < select.length; i++) {
        const notCheck = [];
        if (select[i].relateGroups) {
          for (let j = 0; j < select[i].relateGroups.length; j++) {
            const selectRelateGroups = []; // 筛选当前节点相关组在当前支点的节点
            select[i].relateGroups[j].forEach(element => {
              // let checkNode = [];
              selectBranch.forEach(item1 => {
                if (item1 === element) {
                  selectRelateGroups.push(element);
                }
              });
            });
            const ischeck = [];
            if (selectRelateGroups.length > 0) {
              for (let k = 0; k < selectRelateGroups.length; k++) {
                if (selectValue.indexOf(selectRelateGroups[k]) !== -1) {
                  ischeck.push(selectRelateGroups[k]);// 通过
                }
              }
              isCheck = ischeck.length === 0;
              if (isCheck) {
                notCheckName = select[i].name;
                notCheckNodes = selectRelateGroups;
                this.nextNodeOptions[this.checkBranch].forEach(item => {
                  const selectValue = [];
                  notCheckNodes.forEach(element => {
                    if (element === item.id) {
                      notCheckNodesName.push(item.name);
                    }
                  });
                });
                return { isCheckGroup: isCheck, notCheckNameGroup: notCheckName, notCheckNodesNameGroup: notCheckNodesName };
              }
            }
          }
        }
      }
      return { isCheckGroup: isCheck, notCheckNameGroup: notCheckName, notCheckNodesNameGroup: notCheckNodesName };
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
      if (!(this.checkList.includes(this.nextCheckNode) || this.isMustCheck)) {
        this.$refs.multipleTable.clearSelection();
      }
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
    handleNode() {
      setTimeout(() => {
        this.perfectScrollbar.update();
      }, 400);
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
          this.$nextTick(() => {
            this.perfectScrollbar = new PerfectScrollbar('.assignee-tree', {});
          });
          setTimeout(() => {
            this.perfectScrollbar.update();
          }, 100);
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
      if (!this.nextNodeValue) {
        HussarRouter.showMsg(this, '请先选择节点', 'warning');
        return;
      }
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
      }
    }
  },
  watch: {
    // 监听弹窗开启关闭
    selectParticipantShow: {
      handler(n) {
        if (n) {
          this.searchContent = '';
          this.nextCheckNode = '';
          this.nextNodeValue = '';
          this.checkList = [];
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
                this.$nextTick(() => {
                  this.perfectScrollbar = new PerfectScrollbar('.assignee-tree', {});
                });
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
        this.nextNodeOptions[this.checkBranch].forEach(item => {
          if (item.id === this.nextNodeValue) {
            item.selectList = this.selectList;
          }
        });
      }
    },
    selectList: {
      handler() {
        this.$nextTick(() => {
          this.ulScroll = new PerfectScrollbar('.ul-scroll1', {});
        });
      },
      deep: true
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
    .actBranch {
      //background: #EAF4FE;
      color: #045340;
    }
    .notActBranch {
      background: #F5F5F5;
    }
    .clickLabel {
      width: 83px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
    }
    .selectParticipant-content {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      .content-left {
        @include myBorder;
        width: 170px;
        overflow: hidden;
        height: 100%;
        margin-right: 16px;
        .node-tit {
          @include cardTit;
        }
        .nodePart {
          padding-bottom: 35px;
        }
        .node-ul {
          padding: 0 3px;
          .item-name {
            font-size: 14px;
            line-height: 19px;
            width: calc(100% - 20px) !important;
          }
          li {
            padding-right: 0;
            border-radius: 8px;
          }
        }
      }
      .content-left:hover {
         overflow: auto;
      }
      .content-right {
        @include myBorder;
        width: calc(100% - 186px);
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
              height: calc(100% - 36px);
              overflow: hidden;
              .roleTree {
                height: 100%;
                .el-tree-node{
                  min-width: 100%;
                  width: max-content;
                  .el-tree-node__expand-icon {
                    margin-left: 0;
                  }
                }
              }
              .tree-div {
                width: calc(92.7% - 24px);
                .staff-tree {
                  display: block;
                  width: 100%;
                  height: 100%;
                  white-space: nowrap;
                  //text-overflow: ellipsis;
                  //overflow: hidden;
                  word-break: break-all;
                }
              }
            }
            .cont-tree-box:hover {
              overflow: auto;
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
          width: 152px;
          height: 100%;
          border-left: 1px solid #E7E7E7;
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
            overflow: hidden;
            li{
              cursor: default;
              padding-right: 17px;
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
          .node-ul:hover{
            overflow: auto;
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
        border-radius: 8px !important;
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
.lcdp_axe.theme-config-front ::v-deep .dialog-cancel :hover{
  color: #fff;
}
.jxd_additional.lcdp_axe .jxd_ins_elButton.default:hover:not(.is-disabled){
  color:  #FFF !important;
}

.workFlow-dialog .node-ul li:hover .item-name, .node-ul li.actLi .item-name {
  color: var(--c-themeColor) !important;
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
.lcdp_axe.theme-config-front ::v-deep .tree-inp .el-input__inner::placeholder {
  text-align: right;
}
.lcdp_axe.theme-config-front ::v-deep .tree-inp.copy-inp .el-input__inner::placeholder {
  text-align: left;
}
.lcdp_axe.theme-config-front ::v-deep .workFlow-dialog .node-ul li.actLi, .node-ul li:hover {
  background: var(--c-lightColor) !important;
}
/* 分页 */
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover{
  color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  color: #FFFFFF;
  background-color: var(--c-themeColor);
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
.lcdp_axe.theme-config-front ::v-deep .lcdp-table .el-checkbox__input.is-checked .el-checkbox__inner,
.lcdp_axe.theme-config-front ::v-deep .content-left .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: var(--c-themeColor) !important;
  background-color: var(--c-themeColor) !important;
}
.lcdp-table ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: var(--c-themeColor) !important;
  background-color: var(--c-themeColor) !important;
}
.lcdp_axe.theme-config-front ::v-deep  .lcdp-table .el-checkbox__input .el-checkbox__inner:hover,
.lcdp_axe.theme-config-front ::v-deep .content-left .el-checkbox__input .el-checkbox__inner:hover {
  border-color: var(--c-themeColor) !important;
}
.workFlow-dialog .node-ul li i:hover {
  color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front ::v-deep .content-left .item-name-icon {
  overflow: hidden;
}
.lcdp_axe.theme-config-front ::v-deep .content-left .item-name-icon img {
  transform: translateY(-120px);
  filter: drop-shadow(var(--c-themeColor) 0 120px);
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

