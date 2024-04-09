<template>
  <div class="http403">
    <div class="pic-403">
      <img class="pic-403__parent" src="@/assets/403_images/403.png" alt="403">
    </div>
    <div class="text-403">
      <img class="img-text" src="~@/assets/403_images/text403.png" alt="">
      <div class="content-403">亲爱的用户，您暂时无权访问该页面</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return '网管说这个页面你不能进......';
    }
  }
};
</script>

<style scoped>
    .http403{
        display: flex;
        height: 100%;
    }
    .pic-403{
        flex: 1;
        text-align: right;
    }
    .pic-403> img{
        position: relative;
        top: 240px;
    }
    .text-403{
      padding-top: 344px;
      flex: 1;
      padding-left: 10px;
    }
    .content-403{
        height:21px;
        font-size:16px;
        font-family:MicrosoftYaHei;
        color:rgba(155,157,163,1);
        line-height:21px;
        letter-spacing:1px;
    }
</style>
