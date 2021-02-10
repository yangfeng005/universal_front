import request from '@/utils/request';

export function getType(data) {
  return request({
    url: '/workFlowCategory/list',
    method: 'post',
    data,
  });
}

export function removeOne(params) {
  return request({
    url: '/workFlowType/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/workFlowType/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/workFlowType/save',
    method: 'post',
    data,
  });
}

// 获取已发布的流程
export function processList(data, isAll) {
  const url = `/process/list${isAll ? '' : 'LatestVersion'}`;

  return request({
    url,
    method: 'post',
    data,
  });
}
