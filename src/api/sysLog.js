import request from '@/utils/request';

export function getList(data) {
  return request({
    url: '/sysLog/list',
    method: 'post',
    data,
  });
}
