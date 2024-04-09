
/**
 * @param {Array} queryConditionsFields 天斧查询条件
 * @param {Array} filterConfig 列筛选参数
 * @param {Object} params 查询参数
 */
export function getQueryConditionsResult({
  queryConditionsFields,
  filterConfig = [],
  params
}) {
  const result = [];

  const SYMBOLS = [
    { value: '=', label: '等于', name: 'Equal', relation: '_eq' },
    { value: '!=', label: '不等于', name: 'NotEqual', relation: '_ne' },
    { value: '<', label: '小于', name: 'LessThan', relation: '_lt' },
    { value: '>', label: '大于', name: 'MoreThan', relation: '_gt' },
    { value: '<=', label: '小于等于', name: 'lessAndThan', relation: '_le' },
    { value: '>=', label: '大于等于', name: 'moreAndThan', relation: '_ge' },
    { value: 'in', label: '包含', name: 'In', relation: '_in' },
    { value: 'not in', label: '不包含', name: 'NotIn', relation: '_notIn' },
    { value: 'full_like', label: '任意匹配(%*%)', name: 'FullLike', relation: '_like' },
    { value: 'left_like', label: '左匹配(*%)', name: 'LeftLike', relation: '_leftLike' },
    { value: 'right_like', label: '右匹配(%*)', name: 'RightLike', relation: '_rightLike' },
    { value: 'regexp', label: '正则匹配', name: 'regexp', relation: '_eq' } // 正则匹配技术组件不支持，转为等于
  ];
  const deepFields = (item, resultList) => {
    if (item.children && item.children.length) {
      const resultItem = {
        field: '',
        rule: '',
        val: '',
        match: item.match.toUpperCase(),
        children: []
      };

      item.children.forEach(item => {
        deepFields(item, resultItem.children);
      });
      if (resultItem.children.length) {
        resultList.push(resultItem);
      }
    } else {
      const val = params[item.queryAttrName];
      if (!val && val !== 0) return;
      if (Array.isArray(val) && val.length === 0) return null;
      const rule = (SYMBOLS.find(symbol => symbol.value === item.symbol) || {}).relation || '_eq';
      resultList.push({
        field: item.name,
        rule,
        match: item.match.toUpperCase(),
        val,
        children: []
      });
    }
  };
  queryConditionsFields.forEach((item) => {
    deepFields(item, result);
  });
  const RELATIONS = [ // 当关系为其中一种时，查询条件值为空
    '_isNull', // 为空
    '_isNotNull' // 不为空
  ];
  const queryConditions = filterConfig.map((config) => {
    const isRelationNull = RELATIONS.indexOf(config.relation) > -1;
    const commonObj = {
      field: config.field,
      match: config.match || 'AND',
      rule: config.relation,
      children: []
    };
    if (isRelationNull) {
      return {
        ...commonObj
      };
    }
    if (!config.value && config.value !== 0) return null;
    if (Array.isArray(config.value) && config.value.length === 0) return null;
    const obj = {
      ...commonObj,
      val: config.value
    };
    return obj;
  }).filter(item => item);
  const finalResult = [];
  if (queryConditions && queryConditions.length) {
    finalResult.push({
      field: '',
      rule: '',
      match: 'AND',
      val: '',
      children: queryConditions
    });
  }
  if (result && result.length) {
    finalResult.push({
      field: '',
      rule: '',
      match: 'AND',
      val: '',
      children: result
    });
  }

  return finalResult;
}
