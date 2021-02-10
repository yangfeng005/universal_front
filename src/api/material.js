import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/material/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/material/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/material/save',
    method: 'post',
    data,
  });
}

export function removeApplyOne(params) {
  return request({
    url: '/materialApply/delete',
    method: 'get',
    params,
  });
}

export function getApplyList(data) {
  return request({
    url: '/materialApply/list',
    method: 'post',
    data,
  });
}
