<template>
  <el-input
    ref="inputRef"
    v-bind="$attrs"
    v-on="$listeners"
    @change="handlerChanged"
  >
    <slot v-for="(_,slotName) in $slots" :name="slotName" :slot="slotName" />
    <template v-for="(_,slotName) in $scopedSlots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'JxdInput',
  methods: {
    /**
     * 修复登录时，中文输入法下，用户名自动填充导致v-modal不自动更新，实际上input标签的value已经更新了
     * 对于需要使用IME的语言(中文，日文和韩文等)，你会发现v-model不会在IME输入的组合状态时触发更新。
     * 如果你的确想在此时也触发更新，请使用input事件监听器和value绑定值而不要使用v-model
     */
    handlerChanged() {
      const childrenElms = this.$refs.inputRef.$el.children;
      if (childrenElms) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection
        const inputEl = Array.from(childrenElms).find(item => item.className === 'el-input__inner');
        if (inputEl) {
          this.$emit('input', inputEl.value);
        }
      }
    }
  }
};
</script>
