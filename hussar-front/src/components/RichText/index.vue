<template>
  <div ref="richText" style="height: 100%;" />
</template>

<script>
import WangEditor from 'wangeditor/dist/wangEditor';
export default {
  name: 'Richtext',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isClearValue: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      richTextEditor: {}
    };
  },
  watch: {
    isClearValue: {
      handler: function(newVal, oldVal) {
        const self = this;
        if (newVal !== oldVal) {
          self.richTextEditor.txt.clear();
        }
      },
      deep: true
    }
  },
  methods: {
    initRichText() {
      const self = this;
      if (this.richTextEditor && Object.keys(this.richTextEditor).length === 0 && this.$refs.richText) {
        const curEditor = new WangEditor(self.$refs.richText);
        self.richTextEditor = curEditor;
        // 配置菜单栏，删减菜单，调整顺序
        self.richTextEditor.config.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'indent', // 缩进
          'lineHeight', // 行高
          'foreColor', // 字体颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'image', // 图片
          'splitLine', // 分割线
          'todo', // 待办事项
          'undo', // 撤销
          'redo' // 重做
        ];
        // 使用base64保存图片
        self.richTextEditor.config.uploadImgShowBase64 = true;
        // 隐藏网络图片
        self.richTextEditor.config.showLinkImg = false;
        // 配置全屏功能按钮不展示
        self.richTextEditor.config.showFullScreen = false;
        // 设置编辑器内容区域的高度
        self.richTextEditor.config.height = Number.parseInt('77%', 10);
        // 设置富文本的z-index
        self.richTextEditor.config.zIndex = 105;
        // 菜单栏提示为下标
        self.richTextEditor.config.menuTooltipPosition = 'down';
        // 去除复制过来文本的默认样式
        self.richTextEditor.config.pasteFilterStyle = true;
        self.richTextEditor.config.onchange = function(newHtml) {
          self.$emit('input', newHtml);
        };
        self.richTextEditor.create();
        if (this.disabled) {
          self.richTextEditor.disable();
        }
      }
    },
    loadHtml(val) {
      if (this.richTextEditor) {
        this.richTextEditor.txt.html(val);
      }
    }
  },
  mounted() {
    const self = this;
    self.initRichText();
  }
};
</script>

<style scoped>

</style>
