<template>
  <div class="navbar" :class="isOpened ? 'open':'close'">
    <!--  左侧 logo区域 -->
    <div class="logo-area flex flex-up-down">
      <img src="@/assets/img/qddtIcon5.png" class="bpm-logo" @click="toggleSideBarByLogo" v-if="!(isShow.hamburger && isOpened)">
      <img src="@/assets/img/qddtIcon4.png" class="bpm-font" v-if="isShow.hamburger && isOpened">
      <hamburger v-if="isShow.hamburger && isOpened" :toggle-click="toggleSideBar" :is-active="sidebar.opened"
                 :visibility="isHome" class="hamburger-container flex flex-up-down"
      />
    </div>

    <!-- 中间一级菜单区域  -->
    <div class="nav-menu">
      <el-menu
        class="nav-menu-list"
        mode="horizontal"
      >
        <el-menu-item
          @click="clickTopMenu(item,index)"
          class="nav-menu-item"
          :class="currentClass(index)"
          v-for="(item, index) in menuArr"
          :key="index"
          style="cursor: pointer"
        >
          <svg-icon :icon-class="item.meta.icon" class="font_family nav-menu-item-icon" />
          <span class="nav-menu-item-title">{{ item.meta.title }}</span>
        </el-menu-item>
        <el-submenu v-if="moreMenu.length > 0" class="nav-menu-item" index="4" popper-class="menu-popup"
                    :class="currentClass(5)"
        >
          <template slot="title">
            <svg-icon icon-class="more-menu" class="nav-menu-more-item-icon" />
            <span class="nav-menu-item-title">更多</span>
          </template>
          <el-menu-item v-for="(item, index) in moreMenu" :key="index" style="cursor: pointer"
                        @click="clickTopMenu(item,index + menuArr.length )" class="sebmenu-item"
                        :class="menuClass(index+menuArr.length)"
          >
            {{ item.meta.title }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <!-- 右侧登录用户区域   -->
    <div class="right-region">
      <div class="to-index-home">
        <a :href="indexHref" target="_blank"  v-if="!isAppManage">
          <div class="enterUser"><i class="showHelp font_family icon-qqb-enter-the-portal" />访问应用</div>
        </a>
      </div>
      <el-tooltip class="item" content="帮助中心" placement="bottom">
        <span @click="showHelp" :class="showTenant==='false' ? 'el-help-position' : 'el-help-positions'"><i
          class="showHelp font_family icon-qqb-help-center"
        /></span>
      </el-tooltip>
      <div class="sys-button">
        <div class="sys-avatar sys-tenant">
          <el-dropdown>
            <div class="superUser-name">
              <img src="~@/assets/img/navbar/big.png" class="avatar">
              <span class="name3">{{ name }}</span> <i class="font_family icon-bpm-lower-triangle triangle" /></div>
            <el-dropdown-menu slot="dropdown" class="name-el-dropdown">
              <el-dropdown-item>
                <div @click="showStaffInfo" class="flex flex-up-down">
                  <i class="font_family icon-qingqibing_gerenxinxi" />
                  <span>{{ $t('navbar.person') }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="isIam != 'true'">
                <div @click="showChangePwd" class="flex flex-up-down">
                  <i class="font_family icon-qingqibing_xiugaimima" />
                  <span>{{ $t('navbar.changP') }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="isIam != 'true'">
                <div @click="setSecretQuestion" class="flex flex-up-down">
                  <i class="font_family icon-qingqibing_shezhimibao" />
                  <span>{{ $t('navbar.setS') }}</span>
                </div>
              </el-dropdown-item>
              <div style=" width: 100%; height: 1px; border-top: solid #cccccc 1px;" />
              <el-dropdown-item>
                <div @click="logout" style="text-align: center" class="flex flex-up-down">
                  <i class="font_family icon-qingqibing_tuichuzhanghu" />
                  <span>{{ $t('navbar.exit') }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!--个人信息修改-->
    <EditInfo ref="editInfoRef" />

    <!--修改密码-->
    <EditPwd ref="editPwdRef" />

    <!--设置密保-->
    <SetSecret ref="setSecretRef" @firstSet="firstSet" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { caching, hussarAxiosRequestUtils, TreeIconContent } from 'hussar-base';

import { userApi } from 'hussar-authorization';
import { LoginApi } from '@/api/loginApi';
import { Hamburger } from 'hussar-common';
import '@/styles/variables.scss';
import EditInfo from './components/EditInfo';
import EditPwd from './components/EditPwd';
import SetSecret from './components/SetSecret';
import { OPEN_MODE_EXTERNAL } from '@/utils/Constants';

window.document.documentElement.setAttribute('data-theme', caching.session.get('HussarTheme'));

export default {
  components: {
    EditPwd,
    EditInfo,
    SetSecret,
    Hamburger
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
      'permission_routers',
      'arrHead'
    ]),
    isOpened() {
      return this.$store.state.app.sidebar.opened;
    },
    isHome() {
      return !!this.isWelcome;
    },
    isIam() {
      return caching.session.get('isIAM');
    },
    isAppManage() {
      return JSON.parse(process.env.VUE_APP_APPMANAGE);
    }
  },
  data() {
    return {
      parent: {},
      isFirstHome: true,
      currentNumber: -1, // 用来判断active样式类是否显示
      menuNumber: -1, // 用来判断activeMore样式类是否显示
      indexHref: '',
      isShow: {
        changeTenant: false,
        tenantPwd: false,
        hamburger: true
      },
      loading: false,
      formLabelWidth: '132px',
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
      // 弹出框保存是否加载
      dialogSubBtn: false,
      // 弹出框树是否显示
      treeShow: false,
      // 选中的节点
      checkedDataForTenant: undefined,
      tenantForm: {
        password: '',
        kaptcha: '',
        totp: ''
      },
      showTotp: false,
      showKaptcha: false,
      kaptchaUrl: '',
      // 切换租户时是否需要密码
      showTenantPwd: false,
      path: 'http://localhost:8888/hussarBpm/static/bpm/index.html',
      moreMenu: [],
      menuArr: []
    };
  },
  mounted() {
    // eslint-disable-next-line no-undef
    window.document.documentElement.setAttribute('international-style', this.$store.getters.internationalization);
  },
  methods: {
    // 获取菜单
    getMenu(allMenu) {
      const menuClientWidth = document.getElementsByClassName('nav-menu')[0].clientWidth;
      const menuWidth = allMenu.length * 130;
      if (menuWidth > menuClientWidth) {
        const moreNumber = Math.ceil((menuWidth - menuClientWidth) / 130) + 1;
        this.moreMenu = allMenu.slice(-moreNumber);
        this.menuArr = allMenu.slice(0, allMenu.length - moreNumber);
      } else {
        this.menuArr = allMenu;
      }
    },
    clickTopMenu(item, index) {
      if (item.openMode === OPEN_MODE_EXTERNAL) {
        window.open(item.meta.externalLinks);
      } else {
        this.$nextTick(function () {
          document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
        });
        this.$store.commit('setItemObj', { itemObj: item });
        if (index >= this.menuArr.length) {
          this.currentNumber = this.menuArr.length;
        } else {
          this.currentNumber = index;
        }
        this.menuNumber = index;
        var arr = [];
        arr.push(item);
        this.$emit('changeIndex', arr);
        document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
        if (caching.session.get('indexSidebarStatus') === 1) {
          this.isShow.hamburger = false;
        } else {
          this.isShow.hamburger = true;
        }
        this.isFirstHome = false;
      }
    },
    currentClass(index) {
      if (this.currentNumber === index) {
        return 'active';
      } else if (this.moreMenu.length !== 0 && this.currentNumber === index) {
        return 'active';
      } else {
        return '';
      }
    },
    menuClass(index) {
      return [this.menuNumber === index ? 'activeMore' : ''];
    },
    showStaffInfo() {
      this.$refs.editInfoRef.openDrawer();
    },
    // 打开设置密保对话框
    setSecretQuestion() {
      this.$refs.setSecretRef.openDrawer(false);
    },
    // 判断是否需要强制用户修改密码
    isForceChangePwd() {
      hussarAxiosRequestUtils.getAction(userApi.AuthorityUserApi.forceChangePwd).then(res => {
        if (res.code === 10000) {
          if (res.data.changePwd === 'YES' && res.data.firstLogin === 'YES') {
            this.$refs.setSecretRef.openDrawer(true);
          } else if (res.data.changePwd === 'NO' && res.data.firstLogin === 'YES') {
            this.$refs.setSecretRef.openDrawer(true);
          } else if (res.data.changePwd === 'YES' && res.data.firstLogin === 'NO') {
            this.$refs.editPwdRef.openDrawer(true);
          }
        }
      });
    },
    showChangePwd() {
      this.$refs.editPwdRef.openDrawer(false);
    },
    firstSet() {
      this.$refs.editPwdRef.openDrawer(true);
    },
    toggleSideBar() {
      this.$nextTick(function () {
        document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
      });
      this.$store.dispatch('ToggleSideBar').then(() => {
        // 重新渲染需要时间
        setTimeout(() => {
          this.getMenu(this.arrHead);
        }, 100);
      });
      if (caching.session.get('indexSidebarStatus') === 1) {
        this.isShow.hamburger = false;
        this.$nextTick(function () {
          document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
        });
      } else {
        this.isShow.hamburger = true;
        this.$nextTick(function () {
          document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
        });
      }
    },
    toggleSideBarByLogo() {
      if ((!this.isShow.hamburger && document.getElementsByClassName('app-home').length === 0) || (!this.isOpened && !this.isFirstHome)) {
        this.$store.dispatch('ToggleSideBar').then(() => {
          // 重新渲染需要时间
          setTimeout(() => {
            this.getMenu(this.arrHead);
          }, 100);
        });
        this.$nextTick(function () {
          document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
        });
        if (caching.session.get('indexSidebarStatus') === 1) {
          this.isShow.hamburger = false;
          this.$nextTick(function () {
            document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
          });
        } else {
          this.isShow.hamburger = true;
          this.$nextTick(function () {
            document.getElementsByClassName('app-wrapper')[0].classList.remove('app-home');
          });
        }
      }
    },
    logout() {
      const ipAddress = window.location.host;
      const protocol = window.location.protocol;
      this.$confirm(this.$t('navbar.confirmExit'), this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        cancelButtonClass: 'dialog-cancel',
        confirmButtonClass: 'dialog-save',
        showClose: false,
        closeOnClickModal: false,
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
              const url = 'https://idp.qd-metro.com:8086/idp/profile/OAUTH2/Redirect/GLO?redirctToUrl=' + protocol + '//' + ipAddress + '/console.html&redirectToLogin=true&entityId=' + process.env.VUE_APP_ENTITY_ID;
              location.assign(url);
              console.log('平台登出');
            }
          }).catch(() => {
            location.assign('');
          });
        }).catch(() => {
          location.assign('');
        });
      }).catch((res) => {
        console.log(res);
      });
    },
    showTotpKapcha() {
      hussarAxiosRequestUtils.postAction(LoginApi.getTotpKapcha).then(res => {
        if (res.code === 10000) {
          this.showTotp = res.data.totp;
          this.showKaptcha = res.data.kaptcha;
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
    //  进入工作流
    openBPM() {
      window.open('http://localhost:8888/hussarBpm/static/bpm/index.html');
    },
    showHelp() {
      window.open('http://lcdp-help.qd-metro.com:8080/help/');
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
    findUrl(data, path) {
      const headData = caching.session.get('arrHead');
      for (let j = 0; j < headData.length; j++) {
        if (headData[j].children) {
          if (data[0].path === headData[j].children[0].path) {
            this.parent = data;
            break;
          }
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          this.findUrl(data[i].children, path);
        } else {
          if (data[i].path === path) {
            const currentMenu = [{ children: [] }];
            currentMenu[0].children = this.parent;
            this.$emit('changeIndex', currentMenu);
            for (let k = 0; k < this.arrHead.length; k++) {
              if (this.arrHead[k].children) {
                if (this.arrHead[k].children[0].path === this.parent[0].path) {
                  this.currentNumber = k;
                  break;
                }
              }
            }
            break;
          }
        }
      }
    },
    getArrHead() {
      if (caching.session.get('arrHead')) {
        this.findUrl(caching.session.get('arrHead'), this.$route.path);
      }
    }
  },
  created() {
    this.isForceChangePwd();
    this.showTotpKapcha();
    if (window.location.href.slice(0, window.location.href.indexOf('/console')).indexOf('static') > -1) {
      this.indexHref = window.location.href.slice(0, window.location.href.indexOf('/console')) + '/index.html#/';
    } else {
      this.indexHref = window.location.href.slice(0, window.location.href.indexOf('/console'));
    }

    this.getArrHead();
    if (caching.session.get('indexSidebarStatus') === 1 && this.$route.path !== '/index') {
      this.isShow.hamburger = false;
    }
    if (this.$route.path !== '/index') {
      this.isFirstHome = false;
    }
    this.$nextTick(() => {
      this.getMenu(this.arrHead);
    });
    window.addEventListener('resize', (e) => {
      this.$nextTick(() => {
        this.moreMenu = [];
        this.getMenu(this.arrHead);
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getMenu(this.arrHead));
  }
};
</script>
<style>
.dialogFitHeight {
  overflow: auto
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$console-menu-width: 220px;
$console-menu-close-width: 65px;
$header-height: 80px;
$header-right: 300px;
$header-center: calc(100% - #{$console-menu-width} - #{$header-right});
$header-center-close-width: calc(100% - #{$console-menu-close-width} - #{$header-right});
.navbar {
  background: #045340 no-repeat left;
  display: flex;
  flex-wrap: nowrap;

  /*左侧logo区域*/
  .logo-area {
    width: $console-menu-width;
    height: 100%;
    line-height: $header-height;
    padding-left: 16px;
    font-weight: bold;
    font-size: 24px;
    color: #fff;
    box-shadow: 1px 0px 5px 0px #01010126;
    transition: all 0.2s;
    overflow: hidden;

    .bpm-logo {
      width: 40px;
      height: 40px;
    }

    .bpm-font {
      width: 135px;
      height: 40px;
    }

    .hamburger-container {
      height: 80px;
      padding: 0 12px 0 16px;
    }
  }

  /*中间菜单区域*/
  .nav-menu {
    width: $header-center;
    height: 100%;

    .active {
      background-color: #1D6453!important;
    }

    .nav-menu-list {
      height: 100%;
      background-color: transparent;
      border: none;

      .nav-menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        width: 130px;
        height: 100%;

        &:hover {
          background-color: #1D6453
        }

        &:focus {
          background-color: rgba(4, 83, 64, 0.6);
        }

        .nav-menu-item-icon {
          color: white;
          font-size: 30px;
        }

        .nav-menu-more-item-icon {
          width: 32px;
          height: 32px;
        }

        .nav-menu-item-title {
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          font-weight: 600;
          padding-top: 5px;
        }

        .nav-menu-list {
          height: 100%;
        }
      }
    }
  }

  /*右侧区域*/
  .right-region {
    width: $header-right;
    height: $header-height;
    line-height: $header-height;
    display: flex;
    align-items: center;
    transition: all 0.2s;

    /*访问门户*/
    .to-index-home {
      width: 110px;

      .enterUser {
        cursor: pointer;
        width: 96px;
        height: 24px;
        display: inline-block;
        color: #fff;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
        background: #1D6453;
        border-radius: 13px;
        margin-right: 14px;

        &:hover {
          border-radius: 13px;
          background: #094638;
        }
      }
    }

    /*帮助中心*/
    .el-help-positions {
      width: 30px;
      margin-right: 8px;
    }

    .el-help-position {
      margin-right: 16px;
    }

    /*用户按钮*/
    .sys-button {
      display: flex;
      justify-content: center;
      align-items: center;

      .superUser-name {
        display: flex;
        align-items: center;
        position: relative;
        height: 30px;
      }

      .sys-avatar {
        margin-right: 0px;
        padding-left: 0px;
        height: 30px;
        margin-top: 0;
        cursor: pointer;
      }

    }
  }
}

/*左侧菜单折叠时*/
.navbar.close{
  .logo-area{
    width: $console-menu-close-width;
    padding-left: 12px !important;
    padding-right: 5px;
    cursor: pointer;
  }

  .nav-menu{
    width:$header-center-close-width;
  }
}
.avatar {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}

.changeTenant {
  cursor: pointer;
  border-radius: 13px;
  width: 38px;
  height: 28px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  position: absolute;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  right: 195px;
  padding-left: 10px;
  background-size: 40px 40px;
  background: #045340 url("~@/assets/console_img/changeTenant.svg") no-repeat left;
  background-position-x: 10px;
}

.focusing {
  outline-width: 0;
}

.language {
  font-size: 16px;
  padding: 0 10px;
  border-color: #ffffff !important;
  float: left;
  line-height: 24px;
  height: 22px;
  cursor: pointer;
}

.logo-area img {
  margin-right: 8px;
  vertical-align: middle;
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

.sys-float {
  .sys-right {
    float: right;
    /*top: 15px;*/
    /*right: 70px;*/
    height: 38px;
    right: 176px;
    position: absolute;
  }

  .sys-func {
    float: right;
    top: 15px;
    right: 172px;
    height: 38px;
  }
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

.el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:focus {
  background: #ffffff;
  color: #045340;
}

.el-dropdown-menu {
  padding-bottom: 0;
}

.showHelp {
  cursor: pointer;
  color: #fff;
}

.triangle {
  color: #fff;
  line-height: 30px;
}

.sys-button .sys-avatar .name3 {
  max-width: 80px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

</style>
<!--// 菜单样式-->
<style lang="scss" scoped>
// 更多 样式
::v-deep .el-submenu {

  .el-submenu__title {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(4, 83, 64, 0.6);
    }

    .el-submenu__icon-arrow {
      display: none;
    }
  }
}

//更多下拉框的样式
.el-menu--horizontal .el-menu .el-menu-item.is-active, .el-menu--horizontal .el-menu .el-submenu.is-active > .el-submenu__title {
  color: #545672;
  padding: 0 16px;
  height: 40px;
}

.el-menu--horizontal .el-menu .el-menu-item.is-active.activeMore {
  color: #045340;
  background-color: #DDE5E3;
}

.el-menu--horizontal .sebmenu-item:not(.is-disabled):hover, .el-menu--horizontal .sebmenu-item:not(.is-disabled):focus {
  color: #045340;
  background-color: #DDE5E3;
}
</style>
<style lang="scss">
.name-el-dropdown {
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.20);
  padding-top: 2px;
  border-radius: 2px;

  .popper__arrow {
    left: 80px !important;
  }

  .el-dropdown-menu__item {
    width: 126px;
    line-height: 40px;
    color: #545672;
    font-size: 14px;
  }

  .el-dropdown-menu__item i {
    margin-right: 6px;
    font-size: 16px;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #DDE5E3;
  }
}

</style>
<style>
.menu-popup .el-menu--popup {
  width: 170px;
  min-width: 170px;
  padding: 0;
}
</style>
