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
    :visible.sync="showstaffInfo"
  >
    <div class="flex flex-col drawer-height lcdp_axe jxd_additional theme-config-staff-info">
      <div class="drawer-title-box flex flex-up-down">
        <div class="title-content">
          <div class="title-text">
            <span>{{ $t('navbar.person') }}</span>
          </div>
        </div>
      </div>
      <div class="line" />
      <div class="form-box" style="flex-grow: 1">
        <el-form :model="form" :rules="rules" ref="staffInfoForm" class="drawer-form">
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.loginAccount')" prop="userAccount">
            <el-input class="jxd_ins_elInput default" :disabled="true" v-model="form.userAccount" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.name')" prop="userName">
            <el-input class="jxd_ins_elInput default" :disabled="true" v-model="form.userName" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="E_MAIL" prop="eMail">
            <el-input class="jxd_ins_elInput default" v-model="form.eMail" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.wechat')" prop="weChat">
            <el-input class="jxd_ins_elInput default" v-model="form.weChat" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.phone')" prop="mobile">
            <el-input class="jxd_ins_elInput default" v-model="form.mobile" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.telephone')" prop="telephone">
            <el-input class="jxd_ins_elInput default" v-model="form.telephone" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('navbar.sessions')" prop="maxSessions">
            <el-input class="jxd_ins_elInput default" :disabled="true" v-model="form.maxSessions" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" :label="$t('userManage.administrator')" prop="isGrade">
            <!--        <span v-if="this.form.isSys == '1'">{{ $t('common.yes') }}</span>-->
            <!--        <span v-else>{{ $t('common.no1') }}</span>-->
            <el-radio-group class="jxd_ins_elRadioGroup default" :disabled="true" v-model="form.isGrade" size="mini">
              <el-radio label="1">{{ $t('common.yes') }}</el-radio>
              <el-radio label="0">{{ $t('common.no1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div class="line" />
      <div class="bottom-box">
        <div class="btn-box">
          <el-button class="jxd_ins_elButton default staff-info-cancel" @click="closeDrawer">{{ $t('common.cancel') }}</el-button>
          <el-button :loading="loading" @click="save()" class="jxd_ins_elButton default lay-btn button_additional">{{ $t('common.save') }}</el-button>
        </div>
      </div>
    </div>
  </el-drawer>

</template>

<script>
import { hussarAxiosRequestUtils, validate } from 'hussar-base';
import { userApi, authorityRole } from 'hussar-authorization';

export default {
  name: 'StaffInfoDrawer',
  props: [],
  data() {
    return {
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
        accountStatus: ''
      },
      submitForm: {
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
        accountStatus: ''
      },
      tab: {
        staffInfo: false,
        userTree: false
      },
      activeTab: 'staffInfo',
      roleTreeData: undefined, // 左侧角色树数据
      expanded: [0], // 树展开节点
      rootId: '#', // 树根节点id
      initNodeId: undefined, // init树参数nodeID
      loading: false,
      // 树默认节点
      defaultProps: {
        children: 'childrenList',
        label: 'text'
      },
      formLabelWidth: '',
      showstaffInfo: false
    };
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
    }
  },
  // ---监听树的查询条件---
  watch: {
    filterText(val) {
      this.$refs.roleTree.$refs.tree.filter(val);
    }
  },
  methods: {
    openDrawer() {
      this.showstaffInfo = true;
      this.queryStaffInfo();
    },
    closeDrawer() {
      this.showstaffInfo = false;
    },
    // 判断是否是分级管理员
    isGrade(list) {
      return list.some(role => role.grantedRole === '1450785135866925063');
    },
    // 获取人员信息
    queryStaffInfo() {
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
          const grantRole = res.data[1];
          // 根据树中是否选择了分级管理员，判断表单的分级管理员开关是否打开
          if (grantRole && grantRole.length > 0) {
            this.form.isGrade = this.isGrade(grantRole) ? '1' : '0';
          } else {
            this.form.isGrade = '0'; // 非分级管理员
          }
        }
      });
    },

    // 修改个人信息
    save() {
      this.$refs.staffInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.submitForm.userId = this.form.userId;
          this.submitForm.eMail = this.form.eMail;
          this.submitForm.weChat = this.form.weChat;
          this.submitForm.mobile = this.form.mobile;
          this.submitForm.telephone = this.form.telephone;
          hussarAxiosRequestUtils.postAction(userApi.AuthorityUserApi.editStaffInfo, this.submitForm).then(res => {
            if (res.code === 10000) {
              this.queryStaffInfo();
              this.$message.success(this.$t('common.changedSuccessful'));
              // 关闭抽屉
              this.closeDrawer();
            }
            this.loading = false;
          });
        }
      });
    },

    // ----初始化用户关联的角色树----
    initRoleTree(roleIds) {
      if (roleIds === undefined) {
        return;
      }
      hussarAxiosRequestUtils.getAction(authorityRole.RoleApi.userRoleTree, { roleIds: roleIds }).then(res => {
        this.roleTreeData = res.data;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.btn-cancel{height: 36px; width: 66px}
.btn-save{height: 36px; width: 66px}
.form{margin-top: 10px}
.tree-wrap{padding: 0 20px}
.tree-filter{padding: 0;height: 50px;}
.dialog-cancel,.dialog-save{width: 70px;line-height: 6px}

/* 取消按钮 */
.lcdp_axe.jxd_additional .staff-info-cancel {
  background-color: #FFF;
  color: var(--c-themeColor);
  border: 1px solid var(--c-themeColor);
}
.lcdp_axe.jxd_additional.theme-config-staff-info .staff-info-cancel :hover{
  color: #fff;
}
.lcdp_axe.jxd_additional.theme-config-staff-info .staff-info-cancel:hover:not(.is-disabled){
  color:  #FFF !important;
}
/* 输入框字体大小 */
.lcdp_axe.jxd_additional.theme-config-staff-info ::v-deep .el-input__inner{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', Alibaba-PuHuiTi-Regular,PingFang,tahoma,'arial', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
}
.lcdp_axe.jxd_additional.theme-config-staff-info ::v-deep .jxd_ins_elButton {
  width: 80px;
  height: 32px;
  border-radius: 3px;
  padding: 6px 6px;
  font-weight: 400;
  margin-left: 16px;
  font-size: 14px;
  line-height: 1;
}
/* 单选框组 */
.lcdp_axe.jxd_additional.theme-config-staff-info ::v-deep .el-radio-group.jxd_ins_elRadioGroup.default {
  display: inline-block;
}
.lcdp_axe.jxd_additional.theme-config-staff-info ::v-deep .el-radio__inner {
  width: 12px;
  height: 12px;
}
.lcdp_axe.jxd_additional.theme-config-staff-info ::v-deep .el-radio__label {
  padding-left: 4px;
}
.lcdp_axe.jxd_additional.theme-config-staff-info .btn-box ::v-deep .el-button[disabled="disabled"] {
  background-color: var(--c-themeColor);
}

</style>
