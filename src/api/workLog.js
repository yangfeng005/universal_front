import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/workLog/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/workLog/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/workLog/save',
    method: 'post',
    data,
  });
}
