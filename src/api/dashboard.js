import request from '@/utils/request';

export function getList(data) {
  return request({
    url: '/user/listUsersByDataScope',
    method: 'post',
    data,
  });
}

export function getTerminalTraceList(params) {
  return request({
    url: '/terminalTrace/list',
    method: 'post',
    params,
  });
}

export function getWeatherAndSave() {
  return request({
    url: '/weather/getWeatherAndSave',
    method: 'post',
  });
}

export function getRecord(params) {
  return request({
    url: 'terminalTrace/listUsersOfUploadTrace',
    method: 'get',
    params,
  });
}
