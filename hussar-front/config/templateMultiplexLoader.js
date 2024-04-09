const _ = require('lodash');
const qs = require('querystring');

/**
 * 模板代入查询字符串动态生成代码的 loader。
 *
 * @param {string} source
 * @return {string}
 */
function templateMultiplexLoader(source) {
    const query = qs.parse(this.resourceQuery && this.resourceQuery.slice(1));

    this.cacheable && this.cacheable();
    return _.template(source, {sourceURL: this.resource})(query);
}

module.exports = templateMultiplexLoader;
