import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/sign/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/sign/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/sign/save',
    method: 'post',
    data,
  });
}
