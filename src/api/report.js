import request from '@/utils/request';

export function getMonthReport(data) {
  return request({
    url: '/report/getMonthReport',
    method: 'post',
    data,
  });
}

export function getDayReport(data) {
  return request({
    url: '/report/getDayReport',
    method: 'post',
    data,
  });
}
