import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/apkVersion/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/apkVersion/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/apkVersion/save',
    method: 'post',
    data,
  });
}
