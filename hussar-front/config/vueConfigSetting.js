const glob = require("glob");
const path = require("path");
const fs = require("fs");
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const searchExtraCopyList = require('./extraCopyList');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function getPageName(array) { // 根据数组拼接文件名称
    let pageName = array;
    if (pageName.length) {
        for (let i = 0; i < pageName.length; i++) {
            // pageName[i] = pageName[i].charAt(0).toUpperCase() + pageName[i].slice(1);
            pageName[i] = '/' + pageName[i];
        }
        pageName = pageName.join('');
        pageName = pageName.substring(0, pageName.length - 3); // 去掉后缀
    }
    return pageName;
}

function getEntryName(array) { // 根据数组拼接入口名称
    let pageName = array;
    if (pageName.length) {
        for (let i = 0; i < pageName.length; i++) {
            pageName[i] = pageName[i].charAt(0).toUpperCase() + pageName[i].slice(1);
        }
        pageName = pageName.join('');
        pageName = pageName.substring(0, pageName.length - 3); // 去掉后缀
    }
    return pageName;
}

/**
 * 获取项目入口
 * @param url
 * @param multiUrl
 * @returns {{}}
 */
// 多页面入口配置
function getEntry(url, multiUrl) {
    let entrys = {}
    glob.sync(url).forEach(item => {
        // splice(-3)取数组后三项
        let urlArr = item.split('/').splice(-3)
        entrys[urlArr[1]] = {
            entry: 'src/pages/' + urlArr[1] + '/' + 'index.js',
            template: 'src/pages/' + urlArr[1] + '/' + 'index.html',
            filename: urlArr[1] + '.html',
            title: 'pages-' + urlArr[1]
        }
    });
    if (process.env.VUE_APP_LOCAL_UNRESTART === 'yes') {
        glob.sync(multiUrl).forEach(item => {
            // --生成入口名称--
            const urlArr = item.split('/');
            const urlIndex = -(urlArr.length - 5);
            // splice(index)取数组后index项
            const usableUrlArr = urlArr.splice(urlIndex);
            const entryName = getEntryName(usableUrlArr);
            // --处理页面和路径--
            const pathArr = item.split('/')
            const pathIndex = -(pathArr.length - 5)
            const usablePathArr = pathArr.splice(pathIndex)
            let pageName = usablePathArr.splice(-1)[0]
            // --获取页面名称-- 去掉__和后缀
            pageName = pageName.substring(2, pageName.length - 3)
            // --获取页面路径--
            const pathName = usablePathArr.join('/')
            entrys[entryName] = {
                entry: item,
                template: 'src/pages/index/index.html',
                filename: pathName + '/' + pageName + '.html',
            }
        });
    }
    return entrys
}

// 单独处理开发和生产hussar-config包中的图片 TODO:hussar-config中打包的图片需要细分
function hussarConfig (){
    var plugins = []
    const list = searchExtraCopyList();
    if (process.env.VUE_APP_UN_PACKAGE_COPY !== 'yes' && Array.isArray(list) && list.length > 0) {
        plugins.push(new CopyWebpackPlugin(list));
    }
    return plugins;
}

// 单独处理天斧dist文件  TODO：需优化编译服务调用时对文件的多次复制
function vfgConfig (){
    var plugins = []
    const vfgDistPath = resolve('/static-vfg');
    if (fs.existsSync(vfgDistPath) && !process.env.VUE_APP_UN_PACKAGE_VFG){
        plugins.push(
            new CopyWebpackPlugin([{
                from: vfgDistPath,
                to: resolve('/dist/hussarvfg'),
            }])
        )
    }
    return plugins;
}

// 处理主题配置前端代码
function themeConfig (){
    var plugins = []
    const themeDistPath = resolve('/static-theme');  // 将主题配置前台打包好的dist放到static-theme文件夹下
    if (fs.existsSync(themeDistPath) && !process.env.VUE_APP_UN_PACKAGE_THEME){  // 同天斧一样进行处理
        plugins.push(
            new CopyWebpackPlugin([{
                from: themeDistPath,
                to: resolve('/dist/hussartheme'), // 这里设置的是访问时的前缀，即 http://localhost:8081/hussartheme/index.html
            }])
        )
    }
    return plugins;
}

// 获取dll文件的manifest
function searchDllReferences() {
    var plugins = []
    if (process.env.VUE_APP_ENABLE_DLL !== 'yes') {
        return plugins;
    }

    const entries = require('./dllConfig').entries
    Object.keys(entries).forEach(name => {
        const manifest = resolve(`public/vendor/${name}-manifest.json`)
        if (fs.existsSync(manifest)) {
            plugins.push(
                new webpack.DllReferencePlugin({
                    context: resolve(''),
                    manifest: manifest
                })
            )
        } else {
            console.warn(`DLL manifest '${manifest}' does not exists, did you build DLL?`)
        }
    })
    return plugins
}

module.exports = {
    getEntry, hussarConfig, searchDllReferences, vfgConfig, themeConfig
}
