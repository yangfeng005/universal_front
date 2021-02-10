import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/dictionary/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/dictionary/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/dictionary/save',
    method: 'post',
    data,
  });
}
