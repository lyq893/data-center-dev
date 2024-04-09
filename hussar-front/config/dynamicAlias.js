const path = require('path');

const {PROJECT_ROOT, resolve, posixPath, systemPath, isFileMagicallyExists, isDirectory} = require('./common');
const DynamicAliasResolvePlugin = require('dynamic-alias-resolve-plugin');

// 动态别名常量
const ALIAS_ROOT = '#';
const ALIAS_PAGES = '#/pages';
const ALIAS_VIEWS = '#/views';

// 路径匹配正则
const PATTERN_PATH = new RegExp('(?<root>src/pages/(?<page>[^/]+)(/modules/(?<module>[^/]+))?)')

/**
 * 动态别名解析入口。
 */
function dynamicAlias(request, alias) {
    const context = createContext(request, alias);
    const resolved = resolveAlias(context);
    if (process.env.VUE_APP_HUSSAR_FRONT_DEBUG === 'yes') {
        console.info(`\n[DYNAMIC ALIAS RESOLVED] resolve ${context.alias} to ${resolved}, context:`, context);
    }
    return resolved;
}

/**
 * 创建上下文。
 */
function createContext(request, alias) {
    const source = path.posix.normalize(posixPath(path.relative(PROJECT_ROOT, request.context.issuer)));
    const target = path.posix.normalize(request.request);

    const match = PATTERN_PATH.exec(source);
    const root = match ? match.groups.root : null;
    const page = match ? match.groups.page : null;
    const module = match ? match.groups.module : null;

    return {
        // 需要处理的别名
        alias,
        // 发起 import 的文件所在系统路径
        source,
        // 原始 import 语句的路径
        target,
        // 发起者所在根级 pages 或 modules 目录
        root,
        // 多页面名
        page,
        // 多模块名
        module,
    };
}

/**
 * 解析动态别名。
 */
function resolveAlias(context) {
    const {alias, root, target} = context;
    if (alias === ALIAS_ROOT) {
        // 处理 #/
        return resolve(root);
    } else if (alias === ALIAS_VIEWS || alias === ALIAS_PAGES) {
        // 处理 #/pages/ 或 #/views/
        const prefix = resolve(root);
        const striped = target.slice((alias === ALIAS_VIEWS ? ALIAS_VIEWS : ALIAS_PAGES).length + 1);
        if (exists(path.join(prefix, 'views', striped))) {
            // 优先 ${root}/views/
            return path.join(prefix, 'views');
        } else if (exists(path.join(prefix, 'pages', striped))) {
            // 其次 ${root}/pages/
            return path.join(prefix, 'pages');
        } else {
            // 最后 ${root}/views/，让 webpack 自行报错
            return path.join(prefix, 'views');
        }
    }
    // 不处理未知的别名
    return alias;
}

/**
 * 判断目标是否存在。
 */
function exists(target) {
    target = systemPath(target);
    return isFileMagicallyExists(target) || isDirectory(target);
}

// 导出动态别名插件
module.exports = new DynamicAliasResolvePlugin({
    alias: [ALIAS_PAGES, ALIAS_VIEWS, ALIAS_ROOT],
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx', 'vue', 'css', 'scss'],
    dynamic: dynamicAlias,
});
