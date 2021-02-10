export const hasChild = (item) => {
  return item && item.children && item.children.length !== 0;
};

/**
 * 格式化级联数据
 */
export const formatCascader = (data, txtKey = 'name', valKey = 'code') => {
  return data.map((item) => ({
    label: item[txtKey],
    value: item[valKey],
    children: hasChild(item) ? formatCascader(item.children, txtKey, valKey) : null,
  }));
};
