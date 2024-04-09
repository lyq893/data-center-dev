import '@/assets/console_font/iconfont.css';
/**
 * iconfont图标库
 */
import '@/assets/font/lcdpFont/iconfont.js';
import '@/assets/font/lcdpFont/iconfont.css';
import '@/assets/font/jxdIcon/iconfont.js';
import '@/assets/font/jxdIcon/iconfont.css';
import '@/assets/font/vfgIcon/iconfont.js';
import '@/assets/font/vfgIcon/iconfont.css';
import '@/assets/font/lcdp/iconfont.js';
import '@/assets/font/lcdp/iconfont.css';
import { initDefaultSVG } from '@/icons/svg';
import { initIndexMenu, initIndexCusMenu } from '@/icons/index';
import { initColorFulIcon } from '@/icons/colorfulIcon';
import { initCommonIcon } from '@/icons/common';

initDefaultSVG();
// 注册门户菜单图标
initIndexMenu();
// 注册用户自定义的菜单图标
initIndexCusMenu();
initColorFulIcon();
initCommonIcon();
