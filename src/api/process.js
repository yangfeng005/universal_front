import request from '@/utils/request';

export function removeOne(params, type) {
  const url = `/model/${type == 1 ? 'revokePublish' : 'delete'}`;

  return request({
    url,
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/model/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/model/save',
    method: 'post',
    data,
  });
}

// 获取初始模型id
export function createOne(data) {
  return request({
    url: '/model/create',
    method: 'post',
    data,
  });
}

// 发布流程
export function publishOne(params) {
  return request({
    url: '/model/publish',
    method: 'get',
    params,
  });
}
