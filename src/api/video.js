import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/video/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/video/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/video/save',
    method: 'post',
    data,
  });
}
