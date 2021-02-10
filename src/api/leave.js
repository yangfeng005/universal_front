import request from '@/utils/request';

export function removeOne(params) {
  return request({
    url: '/vacationApply/delete',
    method: 'get',
    params,
  });
}

export function getList(data) {
  return request({
    url: '/vacationApply/list',
    method: 'post',
    data,
  });
}

export function getVacation(params) {
  return request({
    url: '/vacationApply/calculateYearVacation',
    method: 'post',
    params,
  });
}

export function findComment(processInstanceId) {
  return request({
    url: '/process/findCommentByProcessInstanceId',
    method: 'get',
    params: {
      processInstanceId,
    },
  });
}

export function terminateOne(params) {
  return request({
    url: '/vacationApply/terminate',
    method: 'get',
    params,
  });
}
