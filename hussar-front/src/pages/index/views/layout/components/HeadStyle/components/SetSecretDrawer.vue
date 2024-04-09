<template>
  <el-drawer
    :with-header="false"
    :show-close="false"
    :destroy-on-close="true"
    size="480px"
    class="table-drawer"
    ref="drawer"
    :append-to-body="true"
    :wrapper-closable="false"
    :visible.sync="showSetSecret"
  >
    <div class="flex flex-col drawer-height lcdp_axe jxd_additional theme-config-set-secret">
      <div class="drawer-title-box flex flex-up-down">
        <div class="title-content">
          <div class="title-text">
            <span>{{ $t('navbar.setS') }}</span>
          </div>
        </div>
      </div>
      <div class="line" />
      <div class="form-box" style="flex-grow: 1">
        <el-form :model="form" :rules="rules" ref="secretForm" class="drawer-form">
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.securityQues')" prop="ques">
            <el-input class="jxd_ins_elInput default" :placeholder="$t('navbar.enterSecurityQues')" v-model.trim="form.ques" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.securityAnswer')" prop="key">
            <el-input class="jxd_ins_elInput default" :placeholder="$t('navbar.enterSecurityAnswer')" v-model.trim="form.key" />
          </el-form-item>
        </el-form>
      </div>

      <div class="line" />
      <div class="bottom-box">
        <div class="btn-box">
          <el-button @click="cancel" class="jxd_ins_elButton default set-secret-cancel" size="small">{{ $t('common.cancel') }}</el-button>
          <el-button @click="save" class="jxd_ins_elButton default lay-btn button_additional" size="small">{{ $t('common.save') }}</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { hussarAxiosRequestUtils } from 'hussar-base';
import { ForgetPwdApi } from '@/api/authority/forgetPwdApi';

export default {
  name: 'SetSecretDrawer',
  data() {
    return {
      form: {
        ques: '',
        key: ''
      },
      publicKey: '',
      loading: false,
      formLabelWidth: '',
      showSetSecret: false
    };
  },
  computed: {
    // 表单验证规则
    rules() {
      return {
        ques: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { max: 20, message: this.$t('navbar.questionLength'), trigger: 'blur' }
        ],
        key: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { max: 20, message: this.$t('navbar.questionAnswer'), trigger: 'blur' }
        ]
      };
    }
  },
  methods: {
    openDrawer() {
      this.showSetSecret = true;
    },
    // 取 消
    cancel() {
      Object.assign(this.$data, this.$options.data());
      this.showSetSecret = false;
    },
    // 保存
    save() {
      this.$refs.secretForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            pQues: this.form.ques,
            pKey: this.form.key
          };
          hussarAxiosRequestUtils.postAction(ForgetPwdApi.setSecret, data).then(res => {
            this.loading = false;
            if (res.code === 10000) {
              this.$message.success(res.msg);
              this.cancel();
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
.editBtn-bottoms { position: absolute;bottom: 15px;height: 46px;width: calc(100% - 40px); text-align: right;}

/* 取消按钮 */
.lcdp_axe.jxd_additional .set-secret-cancel {
  background-color: #FFF;
  color: var(--c-themeColor);
  border: 1px solid var(--c-themeColor);
}
.lcdp_axe.jxd_additional.theme-config-set-secret .set-secret-cancel :hover{
  color: #fff;
}
.lcdp_axe.jxd_additional.theme-config-set-secret .set-secret-cancel:hover:not(.is-disabled){
  color:  #FFF !important;
}
.lcdp_axe.jxd_additional.theme-config-set-secret ::v-deep .el-input__inner{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', Alibaba-PuHuiTi-Regular,PingFang,tahoma,'arial', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
}
.lcdp_axe.jxd_additional.theme-config-set-secret ::v-deep .drawer-form .el-input__inner:hover,
.lcdp_axe.jxd_additional.theme-config-set-secret ::v-deep .drawer-form .el-input__inner:focus {
  border-color : var(--c-themeColor) !important;
}
.lcdp_axe.jxd_additional.theme-config-set-secret ::v-deep .jxd_ins_elButton {
  width: 80px;
  height: 32px;
  border-radius: 3px;
  padding: 6px 6px;
  font-weight: 400;
  margin-left: 16px;
  font-size: 14px;
  line-height: 1;
}
.lcdp_axe.jxd_additional.theme-config-set-secret ::v-deep  .el-form-item.is-error .el-input__inner{
  border-color: var(--c-checkBadColor);
}
.lcdp_axe.jxd_additional.theme-config-set-secret ::v-deep  .el-form-item.is-error .el-form-item__error{
  color: var(--c-checkBadColor);
}
</style>

