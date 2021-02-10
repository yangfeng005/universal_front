import request from '@/utils/request';

export function getResourceTreeNode(data) {
  return request({
    url: '/resource/getResourceTreeNode',
    method: 'post',
    data,
  });
}

export function getResource(data) {
  return request({
    url: '/resource/getResource',
    method: 'post',
    data,
  });
}
