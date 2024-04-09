const fs = require('fs');
const path = require('path');

/**
 * 工程根目录。
 *
 * @type {string}
 */
const PROJECT_ROOT = path.normalize(path.join(__dirname, '..'));

/**
 * 相对项目根目录的路径，转化为系统绝对路径。
 *
 * @param {string} segments
 * @return {string}
 */
function resolve(...segments) {
    return path.join(PROJECT_ROOT, ...segments.map(segment => segment.replace(/[\\/]/g, path.sep)));
}

/**
 * 合并并转换为 POSIX 路径。
 *
 * @param {string} segments
 * @return {string}
 */
function posixPath(...segments) {
    const absolute = /^[\\/]/.test(segments[0] || '');
    const directory = /[\\/]$/.test(segments[segments.length - 1] || '');
    const processed = path.posix.join(...segments.flatMap(segment =>
        segment.split(/[\\/]/g).filter(Boolean)));
    return (absolute ? path.posix.sep : '') + processed + (directory ? path.posix.sep : '');
}

/**
 * 合并并转换为系统路径。
 *
 * @param {string} segments
 * @return {string}
 */
function systemPath(...segments) {
    if (path.sep === path.posix.sep) {
        return posixPath(...segments);
    }

    const directory = /[\\/]$/.test(segments[segments.length - 1] || '');
    const processed = path.join(...segments.flatMap(segment =>
        segment.split(/[\\/]/g).filter(Boolean)));
    return processed + (directory ? path.sep : '');
}

/**
 * 判断文件是否存在，支持忽略后缀名。
 *
 * @param {string} target
 * @return {boolean}
 */
function isFileMagicallyExists(target) {
    const dir = path.dirname(target);
    const file = path.basename(target);
    return isFile(target) ||
        (isDirectory(dir) && fs.readdirSync(dir).some(name =>
            name.startsWith(file + '.') &&
            name.slice(file.length + 1).indexOf('.') < 0 &&
            isFile(path.join(dir, name))));
}

/**
 * 判断文件或文件夹是否存在。
 *
 * @param {string} target
 * @return {boolean}
 */
function isExists(target) {
    return fs.existsSync(target);
}

/**
 * 判断是否存在，且不是文件夹。
 *
 * @param {string} target
 * @return {boolean}
 */
function isFile(target) {
    return fs.existsSync(target) && !fs.lstatSync(followLink(target)).isDirectory();
}

/**
 * 判断是否存在，且不是文件夹。
 *
 * @param {string} target
 * @return {boolean}
 */
function isDirectory(target) {
    return fs.existsSync(target) && fs.lstatSync(followLink(target)).isDirectory();
}

/**
 * 解析软链接。
 *
 * @param {string} target
 * @return {string}
 */
function followLink(target) {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) {
        return followLink(fs.readlinkSync(target));
    }
    return target;
}

module.exports = {
    PROJECT_ROOT,
    resolve,
    posixPath,
    systemPath,
    isFileMagicallyExists,
    isExists,
    isFile,
    isDirectory,
};
