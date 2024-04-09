<template>
  <el-dialog
    v-if="showVersions"
    :visible.sync="showVersions"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
    :destroy-on-close="true"
    class="lcdp-dialog"
    :before-close="closeDialog"
    width="450px"
  >
    <template slot="title">
      <span class="el-dialog__title" style="display: block;">{{ $t('navbar.enterP') }}</span>
    </template>
    <div>
      <el-form :model="tenantForm" ref="tenantForm" @submit.native.prevent>
        <el-form-item :label-width="formLabelWidth" :label="$t('login.password')" prop="password">
          <el-input
            v-model="tenantForm.password"
            show-password
            :placeholder="$t('navbar.enterTanentPaw')"
            @keyup.enter.native="submitTenantPwd"
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="kaptcha" :label="$t('login.verification')"
                      v-if="showKaptcha"
        >
          <el-input
            type="text"
            v-model="tenantForm.kaptcha"
            name="kaptcha"
            :placeholder="$t('login.enterVerification')"
            @keyup.enter.native="submitTenantPwd"
          >
            <template slot="append"><img
              style="width: 80px; height: 37px;cursor: pointer;"
              :src="kaptchaUrl"
              @click="getKaptcha"
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="totp" :label="$t('login.DPassword')" v-if="showTotp">
          <el-input
            type="text"
            v-model="tenantForm.totp"
            name="totp"
            auto-complete="on"
            :placeholder="$t('login.enterDPassword')"
            @keyup.enter.native="submitTenantPwd"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="editBtn-bottoms">
      <el-button @click="closeDialog" class="btn-cancel">{{ $t('common.cancel') }}</el-button>
      <el-button class="btn-save" type="primary" :loading="loading" @click="submitTenantPwd">{{
        $t('common.confirm')
      }}
      </el-button>
    </div>
    <div class="dialog-footer" slot="footer" />
  </el-dialog>
</template>

<script>
import { hussarAxiosRequestUtils } from 'hussar-base';
import { LoginApi } from '../../../../../../../api/loginApi';

export default {
  name: 'VersionsDialog',
  data() {
    return {
      showVersions: false,
      formLabelWidth: '132px',
      tenantForm: {
        password: '',
        kaptcha: '',
        totp: ''
      },
      kaptchaUrl: ''
    };
  },
  methods: {
    submitTenantPwd() {
      this.loading = true;
      const pwd = this.tenantForm.password;
      this.changeTenant(pwd);
    },
    getKaptcha() {
      hussarAxiosRequestUtils.getAction(LoginApi.getKaptchaUrl).then(res => {
        this.kaptchaUrl = window.URL.createObjectURL(res);
      });
    },
    // 切换租户
    changeTenant(pwd) {
      const param = {
        tenantCode: this.checkedDataForTenant.id,
        password: pwd,
        kaptcha: this.tenantForm.kaptcha,
        totp: this.tenantForm.totp
      };
      // 切换租户
      this.$store.dispatch('ChangeTenant', param).then(res => {
        this.loading = false;
        if (res.code === 10000) {
          location.assign('/');
        }
      }).catch(() => {
        this.loading = false;
        if (this.showKaptcha) {
          this.getKaptcha();
        }
      });
    },
    closeDialog() {
      this.tenantForm = {
        password: '',
        kaptcha: '',
        totp: ''
      };
      this.showVersions = false;
    }
  }
};
</script>

<style scoped>

</style>
