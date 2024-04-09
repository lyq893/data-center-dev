import { hussarRequest } from 'hussar-base';
// 查询全部地区数据
export function getRegionInfo(data) {
  return hussarRequest.get('/hussarBase/region/getRegionInfo', data);
}
// 查询指定级别及上级地区的所有数据
export function getRegionInfoByLevel(data) {
  return hussarRequest.get('/hussarBase/region/getRegionInfoByLevel', data);
}
// 根据地区id集合查地区信息
export function getRegionInfoByIds(data) {
  return hussarRequest.get('/hussarBase/region/getRegionInfoByIds', data);
}
// 根据id查子地区信息
export function getChildrenRegionInfoById(data) {
  return hussarRequest.get('/hussarBase/region/getChildrenRegionInfoById', data);
}
// 根据地区id集合获取自身及所有上级的全路径地区信息
export function getFullPathRegionInfoByIds(data) {
  return hussarRequest.get('/hussarBase/region/getFullPathRegionInfoByIds', data);
}
// 根据id懒加载查子地区信息
export function getChildrenRegionInfoById2(data) {
  return hussarRequest.get('/hussarBase/region/getChildrenRegionInfoById', data);
}
// 根据关键字查询地区信息数组
export function getRegionsLikeName(data) {
  return hussarRequest.get('/hussarBase/region/getRegionsLikeName', data);
}

const regionSelectOneData = [];
const regionSelectTwoData = [];
const regionSelectThreeData = [];
const regionSelectFourData = [];

export default {
  regionSelectOneData, // 省数据
  regionSelectTwoData, // 省市数据
  regionSelectThreeData, // 省市区数据
  regionSelectFourData, // 省市区街道数据
  setRegionSelectOneData() {
    const data = {
      level: '1'
    };
    getRegionInfoByLevel(data).then((res) => {
      if (res.code === 10000) {
        const result = res.data;
        this.regionSelectOneData = result;
      } else {
        this.$message.error('获取省市区下拉数据失败');
      }
    }).catch(() => {
      console.error('获取省市区下拉数据异常');
    });
  },
  setRegionSelectTwoData() {
    const data = {
      level: '2'
    };
    getRegionInfoByLevel(data).then((res) => {
      if (res.code === 10000) {
        const result = res.data;
        this.regionSelectTwoData = result;
      } else {
        this.$message.error('获取省市区下拉数据失败');
      }
    }).catch(() => {
      console.error('获取省市区下拉数据异常');
    });
  },
  setRegionSelectThreeData() {
    const data = {
      level: '3'
    };
    getRegionInfoByLevel(data).then((res) => {
      if (res.code === 10000) {
        const result = res.data;
        this.regionSelectThreeData = result;
      } else {
        this.$message.error('获取省市区下拉数据失败');
      }
    }).catch(() => {
      console.error('获取省市区下拉数据异常');
    });
  },
  setRegionSelectFourData() {
    const data = {
      level: '4'
    };
    getRegionInfoByLevel(data).then((res) => {
      if (res.code === 10000) {
        const result = res.data;
      } else {
        this.$message.error('获取省市区下拉数据失败');
      }
    }).catch(() => {
      console.error('获取省市区下拉数据异常');
    });
  }
};
