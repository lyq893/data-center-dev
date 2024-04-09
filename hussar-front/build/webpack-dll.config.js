const path = require('path');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const outputDirectory = path.resolve(__dirname, '../public/vendor');
const outputManifest = path.resolve(outputDirectory, '[name]-manifest.json');
const outputFilename = '[name].dll.js';
const outputLibrary = '[name]';
const entries = require('../config/dllConfig').entries;

module.exports = {
    entry: entries,
    mode: "production",
    output: {
        path: outputDirectory,
        filename: outputFilename,
        library: outputLibrary,
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:"jquery",

            jQuery:"jquery",
            "windows.jQuery":"jquery"
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // }),
        // 剥离除 “en” 以外的所有语言环境。
        new MomentLocalesPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.DllPlugin({
            path: outputManifest,
            name: outputLibrary,
            context: process.cwd(),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: path.join(__dirname, '../node_modules'),
                include: resolve('../src'),
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'postcss-loader', 'sass-loader'],
                exclude: path.join(__dirname, '../node_modules'),
                include: resolve('../src'),
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
                // exclude: /node_modules/,
                // include: resolve('../src'),
            },
            {
                test: /\.less$/,
                use: [
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
                exclude: path.join(__dirname, '../node_modules'),
                include: resolve('../src'),
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf|otf)\??.*$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: "./vendor/images/",
                        outputPath: 'images/',
                        limit: 8192,
                    }
                }],
                exclude: [resolve('../src/icons')],
                include: [
                    resolve('../src'),
                    path.join(__dirname,"../node_modules/hussar-common"),
                    path.join(__dirname,"../node_modules/BpmShowWorkflow")
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                // exclude: path.join(__dirname, '../node_modules'),
                include: [
                    resolve('../src'),
                    path.join(__dirname,"../node_modules/@wchbrad")
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'static/fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                include: resolve('../src/icons'),
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon-[name]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@': resolve('../src')
        },
        extensions: ['.js','.vue'],
        modules: ['node_modules','../node_modules','node_modules/@vue/cli-service/node_modules'],
    },
};

function resolve(dir) {
    return path.join(__dirname, dir)
}
