import Vue from 'vue';
import Clickoutside from 'element-ui/src/utils/clickoutside';

/**
*  使用方法
*  将代码复制到一个js文件中，然后在入口文件main.js中import引入即可；
*  给元素加上 v-clickoutside 指令就可以实现点击绑定元素之外事件的触发了。
*  绑定一个方法，方法中为点击绑定元素之外时实现的逻辑
*/
// v-clickoutside: 鼠标点击当前绑定节点元素之外时触发
Vue.directive('clickoutside', Clickoutside);
