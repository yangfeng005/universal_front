import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/meeting/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/meeting/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/meeting/save',
    method: 'post',
    data,
  });
}
