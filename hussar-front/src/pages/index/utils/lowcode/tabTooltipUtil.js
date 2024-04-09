function TabTooltipHiddenPublic(key, tabRef, tabName, self) {
  const el = self.$refs[tabRef];
  const parentEl = el.parentElement;
  self[key + 'TabTooltipDisabled'][tabName] = el.offsetWidth < parentEl.offsetWidth;
}

export { TabTooltipHiddenPublic };
