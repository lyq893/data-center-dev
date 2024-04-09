<!--对应事件【追加自定义节点】，不勾选【关联网关】配置项-->
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
      <div class="customFlowNode-dialog-body-right">
        <!-- 节点名称 -->
        <div class="customFlowNode-dialog-body-row">
          <div class="customFlowNode-dialog-body-row-left">节点名称</div>
          <div class="customFlowNode-dialog-body-row-right">
            <el-input maxlength="50" v-model="nodeList.nodeName" class="jxd_ins_elInput" />
          </div>
        </div>
        <!-- 参与者 -->
        <div class="customFlowNode-dialog-body-row cyz">
          <div class="customFlowNode-dialog-body-row-left">参与者</div>
          <div class="customFlowNode-dialog-body-row-right">
            <el-select
              v-model="selTag"
              class="cyz-sel jxd_ins_elSelect"
              value-key="id"
              multiple
              placeholder="请选择"
              @focus="showRoleTree()"
              :popper-append-to-body="false"
              popper-class="cyz-select"
              style="width: 100%; height: auto;"
            >
              <el-option
                v-for="(item, index) in selTag"
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
            <el-radio-group class="jxd_ins_elRadioGroup" v-model="nodeList.counterSwitch">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </div>
        </div>
        <template v-if="nodeList.counterSwitch">
          <!-- 切换会签类型 -->
          <div class="customFlowNode-dialog-body-row">
            <div class="customFlowNode-dialog-body-row-left">会签类型</div>
            <div class="customFlowNode-dialog-body-row-right">
              <el-select
                v-model="nodeList.multiType"
                placeholder="请选择"
                class="jxd_ins_elSelect"
                @change="multiTypeChange($event)"
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
                v-model="nodeList.multiNumber"
                :min="nodeList.multiMinNumber"
                :max="nodeList.multiMaxNumber"
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
                      class="tree-inp jxd_ins_elInput"
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
                      class="tree-inp copy-inp jxd_ins_elInput"
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
                <!-- 人员树 -->
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
                <el-tooltip class="item" v-if="tableList.length && JSON.stringify(tableItem) !== '{}'" effect="dark" :content="tableList.length && JSON.stringify(tableItem) !== '{}' ? tableList[0].parentName : ''" placement="top-start">
                  <p>{{ tableList.length && JSON.stringify(tableItem) !== "{}" ? tableList[0].parentName : "" }}</p>
                </el-tooltip>
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
          <!-- 已选 -->
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
      selTag: [],
      nodeList: {
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
      },
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
      // 搜索条件
      inputSelect: '',
      // 人员树数据
      treeData: [],
      treeKey: new Date() + 'tree',
      // 加载
      loading: false,
      // 用户名称和部门数组
      options: [],
      treeId: '11', // 默认为11
      treeNode: null,
      treeResolve: null,
      totalCount: 0,
      // 表格搜索条件
      tableItem: {},
      // 已选列表
      selectList: [],
      parentName: '',
      // 控制popover显隐
      visible: false,
      tableLoading: false,
      // 表格数据
      tableList: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      // 多选选项
      multipleSelection: [],
      isbg: false,
      scrollT: 0
    };
  },
  watch: {
    // 监控人员树弹出显隐
    roleTreeVisible: {
      handler(n) {
        this.treeKey = new Date() + 'tree';
        this.visible = false;
        this.selection = {};
        this.tableItem = {};
        this.selectList = [];
        this.inputSelect = '';
        this.getTableList({});
        if (n) {
          if (this.$refs.tree) {
            this.$refs.multipleTable.clearSelection();
          }
          const selTags = [...this.selTag];
          this.selectList = [...selTags];
        }
      },
      deep: true
    },
    // 父组件传参
    customFlowNodeVisible: {
      handler(n) {
        // 每次打开追加自定义节点弹窗时，初始化数据
        if (n) {
          this.init();
        }
      },
      deep: true
    },
    // 监控表格数据
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
    // 多选
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
    // 监控下一个节点配置
    selTag: {
      handler(n) {
        const ids = [];
        const names = [];
        n.forEach(item => {
          ids.push(item.id);
          names.push(item.label);
        });
        this.nodeList.nodeChecked = [...n];
        this.nodeList.nodeAssignee = ids.join(',');
        this.nodeList.nodeNames = names.join(',');
        console.log(n, this.nodeList);
      },
      deep: true
    }
  },
  methods: {
    // 会签类型改变
    multiTypeChange(value) {
      if (value === 'radio') {
        this.nodeList.multiNumber = 100;
        this.nodeList.multiMaxNumber = 100;
      } else if (value === 'count') {
        this.nodeList.multiNumber = 1;
        this.nodeList.multiMaxNumber = undefined;
      }
      this.$forceUpdate();
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
          HussarRouter.showMsg(this, '驳回节点数据请求异常', 'error');
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
      // const nodes = this.$refs.tree.getCheckedNodes();
      const nodes = this.selectList;
      this.selTag = [...nodes];
      this.nodeList.nodeChecked = [...nodes];
      // 获取处理被选中用户id
      const ids = [];
      const names = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'user') {
          ids.push(nodes[i].id);
          names.push(nodes[i].label);
        }
      }
      this.nodeList.nodeAssignee = ids.join(',');
      this.nodeList.nodeNames = names.join(',');
      this.roleTreeVisible = false;
    },
    // 关闭人员树弹窗，还原至上次保存的数据
    handleTreeClose() {
      this.visible = false;
      this.roleTreeVisible = false;
    },
    // 打开人员树弹窗
    showRoleTree() {
      this.roleTreeVisible = true;
    },
    // 保存追加自定义节点弹窗数据
    handleSave() {
      const self = this;
      let isEmpty = false;
      if (this.nodeList.nodeName === '' || this.nodeList.nodeAssignee === '') {
        isEmpty = true;
      }
      if (!isEmpty) {
        const data = {
          taskId: this.taskId ? this.taskId : '',
          list: [this.nodeList],
          parallel: false
        };
        const loading = self.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        // 接口调用
        hussarRequest.postJson(workFlowApi.addCustomNode, data).then((res) => {
          if (res.code === 10000) {
            self.$emit('close');
            HussarRouter.showMsg(this, '追加节点成功', 'success');
            self.$emit('addCustomNodeExecuteFunction');
          } else {
            HussarRouter.showMsg(this, res.msg, 'error');
          }
          loading.close();
        }).catch((e) => {
          HussarRouter.showMsg(this, '追加节点异常', 'error');
          console.error(e);
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
      this.nodeList = {
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
      };
      this.roleTreeVisible = false;
      this.filterText = '';
      this.selTag = [];
    },
    // 行数据的key
    getRowKey(row) {
      return row.participantId;
    },
    // table多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 单选
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
    // 树节点点击
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
    // 获取列表数据
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
      }
      .customFlowNode-dialog-body-right {
        @include bodyCommon;
        width: 100%;
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
              display: inline-block;
              white-space: nowrap;
            }
          }
          .table_box {
            height: calc(100% - 106px);
            width: auto;
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
/* 输入框 */
.lcdp_axe.theme-config-front ::v-deep .el-input {
  width: 100%;
}
.lcdp_axe.theme-config-front ::v-deep .el-input__inner:hover {
  border-color: var(--c-themeColor);
}
.lcdp_axe.theme-config-front .cyz ::v-deep .el-input__inner {
  padding: 6px 0px !important;
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
.workFlow-dialog .node-ul li i:hover {
    color: var(--c-themeColor);
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
