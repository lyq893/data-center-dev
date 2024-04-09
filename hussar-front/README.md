# hussar-front 轻骑兵低代码开发平台前端代码使用说明

## 一、安装开发工具

> 安装nodejs、yarn、Visual Studio Code或webstrom

### nodejs 版本建议使用最新版 ***v14.17.0***
```
  安装过程详见[在线开发文档](http://192.168.2.129:8003/help/?version=1.0)
```

## 二、私服地址配置

> 使用npm

win+R 输入cmd进入命令行，输入
```
npm config set registry http://123.232.10.234:8212/nexus/content/groups/npm-public/
```
> 使用yarn

win+R 输入cmd进入命令行，输入
```
yarn config set registry http://123.232.10.234:8212/nexus/content/groups/npm-public/
```

## 三、导入项目

```
1. 使用Visual Studio Code或Webstrom导入项目。
2. 启动Visual Studio Code或Webstrom，依次点击File→Open→选择前端项目路径。
3. 进入Terminal输入npm install或yarn install。
4. 修改前台项目hussar-front/.evn.development文件中的后台访问地址配置项，此地址要与后台访问地址一致。
5. 进入Terminal输入npm run serve运行项目
```

## 四、前台样式规范

页面元素 | class
----- | -----
el-table | class="lcdp-table"
el-pagination | class="lcdp-pagination" popper-class="lcdp-page-select"
el-dialog | class="lcdp-dialog"
el-date-picker | class="lcdp-date" popper-class="lcdp-date-pop"
el-tree | class="lcdp-tree"
消息弹框 |  cancelButtonClass: 'dialog-cancel', confirmButtonClass: 'dialog-save', customClass: 'lcdp-message',
查询按钮 | class="btn-search"
重置按钮 | class="btn-reset"
新增按钮 | class="btn-add"
删除按钮 | class="btn-del"
表格内编辑按钮 | class="btn-blue"
表格内删除按钮 | class="btn-red"

