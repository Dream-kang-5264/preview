// utils/auth.js
import { history } from 'umi';
import { message } from 'antd';

export const checkToken = (response) => {
  if (response && response.status === 401) {
    // 如果返回401，则说明token过期或无效
    message.warning('超时了');
    // 清除本地存储的token
    localStorage.removeItem('token');
    // 跳转到登录页面
    history.push('/login');
  }
};
