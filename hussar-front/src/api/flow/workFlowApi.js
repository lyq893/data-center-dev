// 忘记密码
export const workFlowApi = {
  // 带节点的选择参与者页面
  queryNodeAssigneeAndDept: '/bpm/publicProcess/queryNodeAssigneeAndDept', // 模糊查询树的下拉
  queryNextNode: '/bpm/publicProcess/queryNextNode',
  queryNextUserTask: '/bpm/publicProcess/queryNextUserTask',
  queryNextAssigneeByTaskIdAndNodeId: '/bpm/publicProcess/queryNextAssigneeByTaskIdAndNodeId', // 节点切换
  dept: '/bpm/publicProcess/dept', // 懒加载树数据
  queryNodeAssigneeListByPage: '/bpm/publicProcess/queryNodeAssigneeListByPage', // 获取table数据
  queryDeptTreeByChildren: '/bpm/publicProcess/queryDeptTreeByChildren', // 获取树组件数据
  // 选择转办人页面
  queryUserTree: '/bpm/publicProcess/queryUserTree', // 模糊查询树的下拉
  queryUserListByPage: '/bpm/publicProcess/queryUserListByPage', // 获取table数据
  // 追加节点页面
  addCustomNode: '/bpm/publicProcess/addCustomNode', // 调用追加节点方法
  // 自由驳回页面
  queryRejectNode: '/bpm/publicProcess/queryRejectNode', // 获取驳回任意节点列表数据
  saveOrUpdate: '/bpm/customComment/saveOrUpdate', // 获取快捷意见数据
  delete: '/bpm/customComment/delete', // 删除自定义意见
  queryByPage: '/bpm/customComment/queryByPage',
  createAssistTask: '/bpm/publicProcess/createAssistTask', // 发起协办
  completeAssistTask: '/bpm/publicProcess/completeAssistTask', // 协办办理
  ccTask: '/bpm/publicProcess/ccTask' // 发起协办
};
