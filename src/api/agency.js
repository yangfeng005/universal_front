import request from '@/utils/request';

export function getList(data) {
  return request({
    url: '/agency/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/agency/save',
    method: 'post',
    data,
  });
}

export function removeOne(params) {
  return request({
    url: '/agency/delete',
    method: 'get',
    params,
  });
}
