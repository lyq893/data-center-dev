<template>
  <base-drawer
    ref="drawerRef"
    v-if="showDrawer"
    :visible.sync="showDrawer"
    :open-type="openType"
    :close-on-press-escape="!firstSetSecret"
  >
    <template #title>
      <div class="title-content">
        <div class="title-text">
          <span>{{ $t('navbar.setS') }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <el-form :model="form" :rules="rules" ref="secretForm" class="drawer-form">
        <el-form-item :label="$t('navbar.securityQues')" prop="ques">
          <el-input class="jxd_ins_elInput default" :placeholder="$t('navbar.enterSecurityQues')" v-model.trim="form.ques" />
        </el-form-item>
        <el-form-item :label="$t('navbar.securityAnswer')" prop="key">
          <el-input class="jxd_ins_elInput default" :placeholder="$t('navbar.enterSecurityAnswer')" v-model.trim="form.key" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="closeDrawer" class="drawer-btn-cancel" size="small" v-if="!firstSetSecret">{{ $t('common.cancel') }}</el-button>
      <el-button class="drawer-btn-save" @click="saveDrawer" size="small" type="primary" :loading="loading">{{ $t('common.save') }}</el-button>
    </template>
  </base-drawer>
</template>

<script>
import { baseDrawer } from 'hussar-common';
import { hussarAxiosRequestUtils } from 'hussar-base';
import { ForgetPwdApi } from '@/api/authority/forgetPwdApi';

export default {
  name: 'SetSecret',
  data() {
    return {
      openType: 'isEdit',
      showDrawer: false,
      firstSetSecret: false,
      form: {
        ques: '',
        key: ''
      },
      publicKey: '',
      loading: false
    };
  },
  components: {
    baseDrawer
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
    openDrawer(value) {
      this.firstSetSecret = value;
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
      Object.assign(this.$data, this.$options.data());
    },
    saveDrawer() {
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
              if (this.firstSetSecret) {
                this.$emit('firstSet');
              }
              this.closeDrawer();
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

</style>
