import { getTempletData } from '@/api/Templet';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Alert, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { store, persistor } from "@/redux";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import Addtext from '@/components/Addtext/index'
import Historys from '@/components/History/index'
import { useAppDispatch } from '@/redux/storeIndex';
import { setthemeShow } from '@/redux/module/homeStore';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import WithAuth from '@/components/WithAuth/Index'
const History: React.FC = () => {
  let dispatch = useAppDispatch()
  useEffect(() => {
    if (history.location.pathname !== '/Addtext') {
      dispatch(setComponentsType([]))
      dispatch(sethistoryType([]))
    }
    dispatch(setisAddHistory(false))
  }, [history])

  const intl = useIntl();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PageContainer
        >
          <Historys></Historys>
        </PageContainer>
      </PersistGate>
    </Provider>

  );
};

export default History
