import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import Homes from '@/components/Homes/index'
import React, { useEffect } from 'react';
import { store, persistor } from "@/redux";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import WritingHomePage from '@/components/WritingHomePage/index';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { sethomeToolShow } from '@/redux/module/firstDraftStore';

const Admin: React.FC = () => {
  const intl = useIntl();
  let dispatch = useAppDispatch()
  useEffect(() => {
    if (history.location.pathname !== '/Addtext') {
      dispatch(setComponentsType([]))
      dispatch(sethistoryType([]))
    }
    dispatch(setisAddHistory(false))
  }, [history])
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 当文档变为可见时刷新页面
        // console.log('页面可见');
        // dispatch(sethomeToolShow(false))
        window.localStorage.removeItem('open');
      }
    };

    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数 - 当组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PageContainer
          header={{ title: '' }}
        >

          <WritingHomePage></WritingHomePage>
          {/* <Homes/> */}
        
        </PageContainer>
      </PersistGate>
    </Provider>

  );
};

export default Admin
