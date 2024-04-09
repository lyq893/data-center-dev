<template>
  <div class="login-container1 business-login right-layout">
    <div class="login-bg-area">
      <div class="login-bg-content" :style="`background: ${background}`" />
    </div>
    <div class="login-box center-box">
      <div class="logo-title login-right-title">
        <blob-img v-if="personalizedConfig.logo" :src="personalizedConfig.logo" alt="" />
        <img v-else src="@/assets/business/login/logo.png">
        <span class="title_wel login_title_wel">{{ personalizedConfig.sysname }}</span>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        class="login-form login-form-right"
        :class="showTotp && showKaptcha ? 'form-higher' : 'form-lower'"
        auto-complete="on"
        label-position="left"
        :rules="rules"
      >
        <el-form-item prop="username" :class="[{user:isValidateUserName},showUsrInputStyle]" class="username">
          <jxd-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            :placeholder="$t('login.enterName')"
          >
            <template slot="prepend"><img src="@/assets/business/login/username-icon.png"></template>
          </jxd-input>
        </el-form-item>
        <el-form-item prop="password" :class="showPwdInputStyle">
          <el-input
            type="password"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            :placeholder="$t('login.enterPassword')"
            @keyup.enter.native="handleLogin"
          >
            <template slot="prepend"><img src="@/assets/business/login/password-icon.png"></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="kaptcha" v-if="showKaptcha" class="Verification-code" :class="showKapInputStyle">
          <el-input
            type="text"
            v-model="loginForm.kaptcha"
            name="kaptcha"
            :placeholder="$t('login.enterVerification')"
            @keyup.enter.native="handleLogin"
          >
            <template slot="prepend"><img src="@/assets/business/login/code-icon.png"></template>
            <template slot="append"><img
              class="verify-code"
              :src="kaptchaUrl"
              @click="getKaptcha"
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="totp" v-if="showTotp" :class="showTotpInputStyle">
          <el-input
            type="text"
            v-model="loginForm.totp"
            name="totp"
            auto-complete="on"
            :placeholder="$t('login.enterDPassword')"
            @keyup.enter.native="handleLogin"
          >
            <template slot="prepend"><img src="@/assets/img/login/login-pwd.png"></template>
          </el-input>
        </el-form-item>
        <el-button :loading="loading" type="primary" class="btn-save login-btn" @click.native.prevent="handleLogin">
          {{ $t('login.go') }}
        </el-button>
        <el-checkbox v-if="personalizedConfig.rememberpwd" v-model="remberPwdChecked" class="remember-pwd">
          {{ $t('login.rememberP') }}
        </el-checkbox>
        <div @click="forgetPwd" class="find_pwd">{{ $t('login.forgetP') }}</div>
      </el-form>
    </div>
    <div class="login-box login-footer" v-if="personalizedConfig.copyright != '-1'">Copyright &#169;
      {{ personalizedConfig.copyright }}
    </div>
  </div>
</template>

<script setup>
import { BlobImg } from 'hussar-base';
import { onMounted } from 'vue';
import { useLogin } from './useLogin';
import { useLoginConfig } from './useLoginConfig';
import jxdInput from '@/components/jxdInput/index';
// eslint-disable-next-line no-undef
const props = defineProps({
  personalizedConfig: Object
});

const {
  personalizedConfig
} = props;

const { background, innerBackground } = useLoginConfig();

const getLayoutData = useLoginConfig().getLayoutData;
const getBaseDataEncryption = useLoginConfig().getBaseDataEncryption;
const {
  showUsrInputStyle,
  showPwdInputStyle,
  showKapInputStyle,
  showTotpInputStyle,
  rules,
  loginFormRef,
  loading,
  loginForm,
  showTotp,
  showKaptcha,
  remberPwdChecked,
  isValidateUserName,
  kaptchaUrl,
  forgetPwd,
  handleLogin,
  getKaptcha,
  checkVerificationCodeShow
} = useLogin();

onMounted(() => {
  // 获取框架页配置信息
  getLayoutData();
  // 获取是否开启验证码
  checkVerificationCodeShow();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.changeLan {
  float: right;
  padding: 40px;
  padding-right: 80px;
}

.language {
  font-size: 14px;
  padding: 0;
  padding-right: 10px;
  padding-left: 10px;
  border-color: #ffffff !important;
  float: left;
  line-height: 24px;
  height: 22px;
  cursor: pointer;
}

.login-container1 {
  position: fixed;
  height: 100%;
  width: 100%;

  .box_left {
    width: 28%;
    background-size: 100% 100%;

    .login_logo {
      margin-top: 30px;
      margin-left: 60px;
      margin-right: 10px;
      width: 40px;
      float: left;
      height: 40px;
      background: url("~@/assets/img/login/logo.svg") no-repeat left center;
    }

    .login_info {
      margin-top: 4%;
      width: 40px;
      float: left;
      height: 40px;
      background: url("~@/assets/img/login/HUSSARLCDP.png") no-repeat left center;
    }

    .login_text {
      width: 90%;
      margin: 5% auto 0 0;
      height: auto;

      span {
        text-align: center;
        display: inline-block;
        width: 100%;
      }

      .info-wel {
        line-height: 60px;
        font-size: 37px;
        font-weight: normal;
        color: #245340!important;
      }

      .info-text {
        line-height: 36px;
        color: #757a85;
        font-size: 18px;
        font-weight: 500;
      }
    }

    .login_bg {
      width: 100%;
      height: 30%;

      .login_could {
        position: relative;
        width: 50%;
        height: 36%;
        background: url("~@/assets/img/login/cloud.png") no-repeat right bottom;
        background-size: 35%;
        animation: jump 1s infinite alternate ease-out
      }

      @keyframes jump {
        0% {
          transform: translateY(0)
        }
        100% {
          transform: translateY(-30%)
        }
      }

      .login-icon {
        width: 40%;
        float: right;
        height: 50%;
        margin-right: 12%;

        .el-col {
          height: 100%;
          text-align: center;
          padding-top: 18%;
          font-family: bus-PingFangSC;
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

  .box_right2 {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: auto;
    width: 43.5%;
  }

  .btn-save:hover {
    opacity: 0.65;
  }

  .box_right .login_title {
    font-family: bus-PingFangSC;
    font-weight: 400;
    color: rgba(206, 211, 221, 1);
    line-height: 29px;
    letter-spacing: 4px;
    font-size: 21px
  }

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

    .title_wel {
      font-family: bus-PingFang-SC;
      font-weight: 600;
      font-size: 34px;
      letter-spacing: 2px;
      color: rgba(39, 148, 248, 1);
      line-height: 80px;
      text-align: center;
    }
  }

  .find_pwd {
    position: relative;
    width: auto;
    float: right;
    cursor: pointer;
    font-size: 14px;
    margin: 29px 0 0;
    font-family: bus-PingFangSC;
    color: #666666;
    line-height: 20px;

    &:hover {
      color: var(--c-themeColor);
    }
  }
}
</style>
<style>
.business-login .el-form-item__content {
}

.business-login .el-form-item__content .el-input-group {
  height: 40px;
  border-bottom: 1px solid rgba(102, 102, 102, 0.4);
}

.business-login .el-input-group__prepend {
  border-width: 0;
  background: transparent;
  border-radius: 0;
  padding: 0;
}

.business-login .el-input-group__prepend img {
  margin-top: 4px;
}

.business-login .el-input__inner {
  border-width: 0;
  background: transparent;
  border-radius: 0;
  padding: 0 16px;
}

.business-login .el-input__inner:hover {

}

.business-login .el-input-group__append {
  background: transparent;
  border-width: 0;
  border-color: rgba(102, 102, 102, 0.4);
  padding: 0;
}

.business-login .el-checkbox__label {
  color: #666;
  line-height: 20px;
  padding-left: 4px;
  font-family: bus-PingFangSC;
}

.business-login .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #045340;
}

.business-login .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #045340;
  border-color: #045340;
}

.business-login .el-checkbox__inner:hover {
  border-color: #045340;
}

.business-login input:-internal-autofill-previewed,
.business-login input:-internal-autofill-selected {
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>
<style scoped>
.login-container1 {
  position: relative;
}

.center-box {
  width: 450px;
  height: 500px;
  background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.88));
  /*box-shadow: 0 15px 30px 0 rgba(0,0,0,0.04);*/
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 54px 65px 30px;
  text-align: center;
}

.login-footer {
  position: absolute;
  font-size: 12px;
  font-family: bus-PingFangSC;
  color: #727272;
  line-height: 20px;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

.login-form {
  width: 100%;
}

.logo-title {
  margin-bottom: 9px;
  display: flex;
  justify-content: left;
  align-items: center;
}

.login-title {
  justify-content: center;
  padding: 70px 16px;
}

.login-right-title {
  justify-content: center;
}

.logo-title span {
  padding-left: 16px;
}

.logo-title img {
  width: 32px;
  height: auto;
}

.title_wel {
  font-size: 26px;
  font-family: bus-PingFang-SC;
  color: rgba(255, 255, 255, 0.85);
  line-height: 37px;
  font-weight: 700;
}

.login_title_wel {
  color: #333333;
}

.btn-save.login-btn {
  background-color: var(--c-themeColor) !important;
}

.btn-save {
  width: 100%;
  height: 48px;
  background: #045340 !important;
  border-radius: 4px;
  box-shadow: 0 6px 10px 0 rgba(13, 142, 255, 0.20);
  font-size: 20px;
  font-family: bus-PingFangSC;
  color: #ffffff;
  line-height: 48px;
  padding: 0;
  margin: 40px 0 0;
  border: 0;
}

.el-form-item {
  margin: 29px 0 0;
}

.remember-pwd {
  margin-top: 29px;
  float: left;
}

.errors {
  position: relative;
  display: block;
  width: 100%;
  line-height: 30px;
  background: rgba(255, 245, 245, 1);
  border: 1px solid rgba(231, 115, 115, 1);
  border-radius: 3px;
  margin-top: 3px;
  color: #E77373;
  padding: 4px 10px;
  text-align: left;
  font-size: 12px;
  top: 1px;
  margin-bottom: -20px;
}

.errors:before /*, .el-form-item__error:before */
{
  content: "\e7a3";
  font-family: element-icons !important;
  margin-right: 2px;
  color: #E77373;
}

@media screen and (max-width: 1600px) {
  .center-box {
    top: 50%;
  }
}

.login-form-right >>> .el-input__inner {
  height: inherit;
}

.login-form-right >>> .el-form-item__content {
  border: 1px solid #dee1e8;
}

.login-form-right >>> .el-input-group {
  vertical-align: middle;
  margin-top: 0;
  border-bottom: none;
  margin-left: 12px;
  width: calc(100% - 12px)
}

/* 记住密码 */
.business-login ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--c-themeColor);
}

.business-login ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background: var(--c-themeColor);
  border-color: var(--c-themeColor);
}

.business-login ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: var(--c-themeColor);
}

.business-login ::v-deep .el-checkbox__inner:hover {
  border-color: var(--c-themeColor);
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.login-bg-content {
  height: 100%;
  background-size: 100% 100% !important;
}

.center-layout {
  background-size: 100% 100% !important;

  .login-bg-area {
    background: var(--c-themeColor);
    position: absolute;
    width: 400px;
    height: 500px;
    top: 50%;
    left: calc(50% - 200px);
    transform: translate(-50%, -50%);
  }

  .login-bg-content {
    // position: absolute;
    // width: 400px;
    // height: 500px;
    // top: 50%;
    // left: calc(50% - 200px);
    // transform: translate(-50%, -50%);
  }

  .center-box {
    left: calc(50% - 225px);
    transform: translate(50%, -50%);
  }
}

.right-layout {
  .login-bg-area {
    background: var(--c-themeColor);
    width: 60%;
    height: 100%;
  }

  .login-bg-content {
    width: 100%;
  }

  .login-box {
    width: 40%;
    right: 0;
    left: auto;
    transform: translate(0, -50%);
    padding: 54px 10% 30px;
    background: #fff;
    box-shadow: none;
  }

  .login-footer {
    text-align: center;
    padding: 0;
  }
}

.left-layout {
  .login-bg-content {
    width: 60%;
    position: absolute;
    right: 0;
  }

  .login-box {
    width: 40%;
    left: 0;
    transform: translate(0, -50%);
    padding: 54px 10% 30px;
    background: #fff;
    box-shadow: none;
  }
}
.inputStyle{
  :deep(.el-form-item__content){
    border: 1px solid #f56c6c !important;
  }
}

.Verification-code {
  .verify-code{
    width: 80px;
    height: 98%;
    cursor: pointer;
  }
}
</style>
