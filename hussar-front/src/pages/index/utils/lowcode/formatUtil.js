function formatSelectStyle(key, self, insId) {
  const width = document.getElementById(insId).clientWidth;
  const labelWidth = document.getElementById(insId).getElementsByClassName('isShear')[0].children[0].offsetWidth;
  const left = window.getComputedStyle(document.getElementById(insId)).paddingLeft;
  const right = window.getComputedStyle(document.getElementById(insId)).paddingRight;
  const limitWidth = width - parseInt(left) - parseInt(right);
  if ((labelWidth > limitWidth)) {
    self[key + 'tooltip'] = false;
    self.$forceUpdate();
  }
  if ((labelWidth <= limitWidth)) {
    self[key + 'tooltip'] = true;
    self.$forceUpdate();
  }
}

export { formatSelectStyle };
