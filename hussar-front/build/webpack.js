const path = require('path');
const minimist = require('minimist');
const defaultsDeep = require('lodash.defaultsdeep');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const vueCliValidateWebpackConfig = require('@vue/cli-service/lib/util/validateWebpackConfig');
const vueCliResolveAppConfig = require('@vue/cli-service/lib/commands/build/resolveAppConfig');
const VueCliService = require('@vue/cli-service/lib/Service');
const VueCliPluginAPI = require('@vue/cli-service/lib/PluginAPI');
const { defaults: vueCliDefaultOptions } = require('@vue/cli-service/lib/options');
const fs = require('fs');
const searchExtraCopyList = require('../config/extraCopyList');

/** ********************************* 常量 ************************************/

const argvParseConfig = {
  boolean: [
    // build
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
  ]
};
const defaultsArgs = {
  clean: true,
  target: 'app',
  formats: 'commonjs,umd,umd-min',
  'unsafe-inline': true
};

/** ********************************* 方法 ************************************/

/**
 * 创建 Webpack 编译器。
 *
 * @param {undefined | {name: string, page: string, entry: string, template: string, filename: string}} entry 入口信息
 * @param {{projectPath: string, allowMinimize?: boolean, argv?: Array<string>}} options 编译器创建参数
 * @returns {webpack.Compiler} Webpack 编译器
 */
function createCompiler(entry, options) {
  // 处理参数
  options = options || {};
  const projectPath = options.projectPath || path.resolve(__dirname, '..');
  const allowMinimize = options.allowMinimize != null ? !!options.allowMinimize : false;
  const argv = options.argv || ['--mode', 'production'];
  const copyVfg = options.copyVfg;
  const copyPublic = options.copyPublic;
  const copyTheme = options.copyTheme;
  const copyHussarConfig = options.copyHussarConfig;

  // 创建 Vue Cli 命令行和参数
  const service = new VueCliService(projectPath);
  const args = minimist(argv, argvParseConfig);
  service.setPluginsToSkip(args);
  // 编译服务关闭打包时hussarvfg的处理
  process.env.VUE_APP_UN_PACKAGE_VFG = 'yes';
  // 编译服务关闭打包时hussartheme的处理
  process.env.VUE_APP_UN_PACKAGE_THEME = 'yes';
  // 编译服务关闭打包时hussarConfig下图片的处理
  process.env.VUE_APP_UN_PACKAGE_HUSSARCONFIG = 'yes';
  process.env.VUE_APP_UN_PACKAGE_COPY = 'yes';
  service.init(args.mode || 'production');
  for (const key in defaultsArgs) {
    if (args[key] == null) {
      args[key] = defaultsArgs[key];
    }
  }
  args.entry = args.entry || args._[0];

  // 配置 Vue Cli build 命令参数和多页面
  const api = new VueCliPluginAPI('built-in:commands/build', service);
  const opts = defaultsDeep(service.loadUserOptions(), vueCliDefaultOptions());
  if (args.dest) {
    opts.outputDir = args.dest;
  }
  if (entry) {
    opts.pages = {
      [entry.name]: entry
    };
  }
  // 处理vue-cli默认配置中添加的对public文件夹的复制
  if (copyPublic !== true) {
    api.chainWebpack(config => {
      // 删除copy-webpack-plugin
      config.plugins.delete('copy');
    });
  }
  // 创建 Webpack 编译器
  const webpackConfig = vueCliResolveAppConfig(api, args, opts);
  vueCliValidateWebpackConfig(webpackConfig, api, opts, args.target);
  const vfgDistPath = path.resolve(__dirname, '../static-vfg');
  const themeDistPath = path.resolve(__dirname, '../static-theme');
  // const hussarConfigPath = path.resolve(__dirname, '../node_modules/hussar-config/dist/img');
  if (fs.existsSync(vfgDistPath) && copyVfg) {
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([{
        from: vfgDistPath,
        to: path.resolve(__dirname, '../dist/hussarvfg')
      }])
    );
  }
  if (fs.existsSync(themeDistPath) && copyTheme) {
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([{
        from: themeDistPath,
        to: path.resolve(__dirname, '../dist/hussartheme')
      }])
    );
  }
  // if (fs.existsSync(hussarConfigPath) && copyHussarConfig){
  //     webpackConfig.plugins.push(
  //         new CopyWebpackPlugin([{
  //             from: hussarConfigPath,
  //             to: path.resolve(__dirname, '../dist/static/js/img'),
  //         }])
  //     )
  // }
  const list = searchExtraCopyList();
  if (copyPublic && Array.isArray(list) && list.length > 0) {
    webpackConfig.plugins.push(new CopyWebpackPlugin(list));
  }
  // 添加线上服务文件忽略插件
  const GYOnlinePlugin = require('./GYOnlinePlugin');
  webpackConfig.plugins.push(new GYOnlinePlugin());
  webpackConfig.optimization.minimize = allowMinimize;
  const compiler = webpack(webpackConfig);

  // 配置编译入口
  if (entry) {
    compiler.options.entry = {
      [entry.page]: entry.entry
    };
    // 配置 HTML 插件
    const htmlPlugin = new HtmlWebpackPlugin({
      template: entry.template,
      filename: entry.filename
    });
    compiler.options.plugins.push(htmlPlugin);
    htmlPlugin.apply(compiler);

    // 配置单入口
    new SingleEntryPlugin(compiler.context, entry.entry, entry.page).apply(compiler);
  }
  return compiler;
}

/**
 * 执行编译。
 *
 * @param {webpack.Compiler} compiler Webpack 编译器
 * @param {{outputPath: string, publicPath: string, noFilenameRewrite?: boolean, entryClass?: string, chunkClass?: string}} options 编译执行参数
 * @returns {Promise<null>} 编译结果
 */
async function executeCompiler(compiler, options) {
  // 处理参数
  options = options || {};
  compiler.outputPath = options.outputPath;
  compiler.options.output.publicPath = options.publicPath;
  if (!options.noFilenameRewrite) {
    compiler.options.output.filename = options.entryClass ? `static/js/[name].${options.entryClass}.js` : 'static/js/[name].js';
    compiler.options.output.chunkFilename = options.chunkClass ? `static/js/[name].[chunkhash].${options.chunkClass}.js` : 'static/js/[name].js';
  }

  // 执行编译
  return new Promise(function (resolve, reject) {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.compilation.errors.length > 0) {
        reject(stats.compilation.errors);
      }
      resolve();
    });
  });
}

// 导出方法
module.exports = {
  createCompiler,
  executeCompiler
};
