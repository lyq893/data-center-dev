<!--对应事件【驳回至任意节点】，勾选【指定驳回节点】配置项-->
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
          <el-checkbox v-for="(item,index) in rejectNodeOptions" :key="index" :label="index">{{ item.name }}</el-checkbox>
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
    doneListIdentification: String
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
            console.log('result', result);
            // if (result instanceof Array && result.length > 0) {
            // self.rejectNodeValue = result[0].id;
            // }
            self.rejectNodeOptions = [];
            result.forEach((val) => {
              self.rejectNodeOptions.push({
                value: val.id,
                name: val.name
              });
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
      if (this.rejectNodeCheckList.length > 0) {
        this.rejectNodeValue = '';
        this.rejectNodeCheckList.forEach((item) => {
          this.rejectNodeValue = this.rejectNodeValue + ',' + this.rejectNodeOptions[item].value;
        });
        this.rejectNodeValue = this.rejectNodeValue.slice(1);
      } else {
        HussarRouter.showMsg(this, '请选择驳回节点', 'warning');
      }
      // console.log(this.radio)
      // this.rejectNodeValue= this.rejectNodeOptions[this.radio].value,
      // console.log("value", this.rejectNodeOptions[this.radio].value)
      this.$emit('save', {
        rejectNode: this.rejectNodeValue
      });
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
    }
  }
};
</script>

<style>
  /* .selectRejectNodeDialogVisible .el-dialog__body { */
    /* border-bottom: 1px solid #eeeeee; */
  /* } */
  /* .selectRejectNode-dialog-body-row { */
    /* width: 100%; */
    /* height: 34px; */
  /* } */
  /* .selectRejectNode-dialog-body-row-left { */
    /* width: 35%; */
    /* float: left; */
    /* margin-right: 5%; */
    /* line-height: 34px; */
    /* text-align: right; */
    /* height: 34px; */
  /* } */
  /* .selectRejectNode-dialog-body-row-right { */
    /* width: 60%; */
    /* float: left; */
    /* text-align: center; */
    /* height: 34px; */
  /* } */
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
          .el-checkbox__inner {
            width: 14px;
            height: 14px;
          }
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
