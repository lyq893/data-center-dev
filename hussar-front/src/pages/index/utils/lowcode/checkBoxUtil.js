function selectStylePublic(instanceKey, self) {
  const width = document.getElementsByClassName(instanceKey)[0].clientWidth;
  const checkBoxWidth = document.getElementsByClassName(instanceKey)[0].children[0].offsetWidth;
  const labelWidth = document.getElementsByClassName(instanceKey)[0].children[1].children[0].children[0].offsetWidth;
  const left = window.getComputedStyle(document.getElementsByClassName(instanceKey)[0]).paddingLeft;
  const right = window.getComputedStyle(document.getElementsByClassName(instanceKey)[0]).paddingRight;
  const limitWidth = width - parseInt(left) - parseInt(right) - checkBoxWidth;
  if (labelWidth > limitWidth) {
    self[instanceKey + 'tooltip'] = false;
    self.$forceUpdate();
  }
  if (labelWidth <= limitWidth) {
    self[instanceKey + 'tooltip'] = true;
    self.$forceUpdate();
  }
}

export { selectStylePublic };
