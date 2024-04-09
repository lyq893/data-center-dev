<template>
  <base-drawer
    ref="drawerRef"
    v-if="showDrawer"
    :visible.sync="showDrawer"
    :open-type="openType"
    :close-on-press-escape="!firstEditPwd"
  >
    <template #title>
      <div class="title-content">
        <div class="title-text">
          <span>{{ $t('navbar.changPass') }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <el-form class="drawer-form" :model="form" :rules="rules" ref="form">
        <el-form-item :label="$t('navbar.oldPwd')" prop="oldPwd">
          <el-input class="jxd_ins_elInput default" v-model.trim="form.oldPwd" show-password :placeholder="$t('navbar.enterOld')" />
        </el-form-item>
        <el-form-item :label="$t('navbar.newPwd')" prop="newPwd">
          <el-input class="jxd_ins_elInput default" v-model.trim="form.newPwd" show-password :placeholder="$t('navbar.enterNew')" />
        </el-form-item>
        <el-form-item :label="$t('navbar.confirmPassword')" prop="confirmPwd">
          <el-input class="jxd_ins_elInput default" v-model.trim="form.confirmPwd" show-password :placeholder="$t('navbar.confirmPasswordAgain')" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="closeDrawer" class="drawer-btn-cancel" size="small" v-if="!firstEditPwd">{{ $t('common.cancel') }}</el-button>
      <el-button class="drawer-btn-save" @click="saveDrawer" size="small" type="primary" :loading="loading">{{ $t('common.save') }}</el-button>
    </template>
  </base-drawer>
</template>

<script>
import { hussarAxiosRequestUtils, HussarPasswordEncryption } from 'hussar-base';
import { userApi } from 'hussar-authorization';
import { baseDrawer } from 'hussar-common';

export default {
  name: 'EditPwd',
  data() {
    return {
      openType: 'isEdit',
      showDrawer: false,
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
      firstEditPwd: false
    };
  },
  components: {
    baseDrawer
  },
  computed: {
    // 表单验证规则
    rules() {
      const validatePass = (rule, value, callback) => {
        if (this.form.confirmPwd !== '') {
          this.$refs.form.validateField('confirmPwd');
        }
        callback();
      };
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
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      };
    }
  },
  methods: {
    openDrawer(value) {
      this.firstEditPwd = value;
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
      Object.assign(this.$data, this.$options.data());
    },
    saveDrawer() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.handleIds();
          hussarAxiosRequestUtils.postAction(userApi.AuthorityUserApi.changePwd, this.submitForm).then(res => {
            this.loading = false;
            const data = res.data;
            if (res.code === 10000) {
              if (data.success === true) {
                this.$message.success(this.$t('common.changedSuccessful'));
                this.closeDrawer();
              } else {
                this.editErrorMsg(data);
              }
            }
          }).catch(() => {
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
          // 按等级规则提示
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

</style>
