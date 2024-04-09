/**
 统一门户左侧图标显示
 */
export const getMenuIcon = function (icon, deep) {
  if (icon) {
    if (icon === 'caidan-kong21') {
      return '';
    } else {
      return icon;
    }
  } else {
    if (deep === 0) {
      return 'caidan-1Jmoren';
    } else if (deep === 1) {
      return 'caidan-2Jmoren';
    } else {
      return 'caidan-3Jmoren';
    }
  }
};
