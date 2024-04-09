class GYOnlinePlugin {
  constructor() {
    this.lost = '';
    this.ids = '';
    this.temp = '';
    this.modules = {};
    this.appList = require('./systemAppList.json');
    this.viewsPath = '__viewsPathForOnlineServer.txt';
  }

  apply(compiler) {
    compiler.hooks.contextModuleFactory.tap('GYOnlinePlugin', cmf => {
      cmf.hooks.contextModuleFiles.tap('GYOnlinePlugin', files => {
        // 去除租户编码下的代码目录
        const app_list = this.appList.List;
        const filePath = files.join(',');
        if (filePath.indexOf(this.viewsPath) !== -1) {
          // 识别到views下的目录
          for (const file of files) {
            if (app_list.indexOf(file) === -1) {
              // 平台app_list中不包含该应用
              const file_index = files.indexOf(file);
              // 根据序号删除
              files.splice(file_index, 1);
              console.log('online Server ignore file:', file);
            }
          }
        }
        return files;
      });
    });
  }
}

module.exports = GYOnlinePlugin;
