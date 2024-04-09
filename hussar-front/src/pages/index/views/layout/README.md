# 框架页布局

```text
layout
├── components
│   ├── AppMain.vue                                 // 主体页面内容展示区
│   ├── HeadStyle.vue                               // 头部组件 （用户名、头像等内容）
│   ├── LayoutType                                  // 框架页类型
│   │   ├── ChangZi.vue                             // 厂字布局（混合布局）
│   │   └── LeftRight.vue                           // 左右布局
│   ├── LogoArea                                    // logo组件（包括系统名称）
│   │   └── index.vue
│   ├── Sidebar                                     // 侧边栏组件
│   │   ├── SidebarItem                             // 侧边栏的每一项
│   │   │   ├── MenuItemLastChild                   // 末级菜单
│   │   │   │   ├── AppLink.vue                     // a标签点击的链接跳转
│   │   │   │   ├── MenuItem.vue                    // 每一项菜单
│   │   │   │   └── index.vue
│   │   │   ├── SubMenu.vue                         // 非末级菜单（嵌套菜单）
│   │   │   └── index.vue
│   │   └── index.vue
│   ├── TagsView                                    // tab标签页组件
│   │   ├── ScrollPane.vue
│   │   └── index.vue
│   └── index.js
├── layout.vue                                      // 整体布局组件
└── mixin
    └── ResizeHandler.js 
```

## 使用说明

0. 注意：不建议直接修改原有的components中的布局组件，而应以各个项目自身框架页的需求新增布局类型，如需定制化修改（例如头部导航组件），建议拷贝一份命名为定制化项目的组件（BizHeadStyle）
1. layout.vue调用新增的布局类型组件 ,新增的布局类型放到layoutType文件夹中
2. 新增的布局类型根据自己需求调用侧边栏Sidebar、导航栏HeadStyle、tab标签页TagsView等组件进行布局
3. 在新增的布局类型组件中使用::v-deep深度作用选择器调整本布局需要的样式
4. 尽量不要改动侧边栏等子组件中的样式代码。
5. 鼠标悬浮时、菜单激活时颜色 不应写在Sidebar组件中，而应写到布局类型LayoutType中，
   因为不同布局类型的菜单颜色不一致.主题色见body中的 --c-themeColor 之类的css变量
6. 每个菜单层级中添加了deep层级属性 用于区分是一级菜单还是二级菜单、三级菜单等
7. 侧边栏菜单数据来源 --- vuex中的permission_routers
   (菜单转换成的路由信息,具体字段属性见[hussar-front/src/models/MenuRoute.js])

```vue

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    // 侧边栏是否折叠
    isCollapse() {
      return !this.sidebar.opened;
    },
    // 当前框架页配置中激活的框架类型
    layoutConfigActive() {
      return this.$store.state.configIndex.layoutType;
    }
  },
  methods: {
    // 切换侧边栏的展开状态
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    }
  }
};
</script>
```

## 830版本及之前版本升级方案

- 先备份hussar-front/src/pages/index/views/layout 文件夹中的所有文件 以及 hussar-front/src/styles/sidebarIndex.scss 文件
- 然后合并最新主线的代码。最后将备份的layout中的代码替换合并后项目自身的即可
- 将hussar-front/src/styles/sidebarIndex.scss 还原
