// src/services/request.js
import { extend } from 'umi-request';
import { checkToken } from '../utils/auth';

const request = extend({
  // 其他配置
  prefix: '/api',
  timeout: 10000,
  errorHandler: (error) => {
    const { response } = error;
    if (response) {
      checkToken(response);
    } else {
      message.error('Network error');
    }
    throw error;
  },
});

// 在请求中加入 token
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    },
  };
});

export default request;
