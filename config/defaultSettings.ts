import type { ProLayoutProps } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { history } from 'umi'
// import userImg from '../public/user.png'
/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
  items?: any
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1677FF',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '智笔写作系统',
  // title: `<div className="text-2xl font-medium"> 智笔写作系统 </div>`,
  // loading: true,
  pwa: true,
  // pure: true,
  // logo: `<img src="https://aiwritebeijing.oss-cn-beijing.aliyuncs.com/login.svg" width="120" height="auto" />`,
  logo: 'https://aiwritebeijing.oss-cn-beijing.aliyuncs.com/login.svg',
  // logo: 'http://120.232.132.10:37108/_next/static/media/1.966a273d.svg',

  iconfontUrl: '',
  token: {

    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
  avatarProps: ({
    src: 'https://aiwritebeijing.oss-cn-beijing.aliyuncs.com/user.png',
    size: 'large',
    alt: '用户头像',
    style: {
      borderRadius: '50%',
    },
    onClick: (e) => {
      // console.log('头像被点击', e);
      // 这里可以添加更多逻辑，例如跳转到用户设置页面
      Modal.confirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        onOk() {
          localStorage.removeItem('token'); // 清除用户信息
          history.push('/login'); // 跳转到登录页面
        },
      });
    },
    // title: '000',
    // render:()
  }),
  // menu 菜单的头部点击事件
  onMenuHeaderClick: ((e) => {
    // console.log(e);
  }),
  onPageChange: ((e) => {
    // console.log(e);

  })

};

export default Settings;
