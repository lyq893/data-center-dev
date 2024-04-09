function searchContainerShowMorePublic(key, self) {
  if (!self[key + 'Fold']) {
    self[key + 'TotalHeight'] = document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_hidden')[0].clientHeight + document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_title')[0].clientHeight;
    self[key + 'HiddenHeight'] = document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_hidden')[0].clientHeight;
    document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_hidden')[0].style.height = '0px';
    document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_bottom')[0].style.height =
      'calc(100% - ' + document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_title')[0].clientHeight + 'px)';
  } else {
    document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_hidden')[0].style.height = self[key + 'HiddenHeight'] + 'px';
    document.getElementsByClassName(key)[0].getElementsByClassName('__net_search_container_bottom')[0].style.height = 'calc(100% - ' + self[key + 'TotalHeight'] + 'px)';
  }
  self[key + 'Fold'] = !self[key + 'Fold'];
}

export { searchContainerShowMorePublic };
