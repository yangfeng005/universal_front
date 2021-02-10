import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/law/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/law/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/law/save',
    method: 'post',
    data,
  });
}
