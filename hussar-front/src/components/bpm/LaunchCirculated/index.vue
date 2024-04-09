<!--对应事件【发起传阅】-->
<template>
  <el-dialog
    v-dialog-drag
    custom-class="workFlow-dialog"
    class="launchCirculated-dialog lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    :visible.sync="launchCirculatedShow"
    title="发起传阅"
    width="694px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="launchCirculated-dialog-body">
      <div class="launchCirculated-dialog-body-right">
        <!-- 参与者 -->
        <div class="launchCirculated-dialog-body-row cyz">
          <div class="launchCirculated-dialog-body-row-left">参与者</div>
          <div class="launchCirculated-dialog-body-row-right">
            <el-select
              v-model="selTags"
              class="cyz-sel jxd_ins_elSelect"
              value-key="id"
              multiple
              placeholder="请选择"
              @focus="showRoleTree()"
              :popper-append-to-body="false"
              popper-class="cyz-select"
              style="width: 100%; height: auto; border:#D9D9D9;"
              @remove-tag="closeTag"
            >
              <el-option
                v-for="(item, index) in selTag"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <!-- 传阅原因 -->
        <div class="launchCirculated-dialog-body-row-x xzyy">
          <div class="launchCirculated-dialog-body-row-left-x">传阅原因</div>
          <div class="launchCirculated-dialog-body-row-right-x">
            <!-- 传阅原因输入框 -->
            <div class="causeInput-dialog-body">
              <div class="text-box">
                <el-input
                  class="commentTextarea jxd_ins_elTextArea default commentNew"
                  type="textarea"
                  :rows="6"
                  resize="none"
                  maxlength="500"
                  placeholder="请输入"
                  v-model="comment"
                />
                <div class="bottom-info">
                  <div class="total-text"><span>{{ totalText }}</span>/500个字</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
    <SelectParticipantsDialog
      ref="selectdialog"
      @close="roleTreeVisibleShow = false"
      :role-tree-visible="roleTreeVisibleShow"
      @handleTreeSave="getDialog"
    />
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { hussarRequest } from 'hussar-base';
import { workFlowApi } from '@/api/flow/workFlowApi';
import * as HussarRouter from '@/utils/HussarRouter';
import SelectParticipantsDialog from '../SelectParticipantsDialog';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
Vue.component('SelectParticipantsDialog', SelectParticipantsDialog);

export default {
  name: 'LaunchCirculated',
  props: {
    launchCirculatedShow: Boolean,
    flowEventData: Object,
    taskId: String
  },
  data() {
    return {
      selTag: [],
      selTagv: [],
      selTags: [],
      nodeList: {
        // 参与者
        assignee: '',
        // 参与者名称
        nodeNames: ''
      },
      // 人员树弹窗显隐标识
      roleTreeVisibleShow: false,
      // 人员树过滤关键字
      filterText: '',
      // 人员树配置
      props: {
        id: 'id',
        label: 'label',
        children: 'childrenList',
        isLeaf: 'isLeaf'
      },
      // 传阅意见内容
      comment: '',
      // 加载
      loading: false,
      treeId: '11', // 默认为11
      treeNode: null,
      treeResolve: null,
      // 控制popover显隐
      visible: false,
      // 总字数
      totalText: 0
    };
  },
  watch: {
    // 父组件传参
    launchCirculatedShow: {
      handler(n) {
        // 每次打开发起传阅弹窗时，初始化数据
        if (n) {
          this.init();
        }
      },
      deep: true
    },
    selTag: {
      handler(n) {
        const ids = [];
        const names = [];
        n.forEach(item => {
          ids.push(item.value);
          names.push(item.label);
        });
        this.nodeList.nodeChecked = [...n];
        this.nodeList.assignee = ids.join(',');
        this.nodeList.nodeNames = names.join(',');
      },
      deep: true
    },
    selTags: {
      handler(n) {
        const tempSelTag = [];
        const ids = [];
        n.forEach(item => {
          ids.push(item);
        });
        n.forEach(val => {
          tempSelTag.push(this.selTagv.find(tagv => tagv.id === val));
        });
        this.selTagv = tempSelTag;
      },
      deep: true
    },
    // 监控传阅意见
    comment() {
      this.totalText = this.comment.length;
    }
  },
  methods: {
    closeTag(item) {
      if (item && this.nodeList && this.nodeList.assignee) {
        const arr = this.nodeList.assignee.split(',');
        if (arr && arr.length > 0) {
          const itemIndex = arr.findIndex((option) => option === item);
          if (itemIndex !== -1) {
            arr.splice(itemIndex, 1);
          }
          this.nodeList.assignee = arr.join(',');
        }
      }
    },
    // 打开人员树弹窗
    showRoleTree() {
      this.roleTreeVisibleShow = true;
      const val = this.selTagv;
      this.$refs.selectdialog.Reassign(val);
    },
    // 保存发起传阅弹窗数据
    handleSave() {
      const self = this;
      const data = { ...this.flowEventData };
      const pageCloseBoolean = data.pageCloseBoolean;
      const changePagePath = data.changePagePath;
      data.comment = this.comment;
      data.taskId = this.taskId;
      data.assignee = this.nodeList.assignee;
      let isEmpty = false;
      if (this.nodeList.assignee === '') {
        isEmpty = true;
      }
      if (!isEmpty) {
        // 参数
        const data = {
          taskId: this.taskId ? this.taskId : '',
          assignee: this.nodeList.assignee,
          comment: this.comment
        };
        const loading = self.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        hussarRequest.postJson(workFlowApi.ccTask, data).then((res) => {
          if (res.code === 200 || res.code === 10000) {
            const pathObj = {
              path: changePagePath,
              query: {
                refresh: true
              }
            };
            HussarRouter.returnPage(self, pathObj, 2, pageCloseBoolean);
            self.$emit('showLaunchCirculatedExecuteFunction');
            HussarRouter.showMsg(this, '发起传阅成功', 'success');
            self.handleClose();
          } else {
            HussarRouter.showMsg(this, res.msg, 'error');
          }
          loading.close();
        }).catch((e) => {
          console.log(e);
          loading.close();
        });
      } else {
        HussarRouter.showMsg(this, '参与者不能为空', 'warning');
        self.$emit('showLaunchCirculatedExecuteFunction');
      }
    },
    // 关闭发起传阅弹窗
    handleClose() {
      this.$emit('close');
    },
    getDialog(temp) {
      if (temp) {
        this.selTag = temp.selectedObjs;
        this.selTags = temp.objNumbers;
        this.selTagv = temp.numberObjs;
        this.nodeList.assignee = temp.numberObjs.join(',');
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
      this.selTagv = [];
      this.selTags = [];
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
  .launchCirculated-dialog-body {
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
    .launchCirculated-dialog-body-left {
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
    .launchCirculated-dialog-body-right {
      @include bodyCommon;
      width: 100%;
      padding: 24px 30px;
      .launchCirculated-dialog-body-row {
        display: flex;
        align-items: center;
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .launchCirculated-dialog-body-row-left {
          width: 56px;
          margin-right: 12px;
          text-align: right;
        }
        .launchCirculated-dialog-body-row-right {
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
      .launchCirculated-dialog-body-row-x {
        display: flex;
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .launchCirculated-dialog-body-row-left-x {
          width: 56px;
          margin-right: 12px;
          text-align: right;
        }
        .launchCirculated-dialog-body-row-right-x {
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
.launchCirculated-dialog-body-row-right ::v-deep .el-input__inner:focus {
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
.lcdp_axe.theme-config-front ::v-deep .launchCirculated-dialog-body-row-right .jxd_ins_elRadioGroup label.el-radio {
  line-height: 27px;
}
.lcdp_axe.theme-config-front .cont-inp-box ::v-deep .el-input input {
  padding-right: 30px;
}
</style>
