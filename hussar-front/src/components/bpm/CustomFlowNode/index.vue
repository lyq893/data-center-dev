<!--对应事件【追加自定义节点】，勾选【关联网关】配置项-->
<template>
  <el-dialog
    v-dialog-drag
    custom-class="workFlow-dialog"
    class="customFlowNode-dialog lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    :visible.sync="customFlowNodeVisible"
    title="追加自定义节点"
    width="694px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="customFlowNode-dialog-body">
      <div
        class="customFlowNode-dialog-body-left"
        @mousemove="mousemove($event)"
        @mouseup="mouseup"
      >
        <!-- 新建节点 -->
        <div class="add-div">
          <el-button type="text" @click="addItem">
            <i class="el-icon-plus" />
            新建
          </el-button>
        </div>
        <!-- 节点列表 -->
        <ul class="node-ul">
          <li
            v-for="(item, index) in nodeList"
            :key="index"
            @click="clickNodeList(index)"
            :class="{
              actLi: index === showTreeIndex,
              lineLi: ifMouse && index === newInd && posInd <= nodeList.length,
              lineLast: ifMouse && index === nodeList.length - 1 && posInd > nodeList.length
            }"
          >
            <div class="item-name">{{ item.nodeName ? item.nodeName : `节点${index + 1}` }}</div>
            <div class="item-btn">
              <img
                src="@/assets/icon/more.png"
                @mousedown="mousedown($event, item, index)"
              >
              <i class="el-icon-delete" @click="delItem(index, $event)" />
            </div>
          </li>
          <li
            ref="selectBox"
            class="selectBox"
            v-if="ifMouse"
            @mouseout="mouseout"
          >
            <div class="item-name">{{ selectItem.nodeName ? selectItem.nodeName : `节点${oldInd + 1}` }}</div>
            <div class="item-btn">
              <img src="@/assets/icon/more.png">
              <i class="el-icon-delete" />
            </div>
          </li>
        </ul>
      </div>
      <div class="customFlowNode-dialog-body-right">
        <!-- 节点名称 -->
        <div class="customFlowNode-dialog-body-row">
          <div class="customFlowNode-dialog-body-row-left">节点名称</div>
          <div class="customFlowNode-dialog-body-row-right nodeNameHeight">
            <el-input class="jxd_ins_elInput default" maxlength="50" v-model="nodeList[showTreeIndex].nodeName" />
          </div>
        </div>
        <div class="customFlowNode-dialog-body-row">
          <!-- 参与者 -->
          <div class="customFlowNode-dialog-body-row-left">参与者</div>
          <div class="customFlowNode-dialog-body-row-right cyz">
            <el-select
              v-model="selTag[showTreeIndex]"
              class="cyz-sel jxd_ins_elSelect default"
              value-key="id"
              multiple
              placeholder="请选择"
              @focus="showRoleTree(selTag[showTreeIndex])"
              :popper-append-to-body="false"
              popper-class="cyz-select"
              style="width: 100%; height: auto"
            >
              <el-option
                v-for="(item, index) in selTag[showTreeIndex]"
                :key="index"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </div>
        </div>
        <!-- 是否会签 -->
        <div class="customFlowNode-dialog-body-row">
          <div class="customFlowNode-dialog-body-row-left">会签</div>
          <div class="customFlowNode-dialog-body-row-right">
            <el-radio-group class="jxd_ins_elRadioGroup default" v-model="nodeList[showTreeIndex].counterSwitch">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </div>
        </div>
        <template v-if="nodeList[showTreeIndex].counterSwitch">
          <!-- 切换会签类型 -->
          <div class="customFlowNode-dialog-body-row">
            <div class="customFlowNode-dialog-body-row-left">会签类型</div>
            <div class="customFlowNode-dialog-body-row-right">
              <el-select
                v-model="nodeList[showTreeIndex].multiType"
                class="jxd_ins_elSelect default"
                placeholder="请选择"
                @change="multiTypeChange($event, nodeList[showTreeIndex])"
                popper-class="workflow-huiqian"
                style="width: 100%; height: 30px"
              >
                <el-option
                  v-for="option in multiTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
          </div>
          <!-- 修改会签值 -->
          <div class="customFlowNode-dialog-body-row">
            <div class="customFlowNode-dialog-body-row-left">会签值</div>
            <div class="customFlowNode-dialog-body-row-right">
              <el-input-number
                style="width: 100%; height: 30px"
                controls-position="right"
                size="small"
                step-strictly
                v-model="nodeList[showTreeIndex].multiNumber"
                :min="nodeList[showTreeIndex].multiMinNumber"
                :max="nodeList[showTreeIndex].multiMaxNumber"
                :step="1"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
    <el-dialog
      v-dialog-drag
      custom-class="workFlow-dialog"
      class="roleTree-dialog lcdp-dialog jxd_additional lcdp_axe theme-config-front"
      :visible.sync="roleTreeVisible"
      title="选择参与者"
      width="970px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="handleTreeClose"
    >
      <div class="roleTree-content">
        <div class="content-right">
          <div class="cont-left">
            <div class="cont-tree">
              <!-- 搜索 -->
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
                      class="tree-inp copy-inp .jxd_ins_elInput.default"
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
              <div class="cont-tree-box" v-if="treeData.length">
                <!-- 树结构 -->
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
              <div class="cont-tree-box" v-else>
                <!-- 懒加载树 -->
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
            <!-- 用户名称和部门列表 -->
            <div class="cont-table">
              <div class="table-tit">
                {{ tableList.length && JSON.stringify(tableItem) !== "{}" ? tableList[0].parentName : "" }}
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
                  @select-all="selectAll"
                  @select="handleSelect"
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
              <!-- 翻页 -->
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
          <!-- 已选列表 -->
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
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleTreeClose">取消</el-button>
        <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleTreeSave">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { hussarRequest } from 'hussar-base';
import { workFlowApi } from '@/api/flow/workFlowApi';
import * as HussarRouter from '@/utils/HussarRouter';
import VueEasyTree from '@wchbrad/vue-easy-tree';
// 样式文件，可以根据需要自定义样式或主题
import '@wchbrad/vue-easy-tree/src/assets/index.scss';

export default {
  name: 'CustomFlowNode',
  props: {
    customFlowNodeVisible: Boolean,
    taskId: String
  },
  components: {
    VueEasyTree
  },
  data() {
    return {
      // 会签节点下拉框选项
      multiTypeOptions: [{
        label: '按比例完成(%)',
        value: 'radio'
      }, {
        label: '按个数完成(个)',
        value: 'count'
      }],
      // 下一节点所有配置项
      selTag: [[]],
      nodeList: [{
        // 节点名称
        nodeName: '',
        // 参与者
        nodeAssignee: '',
        // 参与者名称
        nodeNames: '',
        // 选中的树节点
        nodeChecked: [],
        // 会签节点开关
        counterSwitch: false,
        // 会签节点条件
        multiType: 'radio',
        // 会签节点条件值
        multiNumber: 100,
        // 会签节点条件值最小值
        multiMinNumber: 1,
        // 会签节点条件值最大值
        multiMaxNumber: 100
      }],
      // 当前人员树所属的配置项的索引
      showTreeIndex: 0,
      // 人员树弹窗显隐标识
      roleTreeVisible: false,
      // 人员树过滤关键字
      filterText: '',
      // 人员树配置
      props: {
        id: 'id',
        label: 'label',
        children: 'childrenList',
        isLeaf: 'isLeaf'
      },
      // 搜索内容
      inputSelect: '',
      // 树数据
      treeData: [],
      treeKey: new Date() + 'tree',
      // 加载
      loading: false,
      // 用户名称和部门数组
      options: [],
      treeId: '11', // 默认为11
      // 树节点
      treeNode: null,
      treeResolve: null,
      totalCount: 0,
      // 表格搜索条件
      tableItem: {},
      // 已选列表
      selectList: [],
      // 控制popover显隐
      visible: false,
      // 用户名称和部门加载
      tableLoading: false,
      tableList: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 多选选项
      multipleSelection: [],
      selectItem: {},
      oldInd: null,
      newInd: null,
      posInd: null,
      oldNodePos: {
        x: 0,
        y: 0
      },
      ifMouse: false,
      oldMousePos: {
        x: 0,
        y: 0
      },
      isbg: false,
      scrollT: 0
    };
  },
  watch: {
    // 监控人员弹窗显隐
    roleTreeVisible: {
      handler(n) {
        this.treeKey = new Date() + 'tree';
        this.visible = false;
        this.selection = [];
        this.tableItem = {};
        this.selectList = [];
        this.inputSelect = '';
        this.getTableList({});
        if (n) {
          if (this.$refs.multipleTable) {
            this.$refs.multipleTable.clearSelection();
          }
          const selTags = [...this.selTag[this.showTreeIndex]];
          this.selectList = [...selTags];
        }
      },
      deep: true
    },
    // 追加自定义节点显隐监控
    customFlowNodeVisible: {
      handler(n) {
        // 每次打开追加自定义节点弹窗时，初始化数据
        if (n) {
          this.init();
        }
      },
      deep: true
    },
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
    // 监控搜索内容
    inputSelect: {
      handler(n) {
        if (n === '') {
          this.filterText = '';
        }
      },
      deep: true
    },
    // 监控多选
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
    },
    // 监控下一节点配置项
    selTag: {
      handler(n) {
        n.forEach((item, index) => {
          const ids = [];
          const names = [];
          item.forEach(it => {
            ids.push(it.id);
            names.push(it.label);
          });
          this.nodeList[index].nodeChecked = [...n];
          this.nodeList[index].nodeAssignee = ids.join(',');
          this.nodeList[index].nodeNames = names.join(',');
        });
      },
      deep: true
    }
  },
  methods: {
    // 会签类型改变
    multiTypeChange(value, item) {
      if (value === 'radio') {
        item.multiNumber = 100;
        item.multiMaxNumber = 100;
      } else if (value === 'count') {
        item.multiNumber = 1;
        item.multiMaxNumber = undefined;
      }
      this.$forceUpdate();
    },
    // 删除一个节点配置项
    delItem(index, ev) {
      if (this.nodeList.length === 1) {
        HussarRouter.showMsg(this, '请至少保留一个节点', 'warning');
        // 阻止事件冒泡
        const event = window.event || ev;
        event.stopPropagation();
        return;
      }
      if (this.showTreeIndex === index) {
        this.showTreeIndex = (index - 1) < 0 ? 0 : (index - 1);
      } else {
        this.showTreeIndex = (this.showTreeIndex - 1) < 0 ? 0 : (this.showTreeIndex - 1);
      }
      this.nodeList.splice(index, 1);
      this.selTag.splice(index, 1);
      // 阻止事件冒泡
      const event = window.event || ev;
      event.stopPropagation();
    },
    // 添加一个节点配置项
    addItem() {
      this.nodeList.push({
        // 节点名称
        nodeName: '',
        // 参与者
        nodeAssignee: '',
        // 参与者名称
        nodeNames: '',
        // 选中的树节点
        nodeChecked: [],
        // 会签节点开关
        counterSwitch: false,
        // 会签节点条件
        multiType: 'radio',
        // 会签节点条件值
        multiNumber: 100,
        // 会签节点条件值最小值
        multiMinNumber: 1,
        // 会签节点条件值最大值
        multiMaxNumber: 100
      });
      this.selTag.push([]);
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
        <div>
          <span class='staff-tree'>
            <span className='svg-icon'><svg-icon icon-class={iconType}/></span>
            {node.label}
          </span>
        </div>
      );
    },
    // 加载树
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
    // 设置叶子节点组织机构不可选
    disabledFn(data) {
      if ((data.isLeaf && data.type !== 'user')) {
        return true;
      } else {
        return false;
      }
    },
    // 保存人员树弹窗数据
    handleTreeSave() {
      const nodes = this.selectList;
      this.selTag[this.showTreeIndex] = [...nodes];
      this.nodeList[this.showTreeIndex].nodeChecked = [...nodes];
      // 获取处理被选中用户id
      const ids = [];
      const names = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'user') {
          ids.push(nodes[i].id);
          names.push(nodes[i].label);
        }
      }
      this.nodeList[this.showTreeIndex].nodeAssignee = ids.join(',');
      this.nodeList[this.showTreeIndex].nodeNames = names.join(',');

      this.roleTreeVisible = false;
    },
    // 关闭人员树弹窗，还原至上次保存的数据
    handleTreeClose() {
      this.visible = false;
      this.roleTreeVisible = false;
    },
    // 显示点击节点
    clickNodeList(index) {
      this.showTreeIndex = index;
    },
    // 打开人员树弹窗
    showRoleTree() {
      this.roleTreeVisible = true;
    },
    // 保存追加自定义节点弹窗数据
    handleSave() {
      const self = this;
      let isEmpty = false;
      for (let i = 0; i < this.nodeList.length; i++) {
        if (this.nodeList[i].nodeName === '' || this.nodeList[i].nodeAssignee === '') {
          isEmpty = true;
          break;
        }
      }
      if (!isEmpty) {
        // 参数
        const data = {
          taskId: this.taskId ? this.taskId : '',
          list: this.nodeList,
          parallel: true
        };
        const loading = self.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        // 调用追加节点方法
        hussarRequest.postJson(workFlowApi.addCustomNode, data).then((res) => {
          if (res.code === 10000) {
            self.$emit('close');
            HussarRouter.showMsg(this, '追加节点成功', 'success');
            self.$emit('addCustomNodeExecuteFunction');
          } else {
            HussarRouter.showMsg(this, res.msg, 'error');
          }
          loading.close();
        }).catch(() => {
          HussarRouter.showMsg(this, '追加节点异常', 'error');
          loading.close();
        });
      } else {
        HussarRouter.showMsg(this, '节点名称和参与者不能为空', 'warning');
        self.$emit('addCustomNodeExecuteFunction');
      }
    },
    // 关闭追加自定义节点弹窗
    handleClose() {
      this.$emit('close');
    },
    // 初始化方法
    init() {
      this.nodeList = [{
        // 节点名称
        nodeName: '',
        // 参与者
        nodeAssignee: '',
        // 参与者名称
        nodeNames: '',
        // 选中的树节点
        nodeChecked: [],
        // 会签节点开关
        counterSwitch: false,
        // 会签节点条件
        multiType: 'radio',
        // 会签节点条件值
        multiNumber: 100,
        // 会签节点条件值最小值
        multiMinNumber: 1,
        // 会签节点条件值最大值
        multiMaxNumber: 100
      }];
      this.showTreeIndex = 0;
      this.roleTreeVisible = false;
      this.filterText = '';
      this.selTag = [[]];
    },
    // table多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 单选选用户名称和部门
    handleSelect(selection, row) {
      // 相当于取消选中
      if (selection.indexOf(row) < 0) {
        const index = this.selectList.findIndex(it => it.id === row.id);
        this.selectList.splice(index, 1);
      }
    },
    // 全选
    selectAll(val) {
      if (val.length === 0) {
        this.selectList = [];
      }
    },
    // 搜索
    changeFilter() {
      this.enterMethod(this.inputSelect);
    },
    // 点击查询到的列表数据
    changeInput(item) {
      this.filterText = item;
      this.inputSelect = item.label;
      this.visible = false;
    },
    // 获取焦点
    inpFocus() {
      this.isbg = true;
      if (this.options.length) {
        this.visible = true;
      }
    },
    // 点击节点树
    handleNodeClick(item) {
      this.tableItem = item;
      this.getTableList(item);
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      // this.tableDataReset();
      this.getTableList();
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
        hussarRequest.get(workFlowApi.queryUserTree, {
          organName: query
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
        this.options = [];
      }
    },
    // 获取用户名称和部门数据
    getTableList(n = this.tableItem) {
      this.tableList = [];
      hussarRequest.get(workFlowApi.queryUserListByPage, {
        ...{ ...n, ...{ childrenList: [] }},
        size: this.PageSize,
        current: this.currentPage
      }).then(res => {
        this.tableLoading = false;
        if (res.code === 10000) {
          this.tableList = [...res.data.records];
          this.totalCount = res.data.total;
        }
      });
    },
    // 鼠标按下
    mousedown(ev, item, index) {
      this.oldInd = index;
      this.ifMouse = true;
      this.selectItem = item;
      const evDom = ev.currentTarget.parentElement.parentElement;
      // 元素初始位置
      this.oldNodePos = {
        x: evDom.offsetLeft,
        y: evDom.offsetTop
      };
      // 鼠标原始位置
      this.oldMousePos = {
        x: ev.pageX,
        y: ev.pageY
      };
      this.$nextTick(() => {
        this.$refs.selectBox.style.left = `${evDom.offsetLeft}px`;
        this.$refs.selectBox.style.top = `${evDom.offsetTop}px`;
      });
    },
    // 鼠标移动
    mousemove(ev) {
      if (this.ifMouse) {
        const lefts = this.oldMousePos.x - this.oldNodePos.x; // x轴偏移量
        const tops = this.oldMousePos.y - this.oldNodePos.y; // y轴偏移量
        const { pageX, pageY } = ev; // 手指位置
        this.$refs.selectBox.style.left = `${pageX - lefts}px`;
        this.$refs.selectBox.style.top = `${pageY - tops}px`;
        this.cardIndex();
      }
    },
    // 计算位置
    cardIndex() {
      const liHei = 32;
      const selDom = this.$refs.selectBox;
      const { offsetTop } = selDom;
      this.posInd = Math.floor(offsetTop / liHei); // 获取位置所在index
      if (this.posInd <= 0) {
        this.newInd = 0;
      } else if (this.posInd >= this.nodeList.length) {
        this.newInd = this.nodeList.length - 1;
      } else {
        this.newInd = this.posInd - 1;
      }
    },
    // 鼠标离开
    mouseout() {
      this.moveend();
    },
    // 鼠标松开
    mouseup() {
      // 判断是否拖拽了
      if (JSON.stringify(this.selectItem) !== '{}' && this.ifMouse) {
        this.nodeList.splice(this.oldInd, 1);
        this.nodeList.splice(this.newInd, 0, this.selectItem);
        const item = this.selTag[this.oldInd];
        this.selTag.splice(this.oldInd, 1);
        this.selTag.splice(this.newInd, 0, item);
      }
      this.moveend();
    },
    // 清空重置
    moveend() {
      this.selectItem = {};
      this.oldInd = null;
      this.newInd = null;
      this.posInd = null;
      this.ifMouse = false;
      this.oldNodePos = {
        x: 0,
        y: 0
      };
      this.oldMousePos = {
        x: 0,
        y: 0
      };
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
  mounted() {
    // 初始化
    this.init();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .popCls {
    padding: 12px 0;
  }
  .workflow-huiqian {
    margin-top: 10px !important;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/assets/css/workFlow.scss';
  ::v-deep .workFlow-dialog {
    height: 521px;
    .el-dialog__body {
      padding: 15px 16px 0;
    }
    .customFlowNode-dialog-body {
      border: 1px solid #E7E7E7;
      border-radius: 2px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      @mixin bodyCommon{
        height: 100%;
        box-sizing: border-box;
      }
      $main-padding: 16px;
      .customFlowNode-dialog-body-left {
        position: relative;
        overflow: hidden;
        @include bodyCommon;
        padding: 8px 0 16px;
        width: 216px;
        border-right: 1px solid #E7E7E7;
        .add-div {
          height: 36px;
          display: flex;
          align-items: center;
          padding-left: $main-padding;
        }
        .node-ul {
          li.lineLi {
            position: relative;
            &::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 1px;
              background: var(--c-themeColor);
              top: 0;
              left: 0;
            }
          }
          li.lineLast {
            position: relative;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 1px;
              background: var(--c-themeColor);;
              bottom: 0;
              left: 0;
            }
          }
          li.selectBox {
            &::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 500px;
              left: 0;
            }
            position: absolute;
            z-index: 9999;
            opacity: 0.7;
            .item-name {
              color: #4A4C66 !important;
            }
          }
        }
        .item-btn {
          display: flex;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
      .customFlowNode-dialog-body-right {
        @include bodyCommon;
        width: calc(100% - 216px);
        padding: 24px 30px;
        .customFlowNode-dialog-body-row {
          display: flex;
          align-items: center;
          width: 100%;
          &:not(:last-child) {
            margin-bottom: 24px;
          }
          .customFlowNode-dialog-body-row-left {
            width: 56px;
            margin-right: 12px;
            text-align: right;
          }
          .customFlowNode-dialog-body-row-right {
            width: calc(100% - 68px);
            .el-input-number {
              .el-input, .el-input__inner {
                width: 100% !important;
                text-align: left;
              }
              .el-input__inner {
                box-sizing: border-box;
                padding: 0 8px;
              }
            }
          }
        }
      }
    }
    .el-table-column--selection .cell {
      padding: 0 10px;
    }
    .roleTree-content {
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
          >div {
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
            }
          }
          .table_box {
            height: calc(100% - 106px);
          }
          .page-box {
            margin-right: 45px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }
        .cont-right {
          width: 190px;
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
  .selectBox {

  }
  ::v-deep .cyz-sel {
    .cyz-select, .el-input__icon.el-icon-arrow-up {
      display: none;
    }
    .el-tag__close.el-icon-close {
      background: transparent;
      font-size: 14px;
      &:hover {
        color: #045340;
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
.lcdp_axe.theme-config-front ::v-deep .el-button.el-button--text {
  color: var(--c-themeColor) !important;
}
.lcdp_axe.theme-config-front ::v-deep .workFlow-dialog .node-ul li.actLi .item-name, .workFlow-dialog .node-ul li:hover .item-name,
.workFlow-dialog .node-ul li i:hover {
  color: var(--c-themeColor);
}
/* 输入框 */
.lcdp_axe.theme-config-front ::v-deep .el-input {
  width: 100%;
  /*height: 30px;*/
}
.lcdp_axe.theme-config-front .cyz ::v-deep .el-input__inner {
  padding: 6px 0px !important;
}
.lcdp_axe.theme-config-front .cyz ::v-deep .el-select .el-select__tags .el-tag.el-tag--info {
  white-space: pre-line;
  height: auto;
}
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
/* 分页 */
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover{
  color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  color: #FFFFFF;
  background-color: var(--c-themeColor);
}
/* 下拉框 */
.lcdp_axe.theme-config-front ::v-deep .el-select .el-input__inner:focus {
  border-color: var(--c-themeColor);
}
/* 计数器 */
.customFlowNode-dialog-body-row-right ::v-deep .el-input__inner:focus {
  border-color: var(--c-themeColor);
}
/* 查询下拉样式 */
.div-label.div-pop:hover {
  color: var(--c-themeColor);
  background-color: var(--c-lineAreaColor);
}
/* 树选择 */
.lcdp_axe.theme-config-front ::v-deep .workFlow-dialog .node-ul li.actLi, .node-ul li:hover {
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
.nodeNameHeight {
  height: 30px;
}
/* 单选框 */
.lcdp_axe.theme-config-front ::v-deep .customFlowNode-dialog-body-row-right .jxd_ins_elRadioGroup label.el-radio {
  line-height: 27px;
}
.lcdp_axe.theme-config-front .cont-inp-box ::v-deep .el-input input {
  padding-right: 30px;
}

.fixed-title-item {
  position: absolute;
  top: 0;
  background-color: white;
  width: calc(100% - 16px);
}
</style>
