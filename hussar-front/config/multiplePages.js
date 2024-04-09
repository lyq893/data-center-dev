const path = require('path');
const glob = require('glob');

const PATTERN_ENTRY_JS = new RegExp('^\\./src/pages/index/(modules/(?<module>[^\\/]+)/)?pages/(?<folder>.+)/__(?<name>[^\\/]+)\\.js$');

/**
 * 在 vue-cli-service 启动时，搜索多页面项目的编译入口。
 */
function searchMultiPages() {
    let pages = {};

    // 搜索多页面入口
    glob.sync('./src/pages/*/index.html').forEach(item => {
        const name = path.basename(path.dirname(item))
        pages[name] = {
            title: `pages - ${name}`,
            entry: `./src/pages/${name}/index.js`,
            template: `./src/pages/${name}/index.html`,
            filename: `${name}.html`,
        };
        if (process.env.VUE_APP_HUSSAR_FRONT_DEBUG) {
            console.log('multiple page entry: ', name, pages[name]);
        }
    });

    // 搜索本地不重启入口
    if (process.env.VUE_APP_LOCAL_UNRESTART === 'yes') {
        [
            ...glob.sync('./src/pages/index/pages/**/__*.js'),
            ...glob.sync('./src/pages/index/modules/*/pages/**/__*.js'),
        ].forEach(item => {
            const match = PATTERN_ENTRY_JS.exec(item);
            if (!match) return;

            const name = [match.groups.module, ...match.groups.folder.split(/[\\/]/g), match.groups.name]
                .filter(Boolean)
                .map(segment => segment[0].toUpperCase() + segment.slice(1))
                .join('');
            const html = `${match.groups.folder}/${match.groups.name}.html`;
            pages[name] = {
                title: `page - ${name}`,
                entry: item,
                template: `./src/pages/index/index.html`,
                filename: match.groups.module ? `${match.groups.module}/${html}` : html,
            };
            if (process.env.VUE_APP_HUSSAR_FRONT_DEBUG) {
                console.log('local un-restart page entry: ', name, pages[name]);
            }
        });
    }

    return pages;
}

module.exports = searchMultiPages;
