/**
 * 菜单转换成的路由信息
 */
export default class MenuRoute {
  constructor(props) {
    this.menuId = props.menuId; // 主键id
    this.meta.title = props.meta.title || ''; // 名称
    this.meta.icon = props.meta.icon || ''; // 图标
    this.meta.externalLinks = props.meta.externalLinks || ''; // 外部链接，当菜单是外部链接（menu.strategy=3）时，存在此值
    this.redirect = props.redirect || ''; // 是否重定向
    this.openMode = props.openMode || ''; // 菜单打开模式(0: 在内部厂字形框架打开的页面,1: 外部打开并去除厂字形框架的页面)
    this.strategy = props.strategy || ''; // 资源策略（ 0：hussar-front 项目内部 views 页面，1：NPM 包提供的页面，2：hussar-front 项目内部 pages 打包出的不重启页面，3：外部链接）
    this.path = props.path || ''; // 菜单路径（微服务下需要拼接上menu.serviceName）
    this.children = props.childMenus || ''; // 子菜单
    this.hidden = props.hidden || false; // 是否隐藏
    this.component = props.component || ''; // 当菜单是外部链接（menu.strategy=3），并且打开模式为在内部厂字形框架打开的页面（menu.openMode=0）时，存在此值
  }
}
