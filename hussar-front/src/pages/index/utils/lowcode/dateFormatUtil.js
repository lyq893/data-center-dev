function dateFormatPublic(type, data) {
  if (type === 'year') {
    const years = data.getFullYear().toString();
    return years + '-01-01 00:00:00';
  } else if (type === 'month') {
    const years = data.getFullYear();
    const mon = data.getMonth() + 1;
    const month = mon > 9 ? mon : '0' + mon;
    return years + '-' + month + '-01 00:00:00';
  } else if (type === 'date') {
    const years = data.getFullYear();
    const mon = data.getMonth() + 1;
    const month = mon > 9 ? mon : '0' + mon;
    const date = data.getDate() > 9 ? data.getDate() : '0' + data.getDate();
    return years + '-' + month + '-' + date + ' 00:00:00';
  } else if (type === 'time') {
    const hours = data.getHours() > 9 ? data.getHours() : '0' + data.getHours();
    const minutes = data.getMinutes() > 9 ? data.getMinutes() : '0' + data.getMinutes();
    const seconds = data.getSeconds() > 9 ? data.getSeconds() : '0' + data.getSeconds();
    return '0001-01-01 ' + hours + ':' + minutes + ':' + seconds;
  } else if (type === 'datetime') {
    const years = data.getFullYear();
    const mon = data.getMonth() + 1;
    const month = mon > 9 ? mon : '0' + mon;
    const date = data.getDate() > 9 ? data.getDate() : '0' + data.getDate();
    const hours = data.getHours() > 9 ? data.getHours() : '0' + data.getHours();
    const minutes = data.getMinutes() > 9 ? data.getMinutes() : '0' + data.getMinutes();
    const seconds = data.getSeconds() > 9 ? data.getSeconds() : '0' + data.getSeconds();
    return years + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  }
}

export { dateFormatPublic };
