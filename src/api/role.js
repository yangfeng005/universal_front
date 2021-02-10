import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/role/deleteRole',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data,
  });
}

export function getRolePrivilege(params) {
  return request({
    url: '/role/getRolePrivilege',
    method: 'get',
    params,
  });
}

export function savePrivilege(data) {
  return request({
    url: '/role/savePrivilege',
    method: 'post',
    data,
  });
}
