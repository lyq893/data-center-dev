<!--修改密码，此文件暂时废弃-->
<template>
  <div class="flex flex-col drawer-height lcdp_axe jxd_additional theme-config-change-pwd">
    <div class="drawer-title-box flex flex-up-down">
      <div class="title-content">
        <div class="title-text">
          <span>{{ $t('navbar.changPass') }}</span>
        </div>
      </div>
    </div>
    <div class="line" />
    <div class="form-box" style="flex-grow: 1">
      <el-form class="drawer-form" :model="form" :rules="rules" ref="pwdForm" :label-width="labelWidth">
        <el-form-item :label="$t('navbar.oldPwd')" prop="oldPwd">
          <el-input class="jxd_ins_elInput default" v-model="form.oldPwd" show-password :placeholder="$t('navbar.enterOld')" />
        </el-form-item>
        <el-form-item :label="$t('navbar.newPwd')" prop="newPwd">
          <el-input class="jxd_ins_elInput default" v-model="form.newPwd" show-password :placeholder="$t('navbar.enterNew')" />
        </el-form-item>
        <el-form-item :label="$t('navbar.confirmPassword')" prop="confirmPwd">
          <el-input class="jxd_ins_elInput default" v-model="form.confirmPwd" show-password :placeholder="$t('navbar.confirmPasswordAgain')" />
        </el-form-item>
      </el-form>
    </div>

    <div class="line" />
    <div class="bottom-box">
      <div class="btn-box">
        <el-button @click="cancel" class="jxd_ins_elButton default change-pwd-cancel" size="small">{{ $t('common.cancel') }}</el-button>
        <el-button class="jxd_ins_elButton default lay-btn button_additional" @click="save" size="small">{{ $t('common.save') }}</el-button>
      </div>
    </div>
  </div>

</template>

<script>
// import { authorityUser } from "hussar-authorization'
import { hussarAxiosRequestUtils, HussarPasswordEncryption } from 'hussar-base';
import { userApi } from 'hussar-authorization';

export default {
  data() {
    return {
      form: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      submitForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      publicKey: '',
      loading: false,
      formLabelWidth: ''
    };
  },
  computed: {
    labelWidth() {
      return this.formLabelWidth;
    },
    // 表单验证规则
    rules() {
      const checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('navbar.confirmPAgain')));
        } else if (value !== this.form.newPwd) {
          callback(new Error(this.$t('navbar.Inconsistent')));
        } else {
          callback();
        }
      };
      return {
        oldPwd: [
          { required: true, message: '此项为必填项', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '此项为必填项', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      };
    }
  },
  methods: {

    // 取 消
    cancel() {
      this.$emit('cancel');
    },

    // 保存
    save() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.handleIds();
          hussarAxiosRequestUtils.postAction(userApi.AuthorityUserApi.changePwd, this.submitForm).then(res => {
            this.loading = false;
            const data = res.data;
            if (res.code === 10000) {
              if (data.success === true) {
                this.$message.success(this.$t('common.changedSuccessful'));
                this.cancel();
              } else {
                this.editErrorMsg(data);
              }
            }
          }).catch(res => {
            this.loading = false;
          });
        }
      });
    },
    editErrorMsg(data) {
      let msg = '';
      // 不符合密码规则
      if (data.error === 'unmatchedHintMark') {
        // 是否是自定义的规则
        // 默认提示
        if (data.hintMark === 'defaultRule') {
          msg = this.$t('resetPassword.messages.' + data.hintMark);
        } else if ((data.hintMark === 'customRule')) {
          // 自定义提示
          msg = data.msg;
        } else {
          const pwdRule = data.pwdRule;
          const ruleArr = pwdRule.split(',');
          // 最小长度
          const minLength = ruleArr[0];
          // 最大长度
          const maxLength = ruleArr[1];
          // 密码等级
          const level = ruleArr[2];
          msg = this.$t('resetPassword.messages.customRuleMinLen') + minLength +
              this.$t('resetPassword.messages.customRuleMaxLen') + maxLength +
              this.$t('resetPassword.messages.customRuleLevel') + level +
              this.$t('resetPassword.messages.customRuleReq');
          switch (parseInt(level)) {
            case 1:
              msg += '  <br>' + this.$t('resetPassword.messages.customLevelOne');
              break;
            case 2:
              msg += '  <br>' + this.$t('resetPassword.messages.customLevelTwo');
              break;
            case 3:
              msg += '  <br>' + this.$t('resetPassword.messages.customLevelThree');
              break;
            default:
              break;
          }
        }
      } else if (data.error === 'resetFailPwdNotSame') {
        msg = this.$t('common.updateFailPwdNotSame');
      } else if (data.error === 'updateFailPwdNotUser') {
        msg = this.$t('common.updateFailPwdNotUser');
      } else if (data.error === 'updateFailPwdNotOld') {
        msg = this.$t('common.updateFailPwdNotOld');
      } else if (data.error === 'updateFailPwdNotDefault') {
        msg = this.$t('common.updateFailPwdNotDefault');
      } else if (data.error === 'updateFail') {
        msg = this.$t('common.updateFail1') + data.repeatTime + this.$t('common.updateFail2');
      } else {
        msg = this.$t('common.operation UnSuccessful');
      }
      this.$message.error({ dangerouslyUseHTMLString: true, message: '<span>' + msg + '</span>' });
    },
    handleIds() {
      // 密码加密
      const passwordEncryption = new HussarPasswordEncryption();
      this.submitForm.oldPwd = passwordEncryption.encrypt(this.form.oldPwd);
      this.submitForm.newPwd = passwordEncryption.encrypt(this.form.newPwd);
      this.submitForm.confirmPwd = passwordEncryption.encrypt(this.form.confirmPwd);
    }
  }
};
</script>

<style scoped>
.editBtn-bottoms { position: absolute;bottom: 15px;height: 46px;width: calc(100% - 40px); text-align: right;}

/* 取消按钮 */
.lcdp_axe.jxd_additional .change-pwd-cancel {
  background-color: #FFF;
  color: var(--c-themeColor);
  border: 1px solid var(--c-themeColor);
}
.lcdp_axe.jxd_additional.theme-config-change-pwd .change-pwd-cancel :hover{
  color: #fff;
}
.lcdp_axe.jxd_additional.theme-config-change-pwd .change-pwd-cancel:hover:not(.is-disabled){
  color:  #FFF !important;
}
/* 输入框字体大小 */
.lcdp_axe.jxd_additional.theme-config-change-pwd ::v-deep .el-input__inner{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', Alibaba-PuHuiTi-Regular,PingFang,tahoma,'arial', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
}
.lcdp_axe.jxd_additional.theme-config-change-pwd ::v-deep .drawer-form .el-input__inner:hover,
.lcdp_axe.jxd_additional.theme-config-change-pwd ::v-deep .drawer-form .el-input__inner:focus {
  border-color : var(--c-themeColor) !important;
}
.lcdp_axe.jxd_additional.theme-config-change-pwd ::v-deep .jxd_ins_elButton {
  width: 80px;
  height: 32px;
  border-radius: 3px;
  padding: 6px 6px;
  font-weight: 400;
  margin-left: 16px;
  font-size: 14px;
  line-height: 1;
}
.lcdp_axe.jxd_additional.theme-config-change-pwd ::v-deep  .el-form-item.is-error .el-input__inner{
  border-color: var(--c-checkBadColor);
}
.lcdp_axe.jxd_additional.theme-config-change-pwd ::v-deep  .el-form-item.is-error .el-form-item__error{
  color: var(--c-checkBadColor);
}
</style>
