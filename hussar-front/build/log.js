const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const dayjs = require('dayjs');

let stream = null;
let logger = null;

/**
 * 初始化发布日志，不支持跨线程。
 *
 * @param {string} logPath 日志路径
 */
function init(logPath) {
  mkdirp.sync(path.dirname(logPath));
  stream = fs.createWriteStream(logPath, { flags: 'a' });
  logger = new console.Console(stream);
}

function wrap(name) {
  const prefix = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [Build server ${name}]`;
  return function () {
    if (logger && stream) {
      let args;
      if (arguments.length > 0 && typeof arguments[0] === 'string') {
        args = [prefix + ' ' + arguments[0]];
        Array.prototype.push.apply(args, Array.from(arguments).slice(1));
      } else {
        args = [prefix];
        Array.prototype.push.apply(args, arguments);
      }

      try {
        stream.cork();
        logger[name].apply(this, args);
      } finally {
        stream.uncork();
      }
    }
  };
}

module.exports = {
  init,
  log: wrap('log'),
  trace: wrap('trace'),
  debug: wrap('debug'),
  info: wrap('info'),
  warn: wrap('warn'),
  error: wrap('error')
};
