<template>
  <div class="http423">
    <div style="z-index: 100; margin: 0 auto;padding-top: 15px;">
      <el-button @click="skip" type="primary" class="btn-blue hussarbase">申请授权</el-button>
    </div>
    <div id="right-tips">
      <div id="tips">
        <div class="icon-tel" />
        <div>售前支持</div>
      </div>
      <div id="tips-list">
        <ul>
          <li v-for="(item,key) in list" :key="key">{{ item.name }}&nbsp;{{ item.telephone }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { license } from 'hussar-operations';
import { hussarAxiosRequestUtils } from 'hussar-base';
export default {
  name: 'Page404',
  data() {
    return {
      list: []
    };
  },
  computed: {
    message() {
      return '网管说这个页面你不能进......';
    }
  },
  mounted() {
    this.getContact();
  },
  methods: {
    skip() {
      this.$router.push({
        path: '/license'
      });
    },
    getContact() {
      hussarAxiosRequestUtils.getAction(license.LicenseApi.getContact).then(res => {
        if (res.code === 10000) {
          this.list = res.data;
        }
      });
    }
  }

};

</script>

<style scoped>
    .http423{
        display: flex;
        height: 100%;
        padding-top: 30%;
        background: #fff url('~@/assets/403_images/423.png') no-repeat center 40%;
    }
    .pic-423{
        flex: 1;
        text-align: right;
    }
    .pic-423> img{
        position: relative;
        top: 240px;
    }
    .text-423{
        flex: 1;
        padding-left: 10px;
    }
    .text-423> div{
        position: relative;
        top: 330px;
    }
    .title-423{
        height:58px;
        font-size:50px;
        font-family:DINAlternate-Bold,DINAlternate;
        font-weight:bold;
        color:rgba(133,202,247,1);
        line-height:58px;
        letter-spacing:1px;
    }
    .content-423{
        height:21px;
        font-size:16px;
        font-family:MicrosoftYaHei;
        color:rgba(155,157,163,1);
        line-height:21px;
        letter-spacing:1px;
    }
    .hussarbase{
      width: 80px;
      height: 34px;
      font-size: 16px;
      border-radius: 4px;
      padding: 0;
      outline: none;
      text-align: center;
      vertical-align:middle
    }
</style>
<style>
    /* 右侧售前联系人样式*/
    #right-tips{
        right: 50px;
        bottom: 200px;
        position: fixed;
    }
    #tips{
        width: 40px;
        height: 134px;
        padding: 15px 10px;
        background: #045340;
        color: #fff;
        font-size: 16px;
        line-height: 20px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    #tips-list{
        position: fixed;
        right: 90px;
        bottom: 210px;
        display: none;
        width: 182px;
        height: 115px;
    }
    #right-tips>#tips-list>ul{
        position: fixed;
        right: 100px;
        bottom: 210px;
        display: none;
        width: 202px;
        height: 94px;
        background: rgba(255,255,255,1);
        box-shadow: 0px 0px 5px 0px rgba(51,51,51,0.15);
        border: 1px solid rgba(232,232,232,1);
        list-style: none;
        padding: 10px 15px;
        box-sizing: border-box;
    }
    #right-tips>#tips-list>ul:after {
        position: absolute;
        display: inline-block;
        top: 40px;
        left: 195px;
        width: 0;
        height: 0px;
        content: '';
        border-style: solid;
        border-width: 5px;
        border-color: #fff #fff transparent transparent;
        transform: rotate(45deg);
        box-shadow: 1px -1px 1px #ccc;
    }
    #right-tips>#tips-list>ul>li{
        width: 172px;
        height: 36px;
        line-height: 36px;
        text-align: center;
    }
    #right-tips:hover>#tips-list, #right-tips:hover>#tips-list>ul{
        display: block;
    }
    #right-tips .icon-tel{
        width: 14px;
        height: 14px;
        background: url(~@/assets/403_images/icon-telephone.png) no-repeat;
        margin-bottom: 10px;
    }
    #right-tips>#tips-list>ul>li:hover{
        background: rgba(246,247,249,1);
        color: #045340;
    }
    #tips:hover{
        background: #44A5FF;
    }
</style>
