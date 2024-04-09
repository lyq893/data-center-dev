<template>
  <base-drawer
    ref="drawerRef"
    v-if="showDrawer"
    :visible.sync="showDrawer"
    :open-type="openType"
  >
    <template #title>
      <div class="title-content">
        <div class="title-text">
          <span>{{ $t('navbar.person') }}</span>
        </div>
      </div>
    </template>
    <template #content>
      <el-form :model="form" :rules="rules" ref="form" class="drawer-form">
        <el-form-item :label="$t('navbar.loginAccount')" prop="userAccount">
          <el-input class="jxd_ins_elInput default" :disabled="true" v-model="form.userAccount" />
        </el-form-item>
        <el-form-item :label="$t('navbar.name')" prop="userName">
          <el-input class="jxd_ins_elInput default" :disabled="true" v-model="form.userName" />
        </el-form-item>
        <el-form-item label="E_MAIL" prop="eMail">
          <el-input class="jxd_ins_elInput default" v-model="form.eMail" />
        </el-form-item>
        <el-form-item :label="$t('navbar.wechat')" prop="weChat">
          <el-input class="jxd_ins_elInput default" v-model.trim="form.weChat" />
        </el-form-item>
        <el-form-item :label="$t('navbar.phone')" prop="mobile">
          <el-input class="jxd_ins_elInput default" v-model="form.mobile" />
        </el-form-item>
        <el-form-item :label="$t('navbar.telephone')" prop="telephone">
          <el-input class="jxd_ins_elInput default" v-model="form.telephone" />
        </el-form-item>
        <el-form-item v-if="!getSingleApp" label="个人令牌" prop="accessToken">
          <el-input class="jxd_ins_elInput default" v-model="form.accessToken" />
        </el-form-item>
        <el-form-item :label="$t('navbar.sessions')" prop="maxSessions">
          <el-input class="jxd_ins_elInput default" :disabled="true" v-model="form.maxSessions" />
        </el-form-item>
        <el-form-item :label="$t('userManage.administrator')" prop="isGrade">
          <el-radio-group class="jxd_ins_elRadioGroup default" :disabled="true" v-model="form.isGrade" size="mini">
            <el-radio label="1">{{ $t('common.yes') }}</el-radio>
            <el-radio label="0">{{ $t('common.no1') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button class="drawer-btn-cancel" @click="closeDrawer">{{ $t('common.cancel') }}</el-button>
      <el-button :loading="loading" @click="submit" class="drawer-btn-save" type="primary">{{ $t('common.save') }}</el-button>
    </template>
  </base-drawer>
</template>

<script>
import { hussarAxiosRequestUtils, userUtils, validate, caching } from 'hussar-base';
import { userApi } from 'hussar-authorization';
import { baseDrawer } from 'hussar-common';

export default {
  name: 'EditInfo',
  data() {
    return {
      openType: 'isEdit',
      showDrawer: false,
      form: {
        userId: '',
        userAccount: '',
        isSys: '0',
        isGrade: '0',
        userName: '',
        maxSessions: '',
        eMail: '',
        weChat: '',
        mobile: '',
        telephone: '',
        accountStatus: '',
        accessToken: ''
      },
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
        eMail: [{ required: false, validator: validate.checkEmail, trigger: 'blur' },
          { max: 32, message: this.$t('navbar.mix'), trigger: 'blur' }],
        weChat: [{ required: false, max: 32, message: this.$t('navbar.mix'), trigger: 'blur' }],
        mobile: [{ required: false, validator: validate.checkPhone, trigger: 'blur' }],
        telephone: [{ required: false, validator: validate.checkTel, trigger: 'blur' }]
      };
    },
    getSingleApp() {
      if (caching.session.get('isAppMANAGE') != 'true') {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    closeDrawer() {
      this.showDrawer = false;
      Object.assign(this.$data, this.$options.data());
    },
    // 获取人员信息
    openDrawer() {
      this.showDrawer = true;
      hussarAxiosRequestUtils.getAction(userApi.AuthorityUserApi.queryStaffInfo).then(res => {
        if (res.code === 10000) {
          const staffInfo = res.data[0];
          this.form.userId = staffInfo.id;
          this.form.userAccount = staffInfo.userAccount;
          this.form.isSys = staffInfo.isSys;
          this.form.userName = staffInfo.userName;
          this.form.maxSessions = staffInfo.maxSessions;
          this.form.eMail = staffInfo.eMail;
          this.form.mobile = staffInfo.mobile;
          this.form.weChat = staffInfo.weChat;
          this.form.telephone = staffInfo.telephone;
          this.form.accountStatus = staffInfo.accountStatus;
          this.form.accessToken = staffInfo.char1;
          const grantRole = res.data[1];
          // 根据用户是否有分级管理员角色，判断表单的分级管理员开关是否打开
          if (grantRole && grantRole.length > 0) {
            this.form.isGrade = this.isGrade(grantRole) ? '1' : '0';
          } else {
            this.form.isGrade = '0'; // 非分级管理员
          }
        }
      });
    },
    // 判断是否是分级管理员
    isGrade(list) {
      return list.some(role => role.grantedRole === '1450785135866925063');
    },
    // 修改个人信息
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const param = {
            userId: this.form.userId,
            eMail: this.form.eMail,
            weChat: this.form.weChat,
            mobile: this.form.mobile,
            telephone: this.form.telephone,
            accessToken: this.form.accessToken
          };
          hussarAxiosRequestUtils.postAction(userApi.AuthorityUserApi.editStaffInfo, param).then(res => {
            if (res.code === 10000) {
              this.$message.success(this.$t('common.changedSuccessful'));
              this.closeDrawer();
            }
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
