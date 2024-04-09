<template>
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
          <ul class="node-ul ul-scroll1">
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
  name: 'SelectParticipantsDialog',
  props: {
    roleTreeVisible: Boolean,
    flowEventData: Object,
    taskId: String
  },
  components: {
    VueEasyTree
  },
  data() {
    return {
      // 下一节点所有配置项
      selTag: [],
      index: '',
      item: '',
      nodeList: {
        // 参与者
        assignee: '',
        // 参与者名称
        nodeNames: ''
      },
      // 人员树过滤关键字
      filterText: '',
      // 人员树配置
      props: {
        id: 'id',
        label: 'label',
        children: 'childrenList',
        isLeaf: 'isLeaf'
      },
      // 协办意见内容
      comment: '',
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
      // 总字数
      totalText: 0,
      ulScroll: undefined,
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
          if (this.$refs.multipleTable) {
            this.$refs.multipleTable.clearSelection();
          }
          const selTags = [...this.selTag];
          this.selectList = [...selTags];
        }
      },
      deep: true
    },
    // 监控协办意见
    comment() {
      this.totalText = this.comment.length;
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
    selectList: {
      handler() {
        this.$nextTick(() => {
          this.ulScroll = new PerfectScrollbar('.ul-scroll1', {});
        });
      },
      deep: true
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
        this.nodeList.assignee = ids.join(',');
        this.nodeList.nodeNames = names.join(',');
      },
      deep: true
    }
  },
  methods: {
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
          HussarRouter.showMsg(this, '发起协办数据请求异常', 'error');
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
      const selectedObjs = [];
      const numberObjs = [];
      const objNumbers = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'user') {
          selectedObjs.push({
            value: nodes[i].id,
            label: nodes[i].label
          });
          numberObjs.push(nodes[i]);
          objNumbers.push(nodes[i].id);
        }
      }
      this.$emit('handleTreeSave', { selectedObjs, numberObjs, objNumbers });
      this.$emit('close');
    },
    // 关闭人员树弹窗，还原至上次保存的数据
    handleTreeClose() {
      this.$emit('close');
      this.visible = false;
      this.currentPage = 1;
      if (this.ulScroll !== null) {
        this.ulScroll.destroy();
        this.ulScroll = null;
      }
    },
    // 初始化方法
    init() {
      this.nodeList = {
        // 节点名称
        nodeName: '',
        // 参与者
        assignee: '',
        // 参与者名称
        nodeNames: '',
        // 选中的树节点
        nodeChecked: []
      };
      this.filterText = '';
      this.comment = '';
      this.selTag = [];
    },
    // 行数据的key
    getRowKey(row) {
      return row.participantId;
    },
    // table多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selTag = val;
    },
    Reassign(val) {
      this.selTag = val;
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/assets/css/workFlow.scss';
::v-deep .workFlow-dialog {
  height: 521px;
  .el-dialog__body {
    padding: 15px 16px 0;
  }
  .launchAssisted-dialog-body {
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
    .launchAssisted-dialog-body-left {
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
    .launchAssisted-dialog-body-right {
      @include bodyCommon;
      width: 100%;
      padding: 24px 30px;
      .launchAssisted-dialog-body-row {
        display: flex;
        align-items: center;
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .launchAssisted-dialog-body-row-left {
          width: 56px;
          margin-right: 12px;
          text-align: right;
        }
        .launchAssisted-dialog-body-row-right {
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
      .launchAssisted-dialog-body-row-x {
        display: flex;
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .launchAssisted-dialog-body-row-left-x {
          width: 56px;
          margin-right: 12px;
          text-align: right;
        }
        .launchAssisted-dialog-body-row-right-x {
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
            width: 100%;
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
            position:absolute;
            right: 34px;
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
.causeInput-dialog-body {
  height: 100%;
  .text-box{
    height: calc(100% - 150px);

    .commentTextarea{
      height: 100%;

      ::v-deep .el-textarea__inner {
        height: 100%;
        padding: 10px 15px 40px 15px;
      }
    }

    .commentNew{
      width: 100%;
      height: 300px;
      border:#D5D9DC;
    }
  }

  .selectType {
    margin-top: 18px;
    width: 100%;
    overflow: hidden;
    display: flex;

    > span {
      width: 70px;
    }

    > div {
      width: calc(100% - 95px);
      display: flex;
      flex-direction: column;
      margin-left: 25px;
      margin-bottom: 0;

      > .el-radio:not(:nth-child(3)) {
        margin-bottom: 16px;
      }
    }
  }
  .total-text{
    color:#999999;
  }
  .text-box {
    position: relative;
    .bottom-info {
      position: absolute;
      background: #fff;
      width: calc(100% - 4px);
      top: 259px;
      height: 40px;
      padding: 0 14px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      left: 2px;
      bottom: 1px;
      border-radius: 4px;
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
  padding: 6px 14px !important;
}
.lcdp_axe.theme-config-front .xzyy ::v-deep .el-input__inner {
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
.launchAssisted-dialog-body-row-right ::v-deep .el-input__inner:focus {
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
.lcdp_axe.theme-config-front ::v-deep .launchAssisted-dialog-body-row-right .jxd_ins_elRadioGroup label.el-radio {
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
