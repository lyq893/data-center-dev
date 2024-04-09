<template>
  <div class="pwdMain">
    <el-row class="form">

      <el-col :offset="8" :span="8">

        <div v-if="isShow.div1">
          <el-form :model="form1" :rules="rules" ref="accountForm">
            <el-form-item :label-width="labelWidth" :label="$t('navbar.loginAccount')" prop="account">
              <el-input :placeholder="$t('userManage.loginText')" v-model.trim="form1.account" name="account" />
            </el-form-item>
            <el-form-item :label-width="labelWidth" label="验证码" prop="kaptcha">
              <el-input
                type="text"
                v-model="form1.kaptcha"
                name="kaptcha"
                placeholder="请输入验证码"
                @blur="checkKaptcha()"
              >
                <template slot="append">
                  <img style="width: 80px; height: 34px;cursor: pointer;" :src="kaptchaUrl" @click="getKaptcha"></template>
              </el-input>

            </el-form-item>
            <div class="editBtn-bottoms">
              <el-button @click="cancel" class="forgetPaw btn-cancel">{{ $t('common.cancel') }}</el-button>
              <el-button @click="stepOne" class="forgetPaw-save btn-save" type="primary" style="margin-left: 10px">{{ $t('login.forgetPwd.next') }}</el-button>
            </div>
          </el-form>
        </div>

        <div v-if="isShow.div2">
          <el-form :model="form2" :rules="rules" ref="answerForm">
            <el-form-item :label-width="labelWidth" :label="$t('login.forgetPwd.question')">
              <el-input disabled :placeholder="$t('login.forgetPwd.enterQuestion')" v-model="form2.question" />
            </el-form-item>
            <el-form-item :label-width="labelWidth" :label="$t('login.forgetPwd.answer')" prop="answer">
              <el-input :placeholder="$t('login.forgetPwd.enterAnswer')" v-model.trim="form2.answer" />
            </el-form-item>
            <div class="editBtn-bottoms">
              <el-button @click="cancel" class="forgetPaw btn-cancel">{{ $t('common.cancel') }}</el-button>
              <el-button @click="stepTwo" class="forgetPaw-save btn-save" type="primary" style="margin-left: 10px">{{ $t('login.forgetPwd.next') }}</el-button>
            </div>
          </el-form>
        </div>

        <div v-if="isShow.div3">
          <el-form :model="form3" :rules="rules" ref="pwdForm">
            <el-form-item :label-width="labelWidth2" :label="$t('login.forgetPwd.newPwd')" prop="newPwd">
              <el-input :placeholder="$t('login.forgetPwd.enterNewPwd')" show-password v-model="form3.newPwd" />
            </el-form-item>
            <el-form-item :label-width="labelWidth2" :label="$t('login.forgetPwd.confirmPwd')" prop="checkPwd">
              <el-input :placeholder="$t('login.forgetPwd.enterConfirmPwd')" show-password v-model="form3.checkPwd" />
            </el-form-item>
            <div class="editBtn-bottoms">
              <el-button @click="cancel" class="forgetPaw btn-cancel">{{ $t('common.cancel') }}</el-button>
              <el-button @click="stepThree" class="forgetPaw-save btn-save" type="primary" style="margin-left: 10px">{{ $t('common.save') }}</el-button>
            </div>
          </el-form>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
// import {getQues, checkAnswer, resetPwd} from '@/api/authority/forgetPwd'
import { hussarAxiosRequestUtils, HussarPasswordEncryption } from 'hussar-base';
import { ForgetPwdApi } from '@/api/authority/forgetPwdApi';
import { LoginApi } from '@/api/loginApi';
import { v1 as uuid } from 'uuid';

export default {
  name: 'ForgetPwd',
  data() {
    return {
      kaptchaUrl: '',
      isShow: {
        div1: true,
        div2: false,
        div3: false
      },
      form1: {
        account: '',
        kaptcha: '',
        kaptchasuffix: ''
      },
      form2: {
        userId: '',
        question: '',
        answer: ''
      },
      form3: {
        newPwd: '',
        checkPwd: ''
      },
      publicKey: '',
      loading: false,
      labelWidth2: '146px'
    };
  },
  computed: {
    labelWidth() {
      return this.$t('organRule.formLabelWidth');
    },
    // 表单验证规则
    rules() {
      const validatePass = (rule, value, callback) => {
        if (this.form3.checkPwd !== '') {
          this.$refs.pwdForm.validateField('checkPwd');
        }
        callback();
      };
      const checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('navbar.confirmPAgain')));
        } else if (value !== this.form3.newPwd) {
          callback(new Error(this.$t('navbar.Inconsistent')));
        } else {
          callback();
        }
      };
      return {
        account: [
          { required: true, message: '此项为必填项', trigger: 'blur' }
        ],
        kaptcha: [
          { required: true, message: '此项为必填项', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '此项为必填项', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPwd: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      };
    }
  },
  created() {
    this.getKaptcha();
  },
  methods: {
    checkKaptcha() {
      if (this.form1.kaptcha === '') {
        this.$message.error('验证码不能为空！');
      }
    },
    getKaptcha() {
      var api = window.baseUrl;
      const randomUuid = uuid();
      this.form1.kaptchasuffix = randomUuid;
      this.kaptchaUrl = api + LoginApi.getKaptchaUrl + '?t=' + new Date().getTime() + '&kaptchasuffix=' + randomUuid;
    },
    // 第一步，查询此用户的密保
    stepOne() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          hussarAxiosRequestUtils.getAction(ForgetPwdApi.getQuesByKaptcha, { userAccount: this.form1.account, kaptcha: this.form1.kaptcha, kaptchasuffix: this.form1.kaptchasuffix }).then(res => {
            if (res.code === 10000) {
              this.form2 = res.data;
              this.hideAll();
              this.isShow.div2 = true;
            }
          }).catch(() => {
            this.getKaptcha();
          });
        }
      });
    },
    // 第二步，验证用户输入的密保答案是否正确
    stepTwo() {
      this.$refs.answerForm.validate((valid) => {
        if (valid) {
          hussarAxiosRequestUtils.postAction(ForgetPwdApi.checkAnswer, this.form2).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$t('login.forgetPwd.VerificationSuccess'));
              this.hideAll();
              this.isShow.div3 = true;
            }
          });
        }
      });
    },
    // 第三步，设置新密码
    stepThree() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          const passwordEncryption = new HussarPasswordEncryption();
          const data = {
            userAccount: this.form1.account,
            newPwd: passwordEncryption.encrypt(this.form3.newPwd),
            checkPwd: passwordEncryption.encrypt(this.form3.checkPwd)
          };
          hussarAxiosRequestUtils.postAction(ForgetPwdApi.resetPwd, data).then(res => {
            this.loading = false;
            const data = res.data;
            if (res.code === 10000) {
              if (data.success === true) {
                this.$message.success(this.$t('login.forgetPwd.resetPwdSuccess'));
                this.cancel();
              } else {
                this.resetErrorMsg(res.data);
              }
            }
          }).catch(res => {
            this.loading = false;
          });
        }
      });
    },
    resetErrorMsg(data) {
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
      } else if (data.msg === 'updateFailPwdNotUser') {
        msg = this.$t('common.updateFailPwdNotUser');
      } else if (data.msg === 'pwdNotSame') {
        msg = this.$t('common.pwdNotSame');
      } else if (data.error === 'resetFail') {
        msg = this.$t('login.forgetPwd.newPwdNoRepeat1') + data.repeatTime + this.$t('login.forgetPwd.newPwdNoRepeat2');
      } else {
        msg = this.$t('common.operation UnSuccessful');
      }
      this.$message.error({ dangerouslyUseHTMLString: true, message: '<span>' + msg + '</span>' });
    },

    // 取消
    cancel() {
      this.$router.push({
        path: '/login'
      });
    },

    // 隐藏所有的div
    hideAll() {
      this.isShow = {
        div1: false,
        div2: false,
        div3: false
      };
    }
  }

};
</script>

<style scoped>
    .editBtn-bottoms {
        bottom: 4px;
        right: 33%;
        height: 46px;
        text-align: center;
    }

    .el-form-item__content .el-input-group {
      width: 100%;
    }
    .form {
        padding-top: 20%
    }

    .pwdMain {
        background: #F6F7F9;
        height: 100%
    }

    .el-col-offset-8 {
    }
    .forgetPaw{padding: 0 13px; line-height: unset; width: 68px}
    .forgetPaw-save{width: 68px; padding: 0 8px; line-height: unset; border: unset}
</style>
