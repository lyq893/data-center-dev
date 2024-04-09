<template>
  <div class="list-container console-list-container">
    <div style="display: flex; height: 100%">
    </div>
    <EditInfo ref="editInfoRef" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { hussarAxiosRequestUtils, caching } from 'hussar-base';
import EditInfo from '../layout/components/Navbar/components/EditInfo';

export default {
  name: 'Dashboard',
  components: {
    EditInfo
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    return {
    };
  },
  methods: {
    getInfo() {
      if (caching.session.get('isAppMANAGE') == 'true') {
        hussarAxiosRequestUtils.getAction('/userFront/currentUserInfo').then(res => {
          if (res.code === 10000) {
            if (!res.data[0].char1) {
              this.$confirm('是否维护个人令牌?', '个人令牌为空', {
                confirmButtonText: '去维护',
                cancelButtonText: '取消',
                cancelButtonClass: 'dialog-cancel',
                confirmButtonClass: 'dialog-save',
                closeOnClickModal: false,
                showClose: false,
                dangerouslyUseHTMLString: true,
                type: 'warning',
                customClass: 'lcdp-message'
              }).then(() => {
                this.$refs.editInfoRef.openDrawer();
              }).catch(() => {});
            }
          }
        });
      }
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style lang="scss" scoped>
    .console-list-container{
        margin: -8px;
        padding: 0;
        overflow: hidden;
        background: #fff no-repeat left;
        background-size: auto 100%;
    }
    .consoleBg{
        padding-top: 9px;
        padding-bottom: 11px;
        height: 100%;
        position: relative;
        left: 156px;
    }

    .right{
        background: url("~@/assets/console_img/right.png") no-repeat right;
        background-size: 100% 100%;
        width: 42%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        .console-rightBox-top{
            width: 460px;
            float: right;
            padding-top: 40px;
            padding-left: 52px;
        }
        .console-rightBox-center{
            width: 460px;
            float: right;
            padding-top: 20px;
            padding-left: 52px;
        }
        .console-rightBox-bottom{
            width: 460px;
            float: right;
            padding-top: 20px;
            padding-left: 52px;
        }
    }
    .consoleLeftBox{
        height: 100%;
        width: 58%;
    }
    .valueContentTitle{
        color: #ffffff;
        height: 24px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        padding-left: 30px;
        background-size:72px 36px;
        background: url("~@/assets/console_img/Purple-title-bg.svg") no-repeat;
    }
    .valueContentTitle2{
        color: #ffffff;
        height: 24px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        padding-left: 30px;
        background-size:72px 36px;
        background: url("~@/assets/console_img/centerTitleBg.svg") no-repeat;
    }
    .valueContentTitle3{
        color: #ffffff;
        height: 24px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        padding-left: 30px;
        background-size:72px 36px;
        background: url("~@/assets/console_img/bottomTitleBg.svg") no-repeat;
    }
    .valueContentPadding{
        padding-top: 30px;
        display: inline-flex;
        span{
            display: inline-block;
            width: 206px;
            height: 24px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 24px;
            color: #5E5E5E;
            opacity: 1;
            padding-left: 25px;
            background: url("~@/assets/console_img/blue-dot.svg") no-repeat left;
        }
        .spanRight{
            margin-left: 40px;
        }
    }
    @media screen and (max-width: 1366px) {
        .right{
            width: 48%;
        }
        .consoleLeftBox{
            width: 52%;
        }
        .consoleBg{left: 140px}
        .valueContentPadding{padding-top: 18px}
        .valueContentPadding span{
            font-size: 14px;
        }
    }
    @media screen and (max-width: 1280px) {
        .right{
            width: 46%;
        }
        .consoleLeftBox{
            width: 54%;
        }
        .consoleBg{left: 30px}
        .valueContentPadding{padding-top: 18px}
        .valueContentPadding span{
            font-size: 14px;
            width: 185px;
        }
    }
    @media screen and (max-width: 1440px) {
        .valueContentPadding span{
            font-size: 16px;
        }
        .valueContentPadding{padding-left: 18px}
    }
</style>
