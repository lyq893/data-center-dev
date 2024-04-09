<template>
  <!--选择租户-->
  <el-dialog
    v-if="showChangeTenant"
    :visible.sync="showChangeTenant"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
    top="2vh"
    width="400px"
    id="changeTenant"
    class="lcdp-dialog"
    custom-class="dialogFitHeight lcdp-staff-dialog tenantSelect"
  >
    <template slot="title">
      <span class="el-dialog__title" style="display: block;">{{ $t('navbar.switchTanent') }}</span>
    </template>
    <el-tree
      ref="tenantTree"
      :data="dataForTenantTree"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expanded-keys="selectDefaultExpanded"
      :indent="14"
      class="filter-tree lcdp-tree"
      show-checkbox
      node-key="id"
      v-show="treeShow"
      @check="checkNodeForTenant"
      :render-content="renderContent"
    >
      <div slot-scope="{ node }" class="el-tree-node__label" @dbclick.native="closeNode(node)">
        <span :title="node.label">{{ node.label }}</span>
      </div>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button class="dialog-cancel" @click="closeDialog">{{ $t('common.cancel') }}</el-button>
      <el-button
        class="dialog-save"
        type="primary"
        @click="saveChangeTenant"
        :disabled="!dialogSubBtn"
        :loading="loading"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarAxiosRequestUtils, TreeIconContent } from 'hussar-base';
import { IndexApi } from 'hussar-tenant';
import { LoginApi } from '../../../../../../../api/loginApi';

export default {
  name: 'ChangeTenantDialog',
  data() {
    return {
      showChangeTenant: false,
      dataForTenantTree: '',
      defaultProps: {
        children: 'childrenList',
        label: 'text',
        isLeaf: function (data) {
          if (data.type === 'isRoot') {
            return false;
          } else {
            return !data.children;
          }
        }
      },
      selectDefaultExpanded: ['#'],
      treeShow: false,
      // 选中的节点
      checkedDataForTenant: undefined,
      // 切换租户时是否需要密码
      showTenantPwd: false
    };
  },
  methods: {
    // 打开切换租户弹框
    openDialog() {
      this.changeTenantShowPwd();
      this.dataForTenantTree = [];
      this.dialogSubBtn = false;
      this.showChangeTenant = true;
      this.checkedDataForTenant = undefined;
      this.openDialogLoading();
      hussarAxiosRequestUtils.getAction(IndexApi.getTenantTree).then(res => {
        this.closeDialogLoading();
        if (res.code === 10000) {
          this.dialogSubBtn = true;
          // 展开一级节点
          this.selectDefaultExpanded = [res.data[0].id];
          this.dataForTenantTree = res.data;
          if (this.$refs.tenantTree !== undefined) {
            this.$refs.tenantTree.setCheckedKeys([this.tenantCode]);
            this.$nextTick(() => {
              const node = this.$refs.tenantTree.getNode(this.tenantCode);
              if (node !== undefined && node !== null) {
                this.checkedDataForTenant = node.data;
              }
            });
          }
        }
      }).catch(() => {
        this.closeDialogLoading();
      });
    },
    // 切换租户是否需要密码
    changeTenantShowPwd() {
      hussarAxiosRequestUtils.getAction(LoginApi.changeTenantNeedPwd).then(res => {
        if (res.code === 10000) {
          this.showTenantPwd = res.data.showPwd;
        }
      });
    },
    // 弹出框加载loading
    openDialogLoading() {
      this.treeShow = false;
      this.$nextTick(() => {
        this.dialogLoading = this.$loading({
          target: document.querySelector('.el-dialog')
        });
      });
    },
    // 弹出框关闭loading
    closeDialogLoading() {
      this.treeShow = true;
      this.$nextTick(() => {
        this.dialogLoading.close();
      });
    },
    // 树选择事件
    checkNodeForTenant(node) {
      this.checkedDataForTenant = undefined;
      // 遍历选中节点，将之前的选中状态全部取消
      const tree = this.$refs.tenantTree;
      tree.setChecked('11', false, true);
      if (node.type === 'tenant') {
        // 记住被选择的节点
        this.checkedDataForTenant = node;
        // 选中刚选择的节点
        tree.setChecked(node.id, true, false);
      }
    },
    /* 树加载图标*/
    renderContent(h, { root, node, data }) {
      const iconType = TreeIconContent.treeContent(data);
      return (
        <div class='custom-tree-node'>
          <div class='tree-node-info'>
            <span title={node.label}>{node.label}</span>
          </div>
        </div>
      );
    },
    // 切换租户
    saveChangeTenant() {
      if (this.checkedDataForTenant === undefined) {
        this.$message.warning(this.$t('navbar.selectTenant'));
      } else if (this.showTenantPwd === false) {
        this.loading = true;
        this.changeTenant('');
      } else {
        this.closeDialog();
        if (this.showKaptcha) {
          this.getKaptcha();
        }
        this.isShow.tenantPwd = true;
      }
    },
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
    getKaptcha() {
      hussarAxiosRequestUtils.getAction(LoginApi.getKaptchaUrl).then(res => {
        this.kaptchaUrl = window.URL.createObjectURL(res);
      });
    },
    // 树取消事件
    closeDialog() {
      this.ishowChangeTenant = false;
    }

  }
};
</script>

<style scoped>

</style>
