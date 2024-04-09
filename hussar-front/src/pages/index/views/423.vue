<template>
  <div class="http423">
    <div class="right-423">
      <img class="img" src="~@/assets/403_images/index423.png" alt="">
      <div class="text">
        <img class="img-text" src="~@/assets/403_images/tex423.png" alt="">
        <p class="text-font">系统异常，请联系管理员</p>
      </div>
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
    /*字体样式*/
    .right-423 {
      padding-top: 14%;
      padding-left: 29%;
      display: flex;
    }
    .text {
      position: relative;
      top: 138px;
      left: 4px;
    }
    .text-font {
      eight:21px;
      font-size:16px;
      font-family:MicrosoftYaHei;
      color:rgba(155,157,163,1);
      line-height:21px;
      letter-spacing:1px;
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
        background: #1D6453;
    }
</style>
