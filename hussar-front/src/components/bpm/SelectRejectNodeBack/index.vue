<!--对应页面【驳回节点】组件，组件-基础-流程-驳回节点-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择驳回节点"
    :visible="selectRejectNodeShow"
    custom-class="workFlow-dialog"
    class="selectRejectNodeDialogVisible lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    width="420px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="selectRejectNode-dialog-body">
      <div class="selectRejectNode-dialog-body-row">
        <el-checkbox-group v-model="rejectNodeCheckList" class="jxd_ins_elCheckBoxGroup default">
          <el-checkbox class="jxd_ins_elCheckBox default" v-for="(item,index) in rejectNodeOptions" :key="index" :label="item.value">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarRequest } from 'hussar-base';
import * as HussarRouter from '@/utils/HussarRouter';

export default {
  name: 'SelectRejectNode',
  props: {
    selectRejectNodeShow: Boolean,
    taskId: String,
    doneListIdentification: String,
    selectData: Array
  },
  data() {
    return {
      // 驳回节点数组
      rejectNodeOptions: [],
      rejectNodeValue: '',
      // 选中的驳回节点
      rejectNodeCheckList: []
    };
  },
  methods: {
    rejectNodeDataLoad() {
      const self = this;
      const taskId = this.taskId;
      function queryRejectNode(data) {
        return hussarRequest.get('/bpm/publicProcess/queryRejectNode', data);
      }
      const data = {
        taskId
      };
      if (taskId) {
        queryRejectNode(data).then(res => {
          if (res.code === '1') {
            const result = res.result;
            self.rejectNodeOptions = [];
            result.forEach((val) => {
              self.rejectNodeOptions.push({
                value: val.id,
                name: val.name
              });
            });
            this.rejectNodeCheckList = [];
            this.selectData.forEach(item => {
              this.rejectNodeCheckList.push(item.value);
            });
          } else {
            if (self.doneListIdentification === '0') {
              HussarRouter.showMsg(this, res.msg, 'error');
            }
          }
        }).catch(function() {
          HussarRouter.showMsg(this, '驳回节点数据请求异常', 'error');
        });
      }
    },
    // 关闭
    handleClose() {
      this.rejectNodeCheckList = [];
      this.$emit('close');
    },
    // 提交
    handleSave() {
      const arr = [];
      const self = this;
      if (this.rejectNodeCheckList.length === 0) {
        HussarRouter.showMsg(self, '请选择驳回节点', 'warning');
      } else {
        this.rejectNodeCheckList.forEach(item => {
          const its = this.rejectNodeOptions.filter(it => it.value === item);
          arr.push(...its);
        });
      }
      this.$emit('save', arr);
    }
  },
  watch: {
    selectRejectNodeShow: {
      handler(n) {
        if (n) {
          this.rejectNodeDataLoad();
        }
      },
      deep: true
    },
    selectData: {
      handler(n) {
        if (n) {
          this.rejectNodeCheckList = [];
          n.forEach(item => {
            this.rejectNodeCheckList.push(item.value);
          });
        }
      },
      deep: true
    }
  }
};
</script>

<style>
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/assets/css/workFlow.scss';
  ::v-deep .workFlow-dialog {
    height: 266px;
    .el-dialog__body {
      padding: 16px 34px 0 34px;
      .el-radio__inner{
        margin-left: -15px;
      }
      .el-radio__label{
        line-height: 25px !important;
      }
    }
    .jxd_ins_elCheckBoxGroup.default .el-checkbox {
      height: auto;
      line-height: 20px;
      margin-bottom: 12px;
      font-family: PingFangSC-Regular;
      &:last-of-type {
        margin-right: 30px !important;
      }
    }
  }
  ::v-deep .selectRejectNode-dialog-body {
    .jxd_ins_elCheckBoxGroup.el-checkbox-group {
      width: 100%;
      height: 20px;
      line-height: 20px;
      display: flex;
      flex-wrap: wrap;
      >label {
        display: flex;
        width: auto;
        >.el-checkbox__input {
          line-height: 14px;
        }
        .el-checkbox__label {
          margin-left: 4px;
          display: inline-block;
          word-break: break-word;
          width: auto;
          white-space: pre-wrap;
          line-height: 14px;
        }
      }
    }
  }
  ::v-deep .selectRejectNode-dialog-body-row  label {
    margin-right: 16px!important;
  }
  ::v-deep .selectRejectNode-dialog-body-row {
    display: flex;
    align-items: center;
    width: 100%;
    &:not(:last-child) {
      margin-bottom: 0px;
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
.lcdp_axe.theme-config-front /deep/ .dialog-cancel :hover{
  color: #fff;
}
.jxd_additional.lcdp_axe .jxd_ins_elButton.default:hover:not(.is-disabled){
  color:  #FFF !important;
}

</style>
