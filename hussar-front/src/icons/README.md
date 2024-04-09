# SVG 图标文件目录

## 目录结构

### colorfulIcon

此文件夹中放置彩色SVG,自带fill属性和颜色

### index

此文件夹中放置的是门户需要用到的svg图标，目前主要有门户菜单图标

menu 放置`系统自带的`菜单图标
cusMenu 放置`用户自定义`的门户图标

去除fill属性并压缩svg的处理方法：
在项目中执行

```bash
svgo -f src/icons/index/cusMenu --config=src/icons/svgo.config.js
```

#### 门户菜单图标

- 从控制台打开新增菜单时，无默认图标，也不选中空图标。
- 若用户不选择，那么门户侧渲染的时候，根据层级展示默认图标。
- 若用户选择了菜单图标是空，那么门户则不渲染这个图标。
- 空和默认是两个概念，空是人为设置，默认是创建后系统带的；空是无，但不等于默认。
- 可视化设计器配置菜单时，点击发布，菜单图标字段是空，前端要根据层级展示默认图标。
  - 具体判断逻辑如下：
    - 如果meta.icon为空，
      - 且为一级菜单，显示`caidan-1Jmoren`
      - 且为二级菜单，显示`caidan-2Jmoren`
      - 且大于等于三级菜单，显示`caidan-3Jmoren`
    - 如果meta.icon不为空，
      - 且选中的图标是`caidan-kong21`,显示空
      - 且选中的图标不是`caidan-kong21`,显示应该显示的

### SVG

此文件夹中为旧版svg图标，以后的svg图标不可放入此文件夹中，需严格规范，门户的放到index中，控制台的放到console中

## svgUtils工具类

- svgUtils.registerSvgCategory(ctx,svgType,typeName) 第一次注册某个类型的图标库类
  - ctx 图标上下文, 例如const ctx = require.context('./menu', true, /\.svg$/);
  - svgType 图标库类型 可自定义
  - typeName 图标库中文名

```js
import { svgUtils, SVG_TYPE } from 'hussar-icon';

/**
 * 门户侧菜单图标注册
 * 系统内置的门户测菜单图标 文件夹在hussar-front/src/icons/index/menu
 */
const initIndexMenu = function () {
  const ctx = require.context('./menu', true, /\.svg$/);
  svgUtils.registerSvgCategory(ctx, SVG_TYPE.SVG_TYPE_INDEX_MENU, '门户侧菜单图标');
};
```

- svgUtils.addSvgCategoryByType(ctx, svgType); 向某个图标库类添加图标
  - ctx 图标上下文,例如 const ctx = require.context('./cusMenu', true, /\.svg$/);
  - svgType 需要给哪个图标库类添加图标

```js
import { svgUtils, SVG_TYPE } from 'hussar-icon';

/**
 * 门户侧定制化菜单新增
 * 定制化菜单图标放到 hussar-front/src/icons/index/cusMenu 文件夹下
 */
const initIndexCusMenu = function () {
  const ctx = require.context('./cusMenu', true, /\.svg$/);
  svgUtils.addSvgCategoryByType(ctx, SVG_TYPE.SVG_TYPE_INDEX_MENU);
};
```

- svgUtils.getSvgCategoryByType(svgType) 根据图标库类型获取指定类型的图标库
  - svgType 图标库类型
  - 例如获取门户菜单图标库 svgUtils.getSvgCategoryByType(SVG_TYPE_INDEX_MENU);

- svgUtils.getSvgListByType(svgType) 根据图标库类型获取指定类型的图标集合
  - svgType 图标库类型
  - 例如获取门户菜单图标集合 svgUtils.getSvgListByType(SVG_TYPE_INDEX_MENU);

## 定制化菜单图标方法

将需要的菜单图标放入hussar-front/src/icons/index/cusMenu 即可

- 菜单图标要求
  单色SVG图标，不能含有fill属性
- 处理方法：在项目中执行

```bash
svgo -f src/icons/index/cusMenu --config=src/icons/svgo.config.js
```

## svg图标使用

```html

<svg-icon icon-class="iconName"/>
```
