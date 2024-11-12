/**
 * @see https://umijs.org/docs/max/access#access
 * */
import { message } from 'antd';
import { history } from 'umi';
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  // const { currentUser } = initialState ?? {};

  return {
    canUser: () => {
      const token = localStorage.getItem('token');
      const loginTime = Number(localStorage.getItem('loginTime'));
      const tokenTime = Number(localStorage.getItem('tokenTime'));
      const currentTime = Math.floor(Date.now() / 1000);
      if (!token) {
        // message.warning('登录超时，请重新登录');
        history.push('/login')
      }

      if (tokenTime < currentTime - loginTime) {
        // message.warning('登录超时，请重新登录');
        history.push('/login');
        return;
      }
      const role = localStorage.getItem('role');
      return role && token && role === 'user' || role === 'admin'
    },
    canAdmin: () => {
      const token = localStorage.getItem('token');
      const loginTime = Number(localStorage.getItem('loginTime'));
      const tokenTime = Number(localStorage.getItem('tokenTime'));
      const currentTime = Math.floor(Date.now() / 1000);
      if (!token) {
        // message.warning('登录超时，请重新登录');
        history.push('/login')
      }

      if (tokenTime < currentTime - loginTime) {
        // message.warning('登录超时，请重新登录');
        history.push('/login');
        return;
      }
      const role = localStorage.getItem('role');
      return role && token && role === 'admin'
    }

    // canAdmin: currentUser && currentUser.access === 'admin',
  };
}
// export default function (initialState = {}) {
//   const { isAdmin, hasRoutes = [] } = initialState;
//   return {
//     // ...
//     adminRouteFilter: () => isAdmin, // 只有管理员可访问
//     normalRouteFilter: (route) => hasRoutes.includes(route.name), // initialState 中包含了的路由才有权限访问
//   };
// }
