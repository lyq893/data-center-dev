<template>
  <div class="navbar business-navbar"
       :class="{'changzi':layoutConfigActive === '0','leftRightHead':layoutConfigActive === '1'}"
  >
    <div class="sys-float">
      <a :href="indexHref" target="_blank" class="to-index-home" v-if="hasPerms('headStyle:toConsole')">
        <div class="enterUser"><i class="showHelp font_family icon-qqb-enter-the-portal" />运维管理</div>
      </a>
      <div class="sys-func">
        <div class="sys-opt">
          <el-tooltip class="item" effect="light" :manual="manual" placement="bottom">
            <el-dropdown class="item welcome-cell" effect="light" placement="bottom" @command="welcomeConfig"
                         style="display: inline"
            >
              <div class="welcome-cell">自定义欢迎页</div>
              <el-dropdown-menu slot="dropdown" class="welcome-drop-menu">
                <el-dropdown-item command="custom">
                  <span class="welcome-config-item">自定义欢迎页</span>
                </el-dropdown-item>
                <el-dropdown-item command="default">
                  <span class="welcome-config-item">恢复系统默认欢迎页</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </div>
      </div>
      <el-tooltip class="item" effect="light" content="切换租户" placement="bottom" v-if="showTenant==='true'">
        <div class="changeTenant" @click="openTenantDialog" v-if="showTenant==='true'" />
      </el-tooltip>
      <div class="sys-right">
        <div class="sys-avatar sys-tenant">
          <span class="tenantName" :class="{leftRightName : layoutConfigActive === '1'}">{{ name }}</span>
        </div>
      </div>
    </div>
    <div class="sys-button">
      <div class="sys-avatar sys-tenant">
        <el-dropdown>
          <div class="superUser-name2" />
          <el-dropdown-menu slot="dropdown" class="name-el-dropdown">
            <el-dropdown-item>
              <div @click="showStaffInfo">
                <img class="img" src="@/assets/img/navbar/user.png" alt="">
                <div class="svg-icon portrait" />
                <span style="font-size: 12px; margin-left: 20px">{{ $t('navbar.person') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="isIam != 'true'">
              <div @click="showChangePwd">
                <img class="img" src="@/assets/img/navbar/lock.png" alt="">
                <div class="svg-icon portrait" />
                <span style="font-size: 12px; margin-left: 20px">{{ $t('navbar.changP') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="isIam != 'true'">
              <div @click="setSecretQuestion">
                <img class="img" src="@/assets/img/navbar/safety certificate.png" alt="">
                <div class="svg-icon portrait" />
                <span style="font-size: 12px; margin-left: 20px">{{ $t('navbar.setS') }}</span>
              </div>
            </el-dropdown-item>
            <div style=" width: 100%; height: 1px; border-top: solid #cccccc 1px;" />
            <el-dropdown-item>
              <div @click="logout" style="text-align: center">
                <div class="exit">
                  <span style="font-size: 12px;">{{ $t('navbar.exit') }}</span>
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--个人信息修改-->
    <staff-info-drawer ref="staffInfoDrawerRef" />

    <!--修改密码-->
    <change-pwd-drawer ref="changePwdDrawerRef" />

    <!--设置密保-->
    <set-secret-drawer ref="setSecretDrawerRef" />

    <!--修改密码-->
    <first-change-pwd-dialog ref="firstChangePwdDialogRef" @cancel="cancel" />

    <!--设置密保-->
    <first-set-secret-dialog ref="firstSetSecretDialogRef" @openFirstChangePwdDialog="openFirstChangePwdDialog" />

    <!--选择租户-->
    <change-tenant-dialog ref="changeTenantDialogRef" />

    <!--查看版本-->
    <versions-dialog ref="versionsDialogRef" />

    <!--欢迎页配置-->
    <el-drawer
      title="欢迎页配置"
      :visible="welcomeDrawer"
      custom-class="welcome-drawer"
      :append-to-body="true"
      :direction="direction"
      :before-close="closeWelcomeDrawer"
      :wrapper-closable="false"
    >
      <welcomeConf v-if="welcomeDrawer" :is-business="true" @closeWelcomeDrawer="closeWelcomeDrawer" />
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ChangePwdDrawer from './components/ChangePwdDrawer';
import StaffInfoDrawer from './components/StaffInfoDrawer';
import SetSecretDrawer from './components/SetSecretDrawer';
import { hussarAxiosRequestUtils, caching } from 'hussar-base';
import { LoginApi } from '../../../../../../api/loginApi';
import { welcomeConf, personalizedConfApi } from 'hussar-config';
import { userApi } from 'hussar-authorization';
import FirstChangePwdDialog from './components/FirstChangePwdDialog';
import FirstSetSecretDialog from './components/FirstSetSecretDialog';
import ChangeTenantDialog from './components/ChangeTenantDialog';
import VersionsDialog from './components/VersionsDialog';
import permission from '../../../../store/permission';

export default {
  name: 'HeadStyle',
  components: {
    VersionsDialog,
    ChangeTenantDialog,
    FirstSetSecretDialog,
    FirstChangePwdDialog,
    ChangePwdDrawer,
    SetSecretDrawer,
    StaffInfoDrawer,
    welcomeConf
  },
  props: {
    isWelcome: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'tenantName',
      'tenantCode',
      'showTenant',
      'layoutLogo',
      'layoutSysname'
    ]),
    layoutConfigActive() {
      return this.$store.state.configIndex.layoutType;
    },
    showTransBtn() {
      if (caching.session.get('showconsoleTansUser') === 'showconsoleTansUser') {
        return false;
      } else {
        caching.session.remove('showconsoleTansUser');
        return true;
      }
    },
    isHome() {
      const flag = !!this.isWelcome;
      return flag;
    },
    internationalization() {
      return this.$store.getters.internationalization;
    },
    isIam() {
      return caching.session.get('isIAM');
    }
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      showHistory: false,
      isFullscreen: false,
      manual: true,
      loading: false,
      // 强制改密码或设置密保标记 1，改密 2，设置密保 3，都需要
      setFlag: 0,
      showTotp: false,
      showKaptcha: false,
      welcomeDrawer: false,
      direction: 'ttb',
      indexHref: ''
    };
  },
  mounted() {
    // eslint-disable-next-line no-undef
    $('.svg-con').attr('data-theme', caching.session.get('HussarIndexTheme'));
    window.document.documentElement.setAttribute('international-style', this.$store.getters.internationalization);
  },
  methods: {
    hasPerms(perms) {
      return permission.hasPermission(perms);
    },
    showStaffInfo() {
      this.$refs.staffInfoDrawerRef.openDrawer();
    },
    // 判断当前用户是否设置了密保
    isSecretQuestion() {
      this.hiddenScrollbar();
    },
    // 打开设置密保对话框
    setSecretQuestion() {
      this.$refs.setSecretDrawerRef.openDrawer();
    },
    openFirstChangePwdDialog() {
      if (this.setFlag === 1) {
        this.$refs.firstChangePwdDialogRef.openDialog();
      }
    },
    // 判断是否需要强制用户修改密码
    isForceChangePwd() {
      this.setFlag = 0;
      hussarAxiosRequestUtils.getAction(userApi.AuthorityUserApi.forceChangePwd).then(res => {
        if (res.code === 10000) {
          if (res.data.changePwd == 'YES' && res.data.firstLogin === 'YES') {
            this.$refs.firstSetSecretDialogRef.openDialog();
            this.setFlag = 1;
          } else if (res.data.changePwd == 'NO' && res.data.firstLogin === 'YES') {
            this.$refs.firstSetSecretDialogRef.openDialog();
            this.setFlag = 0;
          } else if (res.data.changePwd == 'YES' && res.data.firstLogin === 'NO') {
            this.$refs.firstChangePwdDialogRef.openDialog();
            this.setFlag = 0;
          }
          this.hiddenScrollbar();
        }
      }).catch(() => {
        console.error(this.$t('navbar.requestFaild'));
      });
    },
    showChangePwd() {
      this.$refs.changePwdDrawerRef.openDrawer();
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    logout() {
      const ipAddress = window.location.host;
      const protocol = window.location.protocol;
      this.$confirm(this.$t('navbar.confirmExit'), this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonClass: 'dialog-cancel',
        confirmButtonClass: 'dialog-save',
        closeOnClickModal: false,
        showClose: false,
        type: 'warning',
        customClass: 'lcdp-message'
      }).then(() => {
        // 发送异步请求，后台校验登录状态，单点登录时返回服务端退出登录地址
        hussarAxiosRequestUtils.postAction(LoginApi.validateLogout).then(res => {
          this.$store.dispatch('LogOut').then(() => {
            if(process.env.VUE_APP_INTEGRATED_IAM != 'true') {
              location.assign('');
              // 返回logoutUrl时，重定向到后台登出方法
              if (res.logoutUrl !== undefined && res.logoutUrl !== null && res.logoutUrl !== '') {
                // 重定向到后台退出登录方法
                window.location.href = res.logoutUrl;
              }
            } else {
              console.log('即将调用平台登出接口。。。');
              const url = 'https://idp.qd-metro.com:8086/idp/profile/OAUTH2/Redirect/GLO?redirctToUrl=' + protocol + '//' + ipAddress + '/index.html&redirectToLogin=true&entityId=' + process.env.VUE_APP_ENTITY_ID;
              location.assign(url);
              console.log('平台登出');
            }
          }).catch(() => {
            location.assign('/');
          });
        }).catch(err => {
          location.assign('/');
          console.log(err);
        });
      });
    },
    toHussarV8() {
      window.open('/hussar_v8', '_blank');
    },
    // 取 消
    cancel() {
      this.$emit('cancel');
    },
    // 打开切换租户弹框
    openTenantDialog() {
      this.$refs.changeTenantDialogRef.openDialog();
    },
    showTotpKapcha() {
      hussarAxiosRequestUtils.postAction(LoginApi.getTotpKapcha).then(res => {
        if (res.code === 10000) {
          this.showTotp = res.data.totp;
          this.showKaptcha = res.data.kaptcha;
        }
      });
    },
    //  进入工作流
    openBPM() {
      window.open('http://localhost:8888/hussarBpm/static/bpm/index.html');
    },
    //  进入天斧
    openVFG() {
      window.open(`${window.appHussarBackPath}/static/formdesign/index.html`);
    },

    welcomeConfig(command) {
      if (command === 'custom') {
        this.welcomeDrawer = true;
      } else {
        this.$confirm('确定恢复系统默认欢迎页吗？', this.$t('common.notice'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          cancelButtonClass: 'dialog-cancel',
          confirmButtonClass: 'dialog-save',
          closeOnClickModal: false,
          showClose: false,
          customClass: 'lcdp-message',
          type: 'warning'
        }).then(() => {
          hussarAxiosRequestUtils.postAction(personalizedConfApi.WithinPersonalizedConfApi.recoveryDefault).then(res => {
            if (res.code === 10000) {
              this.$store.dispatch('GenerateWelcomeConfig');
            } else {
              this.$message.error(res.msg);
            }
          });
        });
      }
    },
    // 关闭自定义欢迎页抽屉
    closeWelcomeDrawer() {
      this.welcomeDrawer = false;
      this.$store.dispatch('GenerateWelcomeConfig');
    },
    hiddenScrollbar() {
      this.$nextTick(() => {
        const el = document.querySelector('.edit-pwd-dialog .el-dialog');
        if (el) {
          el.style.overflow = 'hidden';
        }
      });
    }
  },
  created() {
    this.isSecretQuestion();
    this.isForceChangePwd();
    this.showTotpKapcha();
    if (window.location.href.slice(0, window.location.href.indexOf('#/index')).indexOf('static') > -1) {
      this.indexHref = window.location.href.slice(0, window.location.href.indexOf('#/index'));
    } else {
      this.indexHref = window.location.href.slice(0, window.location.href.indexOf('#/index')) + 'console.html#/';
    }
  }
};
</script>
<style>
.dialogFitHeight {
  overflow: auto
}

#selfInfo .el-dialog .el-dialog__body {
  padding: 0 20px;
}

.tenantSelect {
  max-height: 70% !important;
  overflow-y: hidden;
}

.tenantSelect .el-dialog__body {
  max-height: 76% !important;
}

/*自定义欢迎页抽屉样式*/
.el-drawer__open .el-drawer.welcome-drawer {
  height: calc(100% - 64px) !important;
  top: 64px;
}

.el-drawer__open .el-drawer.welcome-drawer .el-drawer__header {
  height: 43px;
  margin-bottom: 0;
  padding: 0 10px 0 24px;
  opacity: 1;
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #4a4c66;
  border-bottom: 1px solid #EAEAEA;
}

.el-drawer__open .el-drawer.welcome-drawer .el-drawer__close-btn {
  font-size: 18px;
  color: #969696;
}

.welcome-drop-menu.el-dropdown-menu {
  margin-top: 10px !important;
  padding-top: 8px;
  padding-bottom: 8px !important;
  box-shadow: 0px 4px 16px 0px rgba(224, 240, 255, 0.50);
  border-radius: 0;
}

.welcome-drop-menu.el-dropdown-menu .el-dropdown-menu__item:hover {
  background: #DDE5E3 !important;
  color: #045340;
}

.welcome-drop-menu.el-dropdown-menu .el-dropdown-menu__item:hover .welcome-config-item {
  color: #045340;
}

.welcome-drop-menu .welcome-config-item {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #4a4c66;
  line-height: 20px;
}
</style>
<style lang="scss">
.el-drawer__open .el-drawer.welcome-drawer .list-container {
  padding: 0;

  .config-container {
    .config-title {
      display: none;
    }
    .config-form{
      padding-top: 0;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/mixin.scss';

@import "@/styles/index/variables.scss";

.secret-form .jxd_ins_elInput.default {
  height: 32px;
  line-height: 36px;
}

.navbar {
  height: $base-nav-bar-height;
  background-color: #ffffff !important;
  border-bottom: 1px solid #e8e8e8;
}

.leftRightName {
  color: #02000d !important;
}

.focusing {
  outline-width: 0;
}

.language {
  font-size: 16px;
  padding: 0;
  padding-right: 10px;
  padding-left: 10px;
  border-color: #ffffff !important;
  float: left;
  line-height: 24px;
  height: 22px;
  cursor: pointer;
}

.sys-avatar {
  .svg-icon {
    float: left;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    border-radius: 50%;
    @include background(background_navar_icon_avatar);
    background-size: 100%;
  }

  .user-avatar {
    float: left;
    width: 28px;
    height: 28px;
    margin-top: 8px;
    border-radius: 50%;
  }

  .tenantName {
    margin: 0;
    font-size: 14px;
    font-family: bus-PingFangSC;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    padding: 0;
  }

  .user-name {
    display: inline-block;
    float: left;
    line-height: 28px;
    padding: 0 8px;
    min-width: 55px;
    text-align: center;
    color: #fff;
    font-size: 16px;

    &:hover {
      color: #fff;
    }
  }
}

/*访问门户*/
.to-index-home {
  width: 110px;
  margin-top: -1px;
  margin-right: 12px;

  .enterUser {
    cursor: pointer;
    width: 96px;
    height: 24px;
    display: inline-block;
    color: #fff;
    text-align: center;
    line-height: 24px;
    font-size: 14px;
    background: var(--c-keyDownColor);
    border-radius: 13px;
    margin-right: 14px;

    &:hover {
      border-radius: 13px;
      background: var(--c-keyDownColor);
    }
  }
}

/*导航栏按钮样式*/
.header-title-p {
  font-size: 16px;
  height: 22px;
  line-height: 22px;
}

.header-title-c {
  color: #B3B3B3;
  font-size: 8px;
  height: 11px;
  line-height: 11px;
  opacity: 1;
}

.header-title-item {
  color: #4E4F4F;
  height: 50px;
  float: left;
  margin-left: 88px;
  margin-top: 18px;
  margin-bottom: 18px;
  background: url("~@/assets/img/to_xmsz.png") no-repeat;
  background-size: 100%;
}

.header-title-item:hover {
  color: #FFFFFF;
  cursor: pointer;
  background: url("~@/assets/img/to_xmsz_yy.png") no-repeat;
  background-size: 100%;
  -webkit-box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  -moz-box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  border-radius: 5px;
}

.header-title {
  width: 220px;
  padding: 9px 0 8px 58px;
}

.header-title-item-center {
  color: #4E4F4F;
  height: 50px;
  float: left;
  margin-top: 18px;
  margin-bottom: 18px;
  margin-left: 37px;
  background: url("~@/assets/img/to_tf.png") no-repeat;
  background-size: 100%;
}

.header-title-item-center:hover {
  color: #FFFFFF;
  cursor: pointer;
  background: url("~@/assets/img/to_tf_yy.png") no-repeat;
  background-size: 100%;
  -webkit-box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  -moz-box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  border-radius: 5px;
}

.header-title-item-right {
  color: #4E4F4F;
  height: 50px;
  float: left;
  margin-top: 18px;
  margin-bottom: 18px;
  margin-left: 37px;
  background: url("~@/assets/img/to_gzl.png") no-repeat;
  background-size: 100%;
}

.header-title-item-right:hover {
  color: #FFFFFF;
  cursor: pointer;
  background: url("~@/assets/img/to_gzl_yy.png") no-repeat;
  background-size: 100%;
  -webkit-box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  -moz-box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  box-shadow: 0px 0px 4px 4px rgb(0, 61, 154, 0.6);
  border-radius: 5px;
}

.header-title-bg {
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  image-rendering: -moz-crisp-edges; /* Firefox */
  image-rendering: -o-crisp-edges; /* Opera */
  image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}

.header-title-bg:hover {
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  image-rendering: -moz-crisp-edges; /* Firefox */
  image-rendering: -o-crisp-edges; /* Opera */
  image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}

.hamburger-container {
  line-height: 65px;
  height: 65px;
  float: left;
  padding: 0 15px 0 13px;
}

.sys-float {
  .sys-func {
    margin-right: 20px;
  }
}

.sys-button {
  position: absolute;
  top: 50%;
  right: 32px;
  height: 30px;
  transform: translateY(-50%);
}

.sys-opt {
  float: left;
  height: 24px;
}

.sys-opt .func-cell {
  float: left;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  margin: 0;
}

.sys-opt .search {
  float: left;
  width: 24px;
  line-height: 24px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
}

.icon-skin:hover {
  transform: translateY(-20%);
  transition: all .5s linear;
}

.img {
  position: absolute;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  height: 16px;
  border-style: none;
  margin-left: -5px;
  margin-top: 10px;
}

.icon-full:hover {
  transform: translateY(-20%);
  transition: all .5s linear;
  background-position: center center !important;
}

.icon-exit:hover {
  transform: translateY(-20%);
  transition: all .5s linear;
}

.icon-person:hover {
  transform: translateY(-20%);
  transition: all .5s linear;
}

.icon-pwd:hover {
  transform: translateY(-20%);
  transition: all .5s linear;
}

.icon-secret:hover {
  transform: translateY(-20%);
  transition: all .5s linear;
}

.editBtn-bottoms {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 15px;
  height: 46px;
  text-align: right;
}

.sys-tenant {
  margin: 0;
  padding-left: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

.superAdmin {
  margin-bottom: 5px;
  width: 220px;
}

.superSpan {
  height: 50px;
}

.superImg {
  float: left;
  width: 25px;
  height: 25px;
  margin-top: 5px;
  border-radius: 50%;
  background: url("~@/assets/img/navbar/mini.png");
  background-size: 100%;
}

.superUser-name {
  color: #606266;
  margin-bottom: 10px;
}

.superUser-name2 {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: url("~@/assets/img/navbar/big.png");
  background-size: 100%;
}

.svg-icon.portrait {
  display: inline;
}

.exit {
  display: inline-block;
}

.el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:focus {
  background: #ffffff;
  @include color(color1);
}

.el-dropdown-menu {
  padding-bottom: 0;
}

.eee {
  top: 15px;
}
</style>
<style scoped>
.business-hamburger svg {
  opacity: 0;
}

::v-deep.name-el-dropdown .el-dropdown-menu__item:last-child > div {
  text-align: center;
}

::v-deep.name-el-dropdown .el-dropdown-menu__item .exit {
  display: inline-block;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

.business-navbar {
  position: relative;
}

.sys-float {
  position: absolute;
  right: 76px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

.sys-right {
  height: 100%;
}

.business-hamburger {
  position: fixed;
  bottom: 19px;
  left: 18px;
  width: 20px;
  padding: 0;
  height: 20px;
  background: url("~@/assets/business/framework/open.png");
  background-size: 100% 100%;
  display: flex;
}

.business-hamburger-active {
  transform: rotateY(180deg);
  left: 30px;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

.changeTenant {
  cursor: pointer;
  border-radius: 13px;
  width: 38px;
  height: 28px;
  display: inline-block;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  right: 162px;
  padding-left: 10px;
  background-size: 40px 40px;
  margin-right: 20px;
  @include background("background_tenant");
  background-position-x: 10px;
}

/*自定义欢迎页按钮样式*/
.sys-opt .welcome-cell {
  float: left;
  width: 108px;
  height: 24px;
  line-height: 24px;
  opacity: 1;
  // background: #1D6453;
  border-radius: 13px;
  cursor: pointer;
  outline: none;
  margin-right: 20px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
}

.edit-pwd-dialog .el-dialog {
  overflow: hidden !important
}
</style>

