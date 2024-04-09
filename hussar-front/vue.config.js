'use strict';
require('events').EventEmitter.defaultMaxListeners = 0;
const webpack = require('webpack');
const defaultSettings = require('./src/config/settings.js');
/* 调试时使用，不可删除*/
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const searchMultiPages = require('./config/multiplePages');
const {
  hussarConfig,
  searchDllReferences,
  vfgConfig,
  themeConfig
} = require('./config/vueConfigSetting');
const { resolve } = require('./config/common');

const Timestamp = new Date().getTime();
const name = defaultSettings.title || 'hussar lcdp'; // page title
const pages = searchMultiPages();
module.exports = {
  lintOnSave: false,
  pages,
  assetsDir: 'static',
  publicPath: process.env.VUE_APP_LOCAL_UNRESTART === 'yes' ? '/' : './',
  outputDir: 'dist',
  devServer: {
    overlay: {
      // 暂时关闭此配置，可视化设计器生成的页面存在警告
      // warnings: true,
      errors: true
    },
    port: 8081,
    disableHostCheck: true,
    historyApiFallback: false,
    proxy: require('./config/devToolsProxy').proxies,
    watchOptions: {
      aggregateTimeout: 3000
    },
    compress: true,
    contentBase: './static-vfg',
    contentBasePublicPath: '/hussarvfg',
    watchContentBase: false
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    output: {
      filename: `static/js/[name].${Timestamp}.js`,
      chunkFilename: `static/js/[name].[chunkhash].${Timestamp}.js`
    },
    resolve: {
      alias: {
        '@': resolve('src')
      },
      plugins: [require('./config/dynamicAlias')]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      }), // 剥离除 “en” 以外的所有语言环境。
      new MomentLocalesPlugin(), // dll编译优化配置
      ...searchDllReferences(), // 单独处理hussar-config包中的图片
      ...hussarConfig(),
      ...vfgConfig(),
      ...themeConfig()
    ],
    optimization: {
      runtimeChunk: false
    },
    externals: {
      AMap: 'AMap',
      BMap: 'BMap'
    }
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "~@/assets/theme/themeMixin.scss";`
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload-index'); // TODO: need test
    config.plugins.delete('preload-console');
    config.plugins.delete('prefetch-console'); // TODO: need test
    config.plugins.delete('prefetch-index');

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('jfif')
      .test(/\.jfif$/)
      .use('url-loader')
      .loader('url-loader')
      .end();
    config.module
      .rule('ico')
      .test(/\.ico$/)
      .use('url-loader')
      .loader('url-loader')
      .end();
    config.module
      .rule('bmp')
      .test(/\.bmp$/)
      .use('url-loader')
      .loader('url-loader')
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // file templating
    config.module
      .rule('template-multiplex')
      .test(/\.template\.\w+$/)
      .use(resolve('config/TemplateMultiplexLoader'))
      .loader(resolve('config/TemplateMultiplexLoader'))
      .end();

    // DevServer open browser
    config
      .when(process.env.NODE_ENV === 'development' && process.env.VUE_APP_DEV_SERVER_OPEN != null, config => config.devServer
        .open(process.env.VUE_APP_DEV_SERVER_OPEN || true)
        .openPage(process.env.VUE_APP_DEV_SERVER_OPEN_PAGE || ''));

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'));
    config
      .when(process.env.NODE_ENV !== 'development', config => {
        config
          .optimization.splitChunks({
            cacheGroups: {
              default: false
            }
          });
        config.optimization.runtimeChunk('single');
      } // runtime文件设置共享
      );
    // config.optimization.minimize(false);  // 默认开启代码压缩
  }
};

