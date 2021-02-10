import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/travelApply/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/travelApply/list',
    method: 'post',
    data,
  });
}
