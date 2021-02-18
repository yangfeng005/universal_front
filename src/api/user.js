import request from '@/utils/request';

export function updStatus(data) {
  return request({
    url: '/user/updateStatus',
    method: 'post',
    data,
  });
}

export function getList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data,
  });
}

export function resetPwd(data) {
  return request({
    url: '/user/resetPwd',
    method: 'post',
    data,
  });
}

export function saveUserRole(data) {
  return request({
    url: '/user/saveUserRole',
    method: 'post',
    data,
  });
}

export function updatePwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data,
  });
}

export function getByUserName(data) {
  return request({
    url: 'user/getByUserName',
    method: 'post',
    data,
  });
}
