const CopyWebpackPlugin = require('copy-webpack-plugin');
const {resolve, posixPath} = require('./common');

const MANIFEST = require(resolve('package.json'));
const EXTRA_COPY_CONFIG_NAME = 'extra-copy.config.js';

// 外部模块白名单
const MODULE_WHITELIST = new Set([
]);
// 外部模块黑名单
const MODULE_BLACKLIST = new Set([
    'vue', 'vue-router', 'vuex', 'vue-i18n',
    'echarts', 'wangeditor', 'element-ui', 'vant', 'vxe-table', 'xe-utils',
    'axios', 'lodash', 'moment', 'numeral',
]);
// 自定义外部模块过滤
const MODULE_CUSTOM_FILTER = (dependency) => {
    return true;
};

/**
 * 读取项目所有依赖的 copy 列表
 *
 * @return {Array<{from: string, to: string}>}
 */
function searchExtraCopyList() {
    return projectDependencies()
        .filter(filterDependencies)
        .flatMap(extraCopyListOfDependency);
}

/**
 * 读取项目所有依赖列表
 *
 * @return {string[]}
 */
function projectDependencies() {
    return Object.keys({
        ...(MANIFEST['dependencies'] || {}),
        ...(MANIFEST['peerDependencies'] || {}),
    });
}

/**
 * 应用当前项目的黑名单白名单
 *
 * @param {string} dependency
 * @return {boolean}
 */
function filterDependencies(dependency) {
    const listBasedKeep = MODULE_WHITELIST.size === 0 ?
        !MODULE_BLACKLIST.has(dependency) :
        MODULE_WHITELIST.has(dependency) && !MODULE_BLACKLIST.has(dependency);
    if (!listBasedKeep) {
        return false;
    }
    if (typeof MODULE_CUSTOM_FILTER === 'function') {
        return !!(MODULE_CUSTOM_FILTER(dependency));
    }
    return true;
}

/**
 * 获取单个依赖包的 copy 配置列表
 *
 * @param {string} dependency
 * @return {Array<{from: string, to: string}>}
 */
function extraCopyListOfDependency(dependency) {
    // 加载单个包的 copy 配置
    const path = posixPath(dependency, EXTRA_COPY_CONFIG_NAME);
    let config;
    try {
        config = require(path);
    } catch (e) {
        config = null;
    }

    // 根据 copy 配置获取 copy 列表
    if (config == null) {
        return [];
    } else if (Array.isArray(config)) {
        return config;
    } else if (typeof config === 'function') {
        const context = {issuer: MANIFEST.name, request: dependency};
        const result = config(context);
        if (Array.isArray(result)) {
            return result;
        } else {
            console.warn(`ignore non-array result returned from '${path}' factory function:`, result);
            return [];
        }
    } else {
        console.warn(`ignore '${path}', not either an array or a factory function:`, config);
        return [];
    }
}

module.exports = searchExtraCopyList;
