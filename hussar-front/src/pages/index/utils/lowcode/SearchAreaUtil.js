function searchAreaShowMorePublic(key, self) {
  if (!self[key + 'Fold']) {
    self[key + 'Children'] = document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_area_visible')[0].children;
    self[key + 'Children'].forEach((item, index) => {
      if (index > 1) {
        item.style.display = 'none';
      }
    });
  } else {
    self[key + 'Children'].forEach((item, index) => {
      if (index > 1) {
        item.style.display = 'flex';
      }
    });
  }
  self[key + 'Fold'] = !self[key + 'Fold'];
}

export { searchAreaShowMorePublic };
