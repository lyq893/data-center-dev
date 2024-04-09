/**
 * 后端返回的菜单信息
 */
export default class Menu {
  constructor(props) {
    this.menuId = props.menuId; // 主键id
    this.text = props.text || ''; // 名称
    this.menuType = props.menuType; // 菜单类型(0: 控制台,1: 主页)
    this.redirect = props.redirect || ''; // 是否重定向
    this.openMode = props.openMode || ''; // 菜单打开模式(0: 在内部厂字形框架打开的页面,1: 外部打开并去除厂字形框架的页面)
    this.strategy = props.strategy || ''; // 资源策略（ 0：hussar-front 项目内部 views 页面，1：NPM 包提供的页面，2：hussar-front 项目内部 pages 打包出的不重启页面，3：外部链接）
    this.path = props.path || ''; // 菜单路径
    this.childMenus = props.childMenus || ''; // 子菜单
    this.hidden = props.hidden || false; // 是否隐藏
    this.component = props.component || ''; // 当资源策略为外部链接时，menu.component=>menuRoute.meta.externalLinks
    this.serviceName = props.serviceName || ''; // 微服务的服务名
  }
}
