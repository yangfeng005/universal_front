import request from '@/utils/request';

export function signIn(data) {
  return request({
    url: '/pc/login/doLogin',
    method: 'post',
    data,
  });
}

export function signOut() {
  return request({
    url: '/pc/login/logout',
    method: 'post',
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
