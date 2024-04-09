/**
 * @author 作者
 */

/**
 * @name 计算时间间隔天数
 * @description 计算两个时间点间隔的天数
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export function calculateDays(startTime, endTime) {
  if (startTime && endTime) {
    const starttime = new Date(startTime); // 开始时间
    const endtime = new Date(endTime); // 开始时间
    const days = Math.floor((endtime - starttime) / 1000 / 60 / 60 / 24);
    alert(days);
  }
}
