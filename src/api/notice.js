import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/notice/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/notice/list',
    method: 'post',
    data,
  });
}

export function saveOrUpd(data, type = 'saveAndPublish') {
  const url = `/notice/${type}`;

  return request({
    url,
    method: 'post',
    data,
  });
}

export function updateStatus(data) {
  return request({
    url: '/notice/updateStatus',
    method: 'post',
    data,
  });
}
