<template>
  <el-scrollbar ref="scrollContainer" :vertical="vertical" class="scroll-container">
    <slot />
  </el-scrollbar>
</template>

<script>

export default {
  name: 'ScrollPane',
  props: { vertical: Boolean, selectedTagWidth: Number },
  data() {
    return {
      left: 0,
      afterContainerWidth: 0
    };
  },
  computed: {
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap;
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.scrollWrapper;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
    moveToTarget(currentTag) {
      const $container = this.$refs.scrollContainer.$el;
      const $containerWidth = $container.offsetWidth; // 容器宽度
      const $scrollWrapper = this.scrollWrapper;
      const homePage = document.querySelector('.tags-index-item').__vue__; // 首页
      const oldTagsList = document.querySelectorAll('.tags-view-item'); // 其他页签
      const tagsList = [];
      oldTagsList.forEach(item => tagsList.push(item.__vue__));
      let firstTag = null; // 除首页外的第一个页签
      let lastTag = null; // 最后一个页签
      if (tagsList.length > 0) {
        firstTag = tagsList[0];
        lastTag = tagsList[tagsList.length - 1];
      }
      /**
       * 先判断页签宽度是否小于容器宽度，如果小于, $scrollWrapper.style.left = 0;再判断是否是首页($scrollWrapper.style.left = 0)、最后一个页签(容器宽度减去 页签宽度) ,
       *    上述情况都不存在时，在根据其他情况计算
       */
      if ($containerWidth > $scrollWrapper.scrollWidth) {
        $scrollWrapper.style.left = 0;
      } else if (firstTag === currentTag || homePage === currentTag) {
        $scrollWrapper.style.left = 0;
      } else if (lastTag === currentTag) {
        $scrollWrapper.style.left = $containerWidth - $scrollWrapper.scrollWidth + 'px';
      } else {
        const currentIndex = tagsList.findIndex(item => item === currentTag); // currentTag在页签中的位置
        const prevTag = tagsList[currentIndex - 1];
        const nextTag = tagsList[currentIndex + 1];
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth; // currentTag后一个页签的offsetLeft以及本身的宽度
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft; // currentTag前一个页签的offsetLeft
        let leftWidth = 0;
        if ($scrollWrapper.style.left) {
          leftWidth = -parseInt($scrollWrapper.style.left);
        } else {
          leftWidth = 0;
        }
        /**
         * 先判断是否时收缩菜单
         */
        if (this.afterContainerWidth === $containerWidth) {
          /**
           * this.selectedTagWidth不等于0时，说明是关闭按钮
           * this.selectedTagWidth等于时，根据 left和容器宽度 跟 afterNextTagOffsetLeft 和 beforePrevTagOffsetLeft值做对比进行计算
           */
          if (this.selectedTagWidth !== 0) {
            // 关闭按钮
            const left = parseInt($scrollWrapper.style.left);
            if (left === 0) {
              $scrollWrapper.style.left = 0;
            } else {
              // 过长，在接近首页，但是首页没有显示
              if (this.selectedTagWidth > leftWidth) {
                $scrollWrapper.style.left = 0 + 'px';
              } else if (this.selectedTagWidth < leftWidth) {
                $scrollWrapper.style.left = left + this.selectedTagWidth + 'px';
              }
            }
          } else if (afterNextTagOffsetLeft > leftWidth + $containerWidth) {
            $scrollWrapper.style.left = $containerWidth - afterNextTagOffsetLeft + 'px';
          } else if (beforePrevTagOffsetLeft < leftWidth) {
            $scrollWrapper.style.left = -beforePrevTagOffsetLeft + 'px';
          }
        } else {
          /**
           * 收起缩放菜单
            */
          if (afterNextTagOffsetLeft < $containerWidth) {
            $scrollWrapper.style.left = 0 + 'px';
          } else {
            $scrollWrapper.style.left = $containerWidth - afterNextTagOffsetLeft + 'px';
          }
        }
      }
      this.afterContainerWidth = $containerWidth;
      this.$emit('selectedTagClick');
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
/*  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }*/
}
</style>
