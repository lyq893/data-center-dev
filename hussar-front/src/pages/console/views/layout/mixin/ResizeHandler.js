// import store from '@/pages/console/store'

const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler);
  },
  mounted() {
    const isMobile = this.isMobile();
    if (isMobile) {
      this.$store.dispatch('ToggleDevice', 'mobile');
      this.$store.dispatch('CloseSideBar', { withoutAnimation: true });
    }
  },
  methods: {
    isMobile() {
      const rect = body.getBoundingClientRect();
      return rect.width - 1 < WIDTH;
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.isMobile();
        this.$store.dispatch('ToggleDevice', isMobile ? 'mobile' : 'desktop');

        if (isMobile) {
          this.$store.dispatch('CloseSideBar', { withoutAnimation: true });
        }
      }
    }
  }
};
