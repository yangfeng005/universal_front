import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/help/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/help/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/help/save',
    method: 'post',
    data,
  });
}
