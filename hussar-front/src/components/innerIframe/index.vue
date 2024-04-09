<template>
  <div class="split-container">
    <iframe frameborder="0" :src="externalLinks" scrolling="yes" class="weIframe" />
  </div>
</template>

<script>
export default {
  name: 'ExternalLinks',
  components: {

  },
  data() {
    return {
      externalLinks: ''
    };
  },
  created() {
    this.externalLinks = this.$route.meta.externalLinks;
  },
  methods: {

  }
};
</script>

<style scoped>
    .weIframe{width: 100%;height: 100%;}
</style>
