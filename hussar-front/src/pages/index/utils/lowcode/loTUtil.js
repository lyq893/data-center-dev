import Echarts5 from '@/utils/echartsUi';

function DrawGaugePublic(key, self) {
  // 基于准备好的dom，初始化echarts实例
  self[key + 'Gauge'] = Echarts5.init(this.$refs[key + 'Ref']);
  self[key + 'Gauge'].setOption(self[key + 'Option']);
}

export { DrawGaugePublic };
