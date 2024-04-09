<template>
  <!--修改密码-->
  <el-dialog
    v-if="showfirstChangePwd"
    :visible.sync="showfirstChangePwd"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    :destroy-on-close="true"
    class="lcdp-dialog edit-pwd-dialog jxd_additional lcdp_axe"
    width="450px"
  >
    <template slot="title">
      <span class="el-dialog__title" style="display: block;">{{ $t('navbar.changPass') }}</span>
    </template>
    <el-form :model="form" :rules="pwdRules" ref="pwdForm" :label-width="labelWidth" class="secret-form">
      <el-form-item :label="$t('navbar.oldPwd')" prop="oldPwd">
        <el-input ref="oldPwd" class="jxd_ins_elInput default" v-model="form.oldPwd" show-password
                  :placeholder="$t('navbar.enterOld')"
        />
      </el-form-item>
      <el-form-item :label="$t('navbar.newPwd')" prop="newPwd">
        <el-input ref="newPwd" class="jxd_ins_elInput default" v-model="form.newPwd" show-password
                  :placeholder="$t('navbar.enterNew')"
        />
      </el-form-item>
      <el-form-item :label="$t('navbar.confirmPassword')" prop="confirmPwd">
        <el-input ref="confirmPwd" class="jxd_ins_elInput default" v-model="form.confirmPwd" show-password
                  :placeholder="$t('navbar.confirmPasswordAgain')"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer" style="height: 38px;line-height: 38px">
      <el-button class="jxd_ins_elButton default btn-save" type="primary" @click="savePwd">{{
        $t('common.save')
      }}
      </el-button></div>
  </el-dialog>
</template>

<script>
import { hussarAxiosRequestUtils, HussarPasswordEncryption } from 'hussar-base';
import { userApi } from 'hussar-authorization';

export default {
  name: 'FirstChangePwdDialog',
  data() {
    return {
      showfirstChangePwd: false,
      form: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      submitForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      }
    };
  },
  computed: {
    labelWidth() {
      return this.$t('navbar.formLabelWidth');
    },
    pwdRules() {
      const checkPwd = (rule, value, callback) => {
        const self = this;
        const { $el } = self.$refs.confirmPwd;
        let flag = false;
        let msg = self.$t('navbar.confirmPAgain');
        if (value === '') {
          flag = true;
        } else if (value !== this.form.newPwd) {
          flag = true;
          msg = self.$t('navbar.Inconsistent');
        }
        if (flag) {
          if ($el) {
            $el.classList.add('checkBad');
          }
          callback(new Error(msg));
        } else if ($el) {
          $el.classList.remove('checkBad');
          callback();
        }
      };
      const checkOldPwd = (rule, value, callback) => {
        const self = this;
        const { $el } = self.$refs.oldPwd;
        self.validCommon(value, $el, callback);
      };
      const checkNewPwd = (rule, value, callback) => {
        const self = this;
        const { $el } = self.$refs.newPwd;
        self.validCommon(value, $el, callback);
        if (this.form.confirmPwd !== '') {
          this.$refs.pwdForm.validateField('confirmPwd');
        }
      };
      return {
        oldPwd: [{ required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: checkOldPwd, trigger: 'blur' }],
        newPwd: [{ required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: checkNewPwd, trigger: 'blur' }],
        confirmPwd: [{ required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }]
      };
    }
  },
  methods: {
    openDialog() {
      this.showfirstChangePwd = true;
    },
    validCommon(value, $el, callback) {
      let flag = false;
      const msg = ' ';
      if (value === '') {
        flag = true;
      }
      if (flag) {
        if ($el) {
          $el.classList.add('checkBad');
        }
        callback(new Error(msg));
      } else if ($el) {
        $el.classList.remove('checkBad');
        callback();
      }
    },
    // 保存密码
    savePwd() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.handleIds();
          hussarAxiosRequestUtils.postAction(userApi.AuthorityUserApi.changePwd, this.submitForm).then(res => {
            this.loading = false;
            const data = res.data;
            if (res.code === 10000) {
              if (data.success === true) {
                this.$message.success(this.$t('common.changedSuccessful'));
                this.showfirstChangePwd = false;
                this.cancel();
              } else {
                this.editErrorMsg(res.data);
              }
            } else {
              this.$message.error(this.$t('common.changedUnsuccessful'));
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },
    handleIds() {
      // 密码加密
      const passwordEncryption = new HussarPasswordEncryption();
      this.submitForm.oldPwd = passwordEncryption.encrypt(this.form.oldPwd);
      this.submitForm.newPwd = passwordEncryption.encrypt(this.form.newPwd);
      this.submitForm.confirmPwd = passwordEncryption.encrypt(this.form.confirmPwd);
    },
    // 取 消
    cancel() {
      this.$emit('cancel');
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
      this.$message.error({
        dangerouslyUseHTMLString: true,
        message: '<span>' + msg + '</span>'
      });
    }
  }
};
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 30px 20px 6px;
}
.secret-form .jxd_ins_elInput.default {
  height: 32px;
  line-height: 36px;
}
.secret-form ::v-deep .el-form-item__label {
  width: 108px;
}
.secret-form ::v-deep .el-form-item__content {
  margin-left: 108px;
}
</style>
