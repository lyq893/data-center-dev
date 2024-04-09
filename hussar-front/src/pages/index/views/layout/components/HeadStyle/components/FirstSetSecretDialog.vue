<template>
  <!--设置密保-->
  <el-dialog
    :visible.sync="showFirstSetSecret"
    v-if="showFirstSetSecret"
    :close-on-press-escape="false"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :append-to-body="true"
    class="lcdp-dialog edit-pwd-dialog jxd_additional lcdp_axe"
    width="450px"
  >
    <template slot="title">
      <span class="el-dialog__title" style="display: block;">{{ $t('navbar.setS') }}</span>
    </template>
    <el-form :model="secretForm" :rules="rules" ref="secretForm" class="secret-form">
      <el-form-item :label-width="formLabelWidth" :label="$t('navbar.securityQues')" prop="ques">
        <el-input ref="ques" class="jxd_ins_elInput default" :placeholder="$t('navbar.enterSecurityQues')"
                  v-model.trim="secretForm.ques"
        />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :label="$t('navbar.securityAnswer')" prop="key">
        <el-input ref="answer" class="jxd_ins_elInput default" :placeholder="$t('navbar.enterSecurityAnswer')"
                  v-model.trim="secretForm.key"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer" style="height: 38px;line-height: 38px">
      <el-button @click="saveSecret" class="jxd_ins_elButton default btn-save" type="primary">{{
        $t('common.save')
      }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarAxiosRequestUtils } from 'hussar-base';
import { ForgetPwdApi } from '../../../../../../../api/authority/forgetPwdApi';

export default {
  name: 'FirstSetSecretDialog',
  data() {
    return {
      showFirstSetSecret: false,
      secretForm: {
        ques: '',
        key: ''
      },
      formLabelWidth: '132px'
    };
  },
  computed: {
    rules() {
      return {
        ques: [{ required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: this.validateQues, trigger: 'blur' }],
        key: [{ required: true, message: '此项为必填项', trigger: 'blur' },
          { validator: this.validateAnswer, trigger: 'blur' }]
      };
    }
  },
  methods: {
    openDialog() {
      this.showFirstSetSecret = true;
    },
    validateQues(rule, value, callback) {
      const self = this;
      const { $el } = self.$refs.ques;
      self.validateCommonSecret(value, $el, callback, self.$t('navbar.questionLength'));
    },
    validateAnswer(rule, value, callback) {
      const self = this;
      const { $el } = self.$refs.answer;
      self.validateCommonSecret(value, $el, callback, self.$t('navbar.questionAnswer'));
    },
    validateCommonSecret(value, $el, callback, errorMsg) {
      let msg = ' ';
      let flag = true;
      if (value === '') {
        flag = false;
      } else if (value.length > 20) {
        flag = false;
        msg = errorMsg;
      }
      if (!flag) {
        if ($el) {
          $el.classList.add('checkBad');
        }
        callback(new Error(msg));
      } else if ($el) {
        $el.classList.remove('checkBad');
        callback();
      }
    },
    // 保存密保
    saveSecret() {
      this.$refs.secretForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            pQues: this.secretForm.ques,
            pKey: this.secretForm.key
          };
          hussarAxiosRequestUtils.postAction(ForgetPwdApi.setSecret, data).then(res => {
            this.loading = false;
            if (res.code === 10000) {
              this.$message.success(this.$t('common.setSuccess'));
              this.showFirstSetSecret = false;
              this.$emit('openFirstChangePwdDialog');
            }
          }).catch(() => {
            this.loading = false;
          });
        }
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
