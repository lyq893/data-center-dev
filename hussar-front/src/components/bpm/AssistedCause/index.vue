<!--对应事件【协办办理】-->
<template>
  <el-dialog
    v-dialog-drag
    custom-class="workFlow-dialog"
    class="assistedCause-dialog lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    :visible.sync="assistedCauseShow"
    title="协办意见"
    width="694px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <!-- 协助原因 -->
    <div class="assistedCause-dialog-body-row-x xzyy">
      <div class="assistedCause-dialog-body-row-right-x">
        <!-- 协助原因输入框 -->
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
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarRequest } from 'hussar-base';
import { workFlowApi } from '@/api/flow/workFlowApi';
import * as HussarRouter from '@/utils/HussarRouter';

export default {
  name: 'AssistedCause',
  props: {
    assistedCauseShow: Boolean,
    flowEventData: Object,
    taskId: String
  },
  data() {
    return {
      // 协办意见内容
      comment: '',
      // 加载
      loading: false,
      // 总字数
      totalText: 0,
      // 控制popover显隐
      visible: false
    };
  },
  watch: {
    // 父组件传参
    assistedCauseShow: {
      handler(n) {
        // 每次打开协办意见弹窗时，初始化数据
        if (n) {
          this.init();
        }
      },
      deep: true
    },
    // 监控协办意见
    comment() {
      this.totalText = this.comment.length;
    }
  },
  methods: {
    // 保存发起协办弹窗数据
    handleSave() {
      const self = this;
      const data = { ...this.flowEventData };
      const url = data.url;
      const pageCloseBoolean = data.pageCloseBoolean;
      const changePagePath = data.changePagePath;
      data.comment = this.comment;
      data.taskId = this.taskId;
      const isEmpty = true;
      if (isEmpty) {
        // 参数
        const data = {
          taskId: this.taskId ? this.taskId : '',
          comment: this.comment
        };
        const loading = self.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        hussarRequest.postJson(workFlowApi.completeAssistTask, data).then((res) => {
          if (res.code === 200 || res.code === 10000) {
            const pathObj = {
              path: changePagePath,
              query: {
                refresh: true
              }
            };
            HussarRouter.returnPage(self, pathObj, 2, pageCloseBoolean);
            self.$emit('showAssistedCauseExecuteFunction');
            HussarRouter.showMsg(this, '办理协办成功', 'success');
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
        HussarRouter.showMsg(this, '协办意见不能为空', 'warning');
        self.$emit('showAssistedCauseExecuteFunction');
      }
    },
    // 关闭发起协办弹窗
    handleClose() {
      this.$emit('close');
    },
    // 初始化方法
    init() {
      this.comment = '';
    }
  },
  mounted() {
    // 初始化
    this.init();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/assets/css/workFlow.scss';
::v-deep .workFlow-dialog {
  height: 521px;
  .el-dialog__body {
    padding: 15px 16px 0;
  }
  .assistedCause-dialog-body-right {
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
      @include bodyCommon;
      padding: 24px 30px;
      .assistedCause-dialog-body-row-x {
        display: flex;
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .assistedCause-dialog-body-row-left-x {
          width: 56px;
          margin-right: 12px;
          text-align: right;
        }
        .assistedCause-dialog-body-row-right-x {
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
      width: 662px;
      height: 389px;
      border: 1px #D5D9DC;
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
      top: 347px;
      height: 40px;
      width: calc(100% - 4px);
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
</style>
