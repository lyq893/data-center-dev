<!--对应事件【自由驳回】-->
<template>
  <el-dialog
    v-dialog-drag
    custom-class="workFlow-dialog"
    class="freeReject-dialog lcdp-dialog jxd_additional lcdp_axe theme-config-front"
    :visible.sync="freeRejectShow"
    title="自由驳回"
    width="694px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <!-- 意见输入框 -->
    <div class="freeReject-dialog-body">
      <div class="text-box">
        <el-input
          class="commentTextarea jxd_ins_elTextArea default"
          type="textarea"
          :rows="6"
          resize="none"
          maxlength="500"
          placeholder="请输入意见"
          v-model="comment"
        />
        <div class="bottom-info">
          <div class="total-text"><span>{{ totalText }}</span>/500个字</div>
          <div class="quick-comments">
            <!-- 快捷意见弹出层 -->
            <el-popover
              width="256"
              popper-class="popCls2"
              placement="bottom-start"
              height="184"
              v-model="visible"
            >
              <div class="quick-top" v-for="(item,index) in commentArr" :key="index" @click="electedComments(index)">
                <p>{{ item.commentInfo }}</p>
              </div>
              <div @click="visible = false; dialogVisible = true;" class="quick-center">
                <p>自定义设置</p>
              </div>
              <el-button type="text" slot="reference"><div class="quick-bottom">
                <div class="quick-bottom1" />快捷意见</div></el-button>
            </el-popover>
          </div>
        </div>
      </div>
      <!-- 驳回节点 -->
      <div class="text selectType">
        <span>驳回节点：</span>
        <div>
          <el-radio v-model="rejectType" label="initial">驳回至第一节点</el-radio>
          <el-radio v-model="rejectType" label="prev">驳回至上一节点</el-radio>
          <el-radio v-model="rejectType" label="any">驳回至任意节点</el-radio>
          <div class="anyRejectDiv" v-if="rejectNodeShow">
            <el-checkbox-group v-model="rejectNodeCheckList">
              <el-checkbox class="jxd_ins_elCheckBox default" v-for="(item,index) in rejectNodes" :key="index" :label="index">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button class="jxd_ins_elButton default dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="jxd_ins_elButton default dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
    <!-- 自定义设置意见弹窗 -->
    <el-dialog
      v-dialog-drag
      custom-class="workFlow-dialog zidingyi"
      class="freeReject-dialog lcdp-dialog jxd_additional lcdp_axe"
      title="自定义设置"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="420px"
    >
      <!-- 新建意见 -->
      <div class="zdy-top">
        <div v-show="pressDisabled" style="cursor:not-allowed;">+新建</div>
        <div v-show="!pressDisabled" @click="press" style="cursor:pointer;">+新建</div>
        <p>{{ commentArr.length }}/5</p>
      </div>
      <!-- 自定义意见列表 -->
      <div class="boder">
        <div v-for="(item,index) in commentArr" :key="item.id" class="zdy-bottom" @dblclick="modify(index)">
          <div v-show="textarea !=index" class="zdy-bottom-top" style="cursor:pointer; padding:0 14px;">
            <p style="line-height: 30px; width: 348px; text-overflow: ellipsis; overflow: hidden; white-space:nowrap; padding-right: 14px;">{{ item.commentInfo }}</p>
            <p class="delete" @click="clear(index)" />
          </div>
          <!-- 修改意见 -->
          <div v-show="textarea === index">
            <el-input
              class="jxd_ins_elTextArea lay-textarea default input_width"
              ref="editText"
              type="textarea"
              resize="none"
              @blur="done(index)"
              maxlength="100"
              :autosize="{ minRows: 1, maxRows: 2 }"
              v-model="textareaMess"
            />
          </div>
        </div>
        <!-- 新增意见 -->
        <el-input
          class="jxd_ins_elTextArea lay-textarea default input_width"
          ref="input"
          @blur="done"
          v-show="inputShow"
          type="textarea"
          resize="none"
          maxlength="100"
          :autosize="{ minRows: 1, maxRows: 2 }"
          v-model="inputMess"
        />
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { hussarRequest, hussarAxiosRequestUtils } from 'hussar-base';
import * as flowApi from '@/api/flow/flowApis';
import * as HussarRouter from '@/utils/HussarRouter';

import { workFlowApi } from '@/api/flow/workFlowApi';

export default {
  name: 'FreeReject',
  props: {
    freeRejectShow: Boolean,
    flowEventData: Object,
    taskId: String
  },
  data() {
    return {
      // 自定义意见列表
      commentArr: [],
      // 前端自定义意见列表数据量
      addNumber: 0,
      dataLength: 0,
      // 意见内容
      comment: '',
      rejectType: 'initial',
      // 控制驳回任意节点显隐
      rejectNodeShow: false,
      // 任意节点列表
      rejectNodes: [],
      // 选中的驳回节点
      rejectNodeCheckList: [],
      noDataText: '',
      // 总字数
      totalText: 0,
      // 控制快捷意见popover显隐
      visible: false,
      // 控制自定义意见弹窗显隐
      dialogVisible: false,
      // 新增意见
      inputMess: '',
      // 新增意见显隐
      inputShow: false,
      // textarea初始隐藏
      textarea: 999,
      // 修改意见内容
      textareaMess: '',
      pressDisabled: false
    };
  },
  watch: {
    // 父组件传参
    freeRejectShow: {
      handler(n) {
        // 每次打开自由驳回弹窗时，初始化数据
        if (n) {
          this.init();
        }
      },
      deep: true
    },
    // 监控驳回那一节点
    rejectType: {
      handler(n) {
        if (n === 'any') {
          console.log('zoul0');
          this.rejectNodesCopy = [];
          this.rejectNodeShow = true;
        } else {
          this.rejectNodeShow = false;
        }
      },
      deep: true
    },
    // 监控自由驳回显隐
    rejectNodeShow: {
      handler(n) {
        if (n) {
          this.getRejectNode();
        }
      },
      deep: true
    },
    // 监控意见
    comment() {
      this.totalText = this.comment.length;
    },
    // 监控修改意见
    textareaMess() {
      if (this.textareaMess.length === 100) {
        HussarRouter.showMsg(this, '自定义意见长度限制100', 'warning');
      }
    },
    // 监测新增意见
    inputMess() {
      if (this.inputMess.length === 100) {
        HussarRouter.showMsg(this, '自定义意见长度限制100', 'warning');
      }
    }
  },
  methods: {
    // 获取驳回任意节点列表数据
    getRejectNode() {
      const self = this;
      const taskId = this.taskId;
      function queryRejectNode(data) {
        return hussarRequest.get(workFlowApi.queryRejectNode, data);
      }
      const data = {
        taskId
      };
      console.log(taskId);
      if (taskId) {
        queryRejectNode(data).then(res => {
          console.log(res);
          if (res.code === '1') {
            const result = res.result;
            self.rejectNodes = [];
            result.forEach((val) => {
              self.rejectNodes.push({
                value: val.id,
                name: val.name
              });
              console.log(self.rejectNodes);
            });
          } else {
            HussarRouter.showMsg(this, res.msg, 'error');
          }
        }).catch(function() {
          HussarRouter.showMsg(this, '驳回节点数据请求异常', 'error');
        });
      }
    },
    // 确认驳回
    handleSave() {
      const self = this;
      const flowEventDataCopy = { ...this.flowEventData };
      const url = flowEventDataCopy.url;
      const pageCloseBoolean = flowEventDataCopy.pageCloseBoolean;
      const changePagePath = flowEventDataCopy.changePagePath;
      flowEventDataCopy.comment = this.comment;
      flowEventDataCopy.type = this.rejectType;
      if (this.rejectNodeCheckList.length > 0) {
        flowEventDataCopy.rejectNode = '';
        this.rejectNodeCheckList.forEach((item) => {
          flowEventDataCopy.rejectNode = flowEventDataCopy.rejectNode + ',' + this.rejectNodes[item].value;
        });
        flowEventDataCopy.rejectNode = flowEventDataCopy.rejectNode.slice(1);
      }
      if (this.rejectType === 'any' && this.rejectNodeCheckList.length == 0) {
        HussarRouter.showMsg(this, '请选择驳回节点', 'warning');
        self.$emit('freeRejectExecuteFunction');
      } else {
        const loading = self.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        flowApi.freeReject(url, flowEventDataCopy).then(res => {
          if (res.code === 200 || res.code === 10000) {
            const pathObj = {
              path: changePagePath,
              query: {
                refresh: true
              }
            };
            HussarRouter.returnPage(self, pathObj, 2, pageCloseBoolean);
            self.$emit('freeRejectExecuteFunction');
            HussarRouter.showMsg(this, '驳回成功', 'success');
          } else {
            HussarRouter.showMsg(this, res.msg, 'error');
          }
          loading.close();
          this.handleClose();
        }).catch((error) => {
          HussarRouter.showMsg(this, error.msg || '驳回请求异常', 'error');
          loading.close();
          this.handleClose();
        });
      }
    },
    // 关闭自由驳回弹窗
    handleClose() {
      this.rejectNodeCheckList = [];
      this.$emit('close');
    },
    // 点击快捷意见赋值意见
    electedComments(index) {
      this.comment = this.commentArr[index].commentInfo;
      this.visible = false;
    },
    // 新增意见
    press() {
      this.pressDisabled = true;
      if (this.addNumber >= 5 || this.commentArr.length >= 5) {
        HussarRouter.showMsg(this, '自定义意见已满，请删除一条数据', 'error');
        return;
      } else {
        this.addNumber += 1;
      }
      this.inputShow = true;
      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs.input.focus();
      });
    },
    // 修改意见
    modify(index) {
      this.textarea = index;
      this.textareaMess = this.commentArr[index].commentInfo;
      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs.editText[index].focus();
      });
    },
    // 失去焦点验证并提交
    done(index) {
      let data;
      if ((this.inputMess === '' || this.inputMess.replace(/(^\s*)|(\s*$)/g, '') === '') &&
            (this.textareaMess === '' || this.textareaMess.replace(/(^\s*)|(\s*$)/g, '') === '')) {
        this.inputShow = false;
        this.pressDisabled = false;
        this.addNumber -= 1;
        this.inputMess = '';
        this.textarea = 999;
        return;
      }
      if (this.textareaMess !== '') {
        data = {
          id: this.commentArr[index].id,
          commentInfo: this.textareaMess,
          commentType: 1
        };
        if (this.textareaMess.length !== this.commentArr[index].commentInfo.length) {
          this.getComments(data, index);
        } else {
          this.textareaMess = '';
          this.inputMess = '';
          this.textarea = 999;
        }
      } else {
        data = {
          commentInfo: this.inputMess,
          commentType: 1
        };
        this.getComments(data, index);
      }
      this.inputShow = false;
    },
    // 获取快捷意见数据
    getComments(data, index) {
      hussarAxiosRequestUtils.postAction(workFlowApi.saveOrUpdate, data).then(res => {
        if (res.code === 10000) {
          if (Object.keys(data).length === 2) {
            this.getcommentArr();
            HussarRouter.showMsg(this, '新增成功', 'success');
          } else {
            this.commentArr[index].commentInfo = this.textareaMess;
            HussarRouter.showMsg(this, '修改成功', 'success');
          }
          this.textareaMess = '';
          this.inputMess = '';
          this.textarea = 999;
          this.pressDisabled = false;
        }
      });
    },
    getcommentArr() {
      const self = this;
      const data = {
        commentType: '1',
        size: 5,
        current: 1
      };
      hussarAxiosRequestUtils.getAction(workFlowApi.queryByPage, data).then(res => {
        if (res.code === 10000) {
          self.dataLength = res.data.records.length;
          self.commentArr = [];
          if (self.dataLength !== 0) {
            self.commentArr = res.data.records;
          }
          if (self.commentArr.length === 0) {
            self.noDataText = '暂无常用意见';
          }
        } else {
          HussarRouter.showMsg(this, '请求字典数据失败', 'error');
          self.noDataText = '暂无常用意见';
        }
      }).catch(() => {
        HussarRouter.showMsg(this, '请求字典数据异常', 'error');
        self.noDataText = '暂无常用意见';
      });
    },
    // 删除自定义意见
    clear(index) {
      hussarAxiosRequestUtils.postAction(workFlowApi.delete, this.commentArr[index].id).then(res => {
        if (res.code === 10000) {
          HussarRouter.showMsg(this, '删除成功', 'success');
          this.commentArr.splice(index, 1);
          this.addNumber -= 1;
          this.pressDisabled = false;
        }
      });
    },
    // 初始化方法
    init() {
      this.commentArr = [];
      this.dataLength = 0;
      this.commentShowText = '展开';
      this.commentShow = false;
      this.comment = '';
      this.rejectType = 'initial';
      this.rejectNodeShow = false;
      this.rejectNodes = [];
      this.rejectNodesCopy = [];
      this.noDataText = '';
      const self = this;
      const data = {
        commentType: '1',
        size: 5,
        current: 1
      };
      hussarAxiosRequestUtils.getAction(workFlowApi.queryByPage, data).then(res => {
        // console.log(res.data.records)
        if (res.code === 10000) {
          self.dataLength = res.data.records.length;
          self.commentArr = [];
          if (self.dataLength !== 0) {
            self.commentArr = res.data.records;
            self.addNumber = res.data.records.length;
          }
          if (self.commentArr.length === 0) {
            self.noDataText = '暂无常用意见';
          }
        } else {
          HussarRouter.showMsg(this, '请求字典数据失败', 'error');
          self.noDataText = '暂无常用意见';
        }
      }).catch(() => {
        HussarRouter.showMsg(this, '请求字典数据异常', 'error');
        self.noDataText = '暂无常用意见';
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .popCls2 {
    padding: 4px 0 0;
  }
  .quick-top p{
    padding: 0 12px;
    height: 32px;
    width: 100%;
    text-overflow: ellipsis; overflow: hidden; white-space:nowrap;
    line-height: 30px;
    &:hover {
      background: var(--c-lightColor);
      cursor: pointer;
    }
  }
  .quick-center {
    text-align: left;
    height: 40px;
    display: flex;
    align-items: center;
    border-top: 1px solid #E0E0E0;
    p {
      cursor: pointer;
      height: 32px;
      padding: 0 12px;
      width: 100%;
      text-overflow: ellipsis; overflow: hidden; white-space:nowrap;
      line-height: 30px;
      &:hover {
        background: var(--c-lightColor);
        cursor: pointer;
    }
    }

  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .input_width {
    height: 22px;
    width: 100%;
  }
  @import '~@/assets/css/workFlow.scss';
  ::v-deep .workFlow-dialog {
    height: 521px;
    .el-dialog__body {
      padding: 15px 16px 0;
      overflow-x: hidden;
      height: calc(100% - 94px);
    }
    .el-dialog__body{
      position: relative;
      .commentTextarea .el-textarea__inner{
        height: 240px;
        padding: 10px 15px 40px 15px;
      }
      .el-radio__label{
        line-height: 25px !important;
      }
      .el-radio__inner:hover{
        border-color: var(--c-themeColor);
      }
      .anyRejectDiv{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        min-height: 40px;
        border: 1px solid #E7E7E7;
        margin-top: 6px;
        padding: 0 0 0 20px;
        box-sizing: border-box;
        .el-checkbox-group {
          display: flex;
          line-height: 40px;
          flex-wrap: wrap;
          align-items: center;
          >label {
            margin-right: 25px !important;
            display: flex;
            align-items: center;
            min-height: 40px;
            width: auto;
          }
          .el-checkbox {
            line-height: 40px;
          }
          .el-checkbox__label {
            display: inline-block;
            word-break: break-word;
            width: auto;
            white-space: pre-wrap;
          }
        }
      }
    }
    .selectType{
      margin-top: 160px;
      width: 100%;
      overflow: hidden;
      display: flex;
      >span {
        width: 70px;
      }
      >div {
        width: calc(100% - 95px);
        display: flex;
        flex-direction: column;
        margin-left: 25px;
        margin-bottom: 0;
        >.el-radio:not(:nth-child(3)) {
          margin-bottom: 12px;
        }
      }
    }
    .text-box {
      position: relative;
      .bottom-info {
        position: absolute;
        background: #fff;
        width: calc(100% - 2px);
        height: 40px;
        padding: 0 14px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        left: 1px;
        bottom: -149px;
        border-radius: 4px;
      }
    }
    .total-text{
      color:#999999;
    }
    .quick-comments{
      .quick-bottom{
        display: flex;
        color: #4A4C66;
        .quick-bottom1{
          width: 12px;
          height: 13px;
          margin-right: 6px;
          background-image: url('~@/assets/icon/quick-comments.svg');
          background-size: 12px 13px;
        }
      }
      .quick-bottom:hover{
        color:#045340;
      }
      .quick-bottom:hover .quick-bottom1{
        background-image: url('~@/assets/icon/quick-comments1.svg');
      }
    }
  }
  ::v-deep .zidingyi{
    height: 266px;
    .el-dialog__title{
      font-size: 14px;
    }
    .zdy-top{
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .delete{
      display: none;
    }
    .zdy-bottom{

      .zdy-bottom-top{
          display: flex;
          justify-content: space-between;
      }
    }
    .zdy-bottom:hover{
      background: var(--c-lightColor);
      .delete{
        display: block;
        width: 16px;
        height: 16px;
        background-image: url('~@/assets/icon/delete.svg');
        margin-top: 5px
      }
    }
    .el-dialog__body{
      height: 220px;
      padding: 24px 20px 0;
    }
    .boder{
      padding-top: 3px;
      width: 388px;
      height: 156px;
      border: 1px solid #E7E7E7;
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
.lcdp-dialog ::v-deep .el-radio__input.is-checked .el-radio__inner{
  border-color: var(--c-themeColor);
  background-color: #ffffff;
}
.lcdp-dialog ::v-deep .el-radio__input.is-checked .el-radio__inner::after{
  background-color: var(--c-themeColor);
  width: 8px;
  height: 8px
}
.lcdp-dialog ::v-deep .el-radio__input .el-radio__inner {
  font-size: 14px;
  width: 14px;
  height: 14px
}

.lcdp_axe.theme-config-front /deep/ .dialog-cancel :hover{
  color: #fff;
  background: var(--c-themeColor);
}
.jxd_additional.lcdp_axe .jxd_ins_elButton.default:hover:not(.is-disabled){
  color:  #FFF !important;
}
.lcdp_axe.theme-config-front ::v-deep .commentTextarea.jxd_ins_elTextArea.default.el-textarea {
  width: 100%;
}
.lcdp_axe.theme-config-front ::v-deep .workFlow-dialog .quick-comments .quick-bottom:hover {
    color: var(--c-themeColor) !important;
}
.lcdp-dialog .freeReject-dialog-body .quick-comments .el-button{
  width: 76px !important;
}
</style>
