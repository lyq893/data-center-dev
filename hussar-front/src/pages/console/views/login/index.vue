<template>
  <div class="login-container">
    <div class="login-box box_left">
      <div class="login_logo">
        <img src="@/assets/img/qddtIcon4.png" style="width: 220px">
      </div>
      <div class="login_info" />
      <div class="login_bg">
        <div class="login-icon">
          <el-col class="right-icon" :span="8">{{ $t('login.lcdp') }}</el-col>
          <el-col class="left-icon" :span="8">{{ $t('login.hs') }}</el-col>
          <el-col class="mid-icon" :span="8">{{ $t('login.local') }}</el-col>
        </div>
      </div>
    </div>
    <div class="login-box box_right">
      <!--      <div class="changeLan">-->
      <!--        <el-tooltip class="item" effect="light" placement="bottom" manual>-->
      <!--          <span class="language" @click="changeLanguage('zh')"-->
      <!--                :style="internationalization==='zh' ? 'color:#3a6fff;font-size:14px': 'color:#c3cad8;'">中文</span>-->
      <!--        </el-tooltip>-->
      <!--        <div style="float:left;width: 1px;height: 25px; background: #C3CAD8;"/>-->
      <!--        <el-tooltip class="item" effect="light" placement="bottom" manual>-->
      <!--          <span class="language" @click="changeLanguage('en')"-->
      <!--                :style="internationalization==='en' ? 'color:#3a6fff;font-size:14px': 'color:#c3cad8;'">English</span>-->
      <!--        </el-tooltip>-->
      <!--      </div>-->
      <el-form
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        :class=" showTotp && showKaptcha ? 'form-higher' : 'form-lower'"
        auto-complete="on"
        label-position="left"
        :rules="rules"
      >
        <div class="title">
          <span class="login_title">Welcome to</span>
          <span class="title_wel">低代码开发平台</span>
        </div>
        <el-form-item prop="username" :class="{user:isValidateUserName}" class="username">
          <jxd-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            :placeholder="$t('login.enterName')"
            :class="showUsrInputStyle"
          >
            <template slot="prepend"><img src="@/assets/img/login/login-user.png"></template>
          </jxd-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            :placeholder="$t('login.enterPassword')"
            @keyup.enter.native="handleLogin"
            :class="showPwdInputStyle"
          >
            <template slot="prepend"><img src="@/assets/img/login/login-pwd.png"></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="kaptcha" v-if="showKaptcha" class="kaptcha">
          <el-input
            type="text"
            v-model="loginForm.kaptcha"
            name="kaptcha"
            :placeholder="$t('login.enterVerification')"
            @keyup.enter.native="handleLogin"
            :class="showKapInputStyle"
          >
            <template slot="append">
              <img
                style="width: 80px; height: 37px;cursor: pointer;"
                :src="kaptchaUrl"
                @click="getKaptcha"
              >
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="totp" v-if="showTotp" class="totp">
          <el-input
            type="text"
            v-model="loginForm.totp"
            name="totp"
            auto-complete="on"
            :placeholder="$t('login.enterDPassword')"
            @keyup.enter.native="handleLogin"
            :class="showTotpInputStyle"
          >
            <template slot="prepend"><img src="@/assets/img/login/login-pwd.png"></template>
          </el-input>
        </el-form-item>
        <el-button :loading="loading" type="primary" class="btn-save" @click.native.prevent="handleLogin">
          {{ $t('login.go') }}
        </el-button>
        <div @click="forgetPwd" class="find_pwd">
          {{ $t('login.forgetP') }}
        </div>
      </el-form>
<!--      <div class="login-footer">© 2016-{{ year }} 金现代信息产业股份有限公司</div>-->
    </div>
  </div>
</template>

<script>
import { hussarAxiosRequestUtils, HussarPasswordEncryption } from 'hussar-base';
import { LoginApi } from '@/api/loginApi';
import { v1 as uuid } from 'uuid';
import jxdInput from '@/components/jxdInput/index';

export default {
  name: 'Login',
  components: {
    jxdInput
  },
  computed: {
    internationalization() {
      return this.$store.getters.internationalization;
    }
  },
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.userNameNotNull')));
        this.showUsrInputStyle = 'inputStyle';
      } else {
        this.showUsrInputStyle = '';
        callback();
      }
    };
    var validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.passwordNotNull')));
        this.showPwdInputStyle = 'inputStyle';
      } else {
        this.showPwdInputStyle = '';
        callback();
      }
    };
    var validateKaptcha = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.verificationNotNull')));
        this.showKapInputStyle = 'inputStyle';
      } else {
        this.showKapInputStyle = '';
        callback();
      }
    };
    var validateTotp = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.DPasswordNotNull')));
        this.showTotpInputStyle = 'inputStyle';
      } else {
        this.showTotpInputStyle = '';
        callback();
      }
    };
    return {
      rules: {
        username: [
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePwd, trigger: 'blur' }
        ],
        kaptcha: [
          { validator: validateKaptcha, trigger: 'blur' }
        ],
        totp: [
          { validator: validateTotp, trigger: 'blur' }
        ]
      },
      loginForm: {
        username: '',
        password: '',
        kaptcha: '',
        totp: '',
        kaptchasuffix: ''
      },
      // loginRules: {
      //   username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      //   password: [{ required: true, trigger: 'blur', validator: validatePass }]
      // },
      publicKey: '',
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      isValidateUserName: false,
      isValidatePassword: false,
      isValidateKaptcha: false,
      isValidateTotp: false,
      validateInfoUserName: '',
      validateInfoPassword: '',
      validateInfoKaptcha: '',
      validateInfoTotp: '',
      showTotp: false,
      showKaptcha: false,
      kaptchaUrl: '',
      year: '',
      showUsrInputStyle: '',
      showPwdInputStyle: '',
      showKapInputStyle: '',
      showTotpInputStyle: ''
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getBaseDataEncryption();
    this.checkShow();
    this.getData();
  },
  methods: {
    getData() {
      const newTime = new Date();
      this.year = newTime.getFullYear();
    },
    changeLanguage(value) {
      this.$i18n.locale = value;
      this.$store.dispatch('setLanguage', value);
      window.document.documentElement.setAttribute('international-style', value);
      document.getElementById('indexTitle').innerText = this.$t('navbar.title');
      window.vm = this;
    },
    checkShow() {
      hussarAxiosRequestUtils.postAction(LoginApi.getTotpKapcha).then(res => {
        if (res.code === 10000) {
          this.showTotp = res.data.totp;
          this.showKaptcha = res.data.kaptcha;
          // 多租户模式下需要填写租户编号时，显示租户编号
          if (this.showKaptcha) {
            this.getKaptcha();
          }
        }
      });
    },
    getKaptcha() {
      var api = window.baseUrl;
      const randomUuid = uuid();
      this.loginForm.kaptchasuffix = randomUuid;
      this.kaptchaUrl = api + LoginApi.getKaptchaUrl + '?t=' + new Date().getTime() + '&kaptchasuffix=' + randomUuid;
    },
    forgetPwd() {
      this.$router.push({
        path: '/forgetPwd'
      });
    },
    getBaseDataEncryption() {
      this.$store.dispatch('getBaseDataEncryption');
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      if (this.loading) {
        return;
      }
      if (this.loginForm.username === '') {
        this.$refs.loginForm.validateField('username');
        this.showUsrInputStyle = 'inputStyle';
        return;
      }
      if (this.loginForm.password === '') {
        this.$refs.loginForm.validateField('password');
        this.showPwdInputStyle = 'inputStyle';
        return;
      }
      if (this.showKaptcha && this.loginForm.kaptcha === '') {
        this.$refs.loginForm.validateField('kaptcha');
        this.showKapInputStyle = 'inputStyle';
        return;
      }
      if (this.showTotp && this.loginForm.totp === '') {
        this.$refs.loginForm.validateField('totp');
        this.showTotpInputStyle = 'inputStyle';
        return;
      }
      this.loading = true;
      const passwordEncryption = new HussarPasswordEncryption();
      const userInfo = {
        username: this.loginForm.username,
        password: passwordEncryption.encrypt(this.loginForm.password), // pwd
        code: '',
        randomStr: 'blockPuzzle',
        isIndex: 'console',
        kaptcha: this.loginForm.kaptcha,
        totp: this.loginForm.totp,
        kaptchasuffix: this.loginForm.kaptchasuffix
      };

      this.$store.dispatch('Login', { userInfo }).then(res => {
        this.loading = false;
        this.isValidateUserName = false;
        this.isValidatePassword = false;
        this.isValidateKaptcha = false;
        this.isValidateTotp = false;
        let path = this.$route.query.toPath;
        if (!path) {
          path = '/';
        }
        const obj = { ...this.$route.query, toPath: '', systemParams: this.$route.query.systemParams };
        for (const key in obj) {
          if (!obj[key]) {
            delete obj[key];
          }
        }
        this.$router.push({ path: path, query: obj });
      }).catch((res) => {
        this.loginForm.kaptcha = '';
        this.loginForm.totp = '';
        this.loading = false;
        if (this.showKaptcha) {
          this.getKaptcha();
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

$left-box-width: 56.5%;
$right-box-width: 43.5%;
$mid-form-item-height: 54px;

/*整个登录页*/
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #FFFFFF;

  .login-box {
    float: left;
    height: 100%;

    /*左侧盒子*/
    &.box_left {
      width: $left-box-width;
      background: url("~@/assets/img/login/qddt_left_img.png");
      background-size: 100% 100%;

      .login_logo {
        margin-top: 4%;
        margin-left: 6%;
        width: 5%;
        float: left;
        height: 59px;
        //background: url("~@/assets/img/login/qddtIcon2.png") no-repeat left center;
      }

      .login_info {
        margin-top: 4%;
        width: 85%;
        float: left;
        height: 59px;
        //background: url("~@/assets/img/login/HUSSARLCDP.png") no-repeat left center;
      }

      .login_bg {
        width: 100%;
        height: 30%;

        .login-icon {
          width: 40%;
          float: right;
          height: 50%;
          margin-right: 12%;

          .el-col {
            height: 100%;
            text-align: center;
            padding-top: 18%;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 29px;
            font-size: 19px;
            letter-spacing: 1px;
          }

          .left-icon {
            background: url("~@/assets/img/login/left_icon.png") no-repeat top center;
            background-size: 48%;
          }

          .mid-icon {
            background: url("~@/assets/img/login/mid_icon.png") no-repeat top center;
            background-size: 48%
          }

          .right-icon {
            background: url("~@/assets/img/login/right_icon.png") no-repeat top center;
            background-size: 48%
          }
        }
      }
    }

    /*右侧侧盒子*/
    &.box_right {
      width: $right-box-width;

      /*中英文切换*/
      .changeLan {
        float: right;
        padding: 40px 80px 40px 40px;

        .language {
          font-size: 14px;
          padding: 0 10px;
          border-color: #ffffff !important;
          float: left;
          line-height: 24px;
          height: 22px;
          cursor: pointer;
        }
      }

      /*登录表单标题*/
      .title {
        width: 100%;
        margin-bottom: 15%;

        span {
          display: inline-block;
          width: 100%;
          line-height: 48px;
          font-size: 32px;
          color: #245340!important;
          text-align: left;
          font-weight: bold;
        }

        .login_title {
          font-weight: 400;
          color: rgba(206, 211, 221, 1);
          line-height: 29px;
          letter-spacing: 4px;
          font-size: 21px
        }

        .title_wel {
          white-space: nowrap;
          font-weight: 600;
          font-size: 36px;
          letter-spacing: 2px;
          color: #345340;
          line-height: 80px;
        }
      }

      /*登录表单*/
      .login-form {
        position: relative;
        left: 0;
        right: 0;
        width: 47%;
        max-width: 100%;
        margin: 15% auto 9%;

        :deep(.el-form-item) {
          width: 100%;
          margin-bottom: 5%;

          .el-form-item__label {
            font-weight: 400;
            color: rgba(206, 211, 221, 1);
            line-height: 40px;
          }

          .el-form-item__content {
            margin-left: 0;
            margin-top: 5%;
            height: $mid-form-item-height;

            .el-input {
              height: 100%;
              border: 1px solid #DDE5E3;
              border-radius: 4px;

              .el-input-group__prepend {
                border: none;
              }

              .el-input__inner {
                height: 100%;
                line-height: 54px;
                background: #ffffff;
                border: none;
                border-right: 1px solid #ffffff;
              }

              .el-input__inner:-webkit-autofill {
                //-webkit-text-fill-color: #fff!important;
                //background-color: #fff!important;
              }
            }
          }

          &.is-error {
            .inputStyle {
              border: 1px solid #f56c6c;
            }
          }
        }

        :deep(.kaptcha){
          .el-input-group__append{
            border:none;
          }
        }
        /*登录按钮*/
        .btn-save {
          width: 100%;
          height: $mid-form-item-height;
          line-height: 25px;
          margin-top: 5%;
          font-size: 14px;
          font-weight: 500;
          border: 0 solid transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 1);
          background: linear-gradient(225deg, rgba(52,83,64, 1) 0%, rgba(29,100,83, 1) 100%);
          box-shadow: 0px 4px 12px 0px rgba(52,83,64, 0.54);
          text-shadow: 0px 4px 12px rgba(52,83,64, 0.54);

          &:hover {
            opacity: 0.65;
          }
        }

        /*忘记密码*/
        .find_pwd {
          position: relative;
          width: auto;
          float: right;
          text-align: right;
          line-height: 20px;
          cursor: pointer;
          font-size: 14px;
          margin: 5% 2% 7%;
          font-weight: 400;
          color: #345340;
        }
      }

      /*版权信息*/
      .login-footer {
        margin: 0 auto;
        width: 70%;
        text-align: center;
        color: #ccc;
      }
    }
  }
}

.login-container .login-form .el-button.is-loading:before {
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

/*取消微软浏览器的密码小眼睛样式*/
input[type="password"]::-ms-reveal {
  display: none;
}

/*缩放125%*/
@media screen and (max-width: 1600px) {
  .login-form {
    width: 46% !important;
  }
  .form-higher {
    margin: 3% auto 25% !important;
  }
  .form-lower {
    margin: 15% auto 25% !important;
  }

  .login-container .login-box {
    /*左侧盒子*/
    &.box_left {
      .login_logo {
        margin-top: 2%;
        background-size: 85%;
      }

      .login_info {
        margin-top: 2%;
        background-size: 12%;
      }

      .login_bg {
        .login-icon {
          .el-col {
            font-size: 14px;
          }
        }
      }
    }

    $form-height: 42px;

    &.box_right {
      /*登录表单标题*/
      .title {
        .login_title {
          font-size: 16px;
        }

        .title_wel {
          font-size: 25px;
          line-height: 48px;
        }
      }

      .login-form {
        :deep(.el-form-item) {
          .el-form-item__content {
            height: $form-height;

            .el-input {
              font-size: 12px;

              .el-input-group__prepend {
                height: $form-height;
              }

              .el-input__inner {
                height: $form-height;
                line-height: $form-height;
              }
            }
          }
        }

        .btn-save {
          height: $form-height;
        }
      }
    }
  }
}
</style>
