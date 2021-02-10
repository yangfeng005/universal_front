import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import { getToken, removeToken, removeUser } from '@/utils/auth';

import qs from 'qs';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600e3, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) config.headers['Authorization'] = token;

    // 默认post参数为formData
    if (config.method === 'post' && config.formData !== false) {
      config.data = qs.stringify({ ...config.data });
    }

    return config;
  },
  (error) => {
    // do something with request error
    // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    if (response.data.code === 200) {
      // 服务端定义的响应code码为0时请求成功
      // 使用Promise.resolve 正常响应
      return Promise.resolve(response.data);
    } else {
      switch (response.data.code) {
        case -104:
          MessageBox.confirm('Token认证失败，请重新登录', '温馨提示', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            removeToken();
            removeUser();
            window.location.reload();
          });
          break;
        case 401:
          removeToken();
          removeUser();
          Message({
            message: response.data.msg || 'Error',
            type: 'error',
          });
          break;
        default:
          Message({
            message: response.data.msg || 'Error',
            type: 'error',
          });
      }

      return Promise.reject(new Error(response.data.msg || 'Error'));
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

export default service;
