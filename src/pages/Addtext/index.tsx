// import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
// import { PageContainer } from '@ant-design/pro-components';
// import { useIntl } from '@umijs/max';
// import { Alert, Card, Typography } from 'antd';
// import React, { useEffect, useRef } from 'react';
// import { store, persistor } from "@/redux";
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react'
// import Addtext from '@/components/Addtext/index'
// import { history } from 'umi';
// import { setDecordId, setLongtitle, setComponentsType, sethistoryDecordId, sethistoryType, setisAddHistory, } from '@/redux/module/LongStore'
// import { setthemeShow, setDefaulText } from "@/redux/module/homeStore";
// import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
// const AddText: React.FC = () => {
//   let { DefaulText } = useAppSelector(state => state.homeReducer)

//   const intl = useIntl();
//   let dispatch = useAppDispatch()
//   let ContentRef = useRef<any>(null)
//   let { outlineLoading, loadingShow, progressShow, titleOutline, componentsType, } = useAppSelector(state => state.longReducer)
//   let { historyType, isAddHistory }: any = useAppSelector(state => state.longReducer)
//   useEffect(() => {
//     if (history.location.pathname === '/Addtext') {
//       dispatch(setthemeShow(false))
//       console.log(DefaulText);
//       if (!DefaulText) {
//         dispatch(setLongtitle(0))
//       }
//     }
//     if (!isAddHistory) {
//       dispatch(setComponentsType([]))
//       dispatch(sethistoryType([]))
//     }

//   }, [history])
//   useEffect(() => {
//     if (ContentRef.current) {
//       ContentRef.current.scrollIntoView({ behavior: "smooth", block: "end", });
//       ContentRef.current.scrollTop = ContentRef.current.scrollHeight - ContentRef.current.clientHeight;
//     }
//     console.log(historyType, componentsType);

//   }, [componentsType, outlineLoading, progressShow, historyType]);
//   return (
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <PageContainer
//           ref={ContentRef}
//           style={{ overflow: 'hidden' }}
//         >

//           <Addtext></Addtext>
//         </PageContainer>
//       </PersistGate>
//     </Provider>
//   );
// };

// export default AddText;
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useRef } from 'react';
import { store, persistor } from "@/redux";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Addtext from '@/components/Addtext/index';
import { history } from 'umi';
import { setLongtitle, setComponentsType, sethistoryType } from '@/redux/module/LongStore';
import { setthemeShow } from "@/redux/module/homeStore";
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import WithAuth from '@/components/WithAuth/Index'
const AddText: React.FC = () => {
  const { DefaulText } = useAppSelector(state => state.homeReducer);
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { componentsType, outlineLoading, progressShow, historyType, isAddHistory } = useAppSelector(state => state.longReducer);

  useEffect(() => {
    if (history.location.pathname === '/Addtext') {
      dispatch(setthemeShow(false));
      if (!DefaulText) {
        dispatch(setLongtitle(0));
      }
    }
    if (!isAddHistory) {
      dispatch(setComponentsType([]));
      dispatch(sethistoryType([]));
    }
  }, [history]);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end", });

  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // }, [componentsType, outlineLoading, progressShow, historyType]);



  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {/* <div
          ref={scrollRef}
          style={{ height: '90vh',overflow:'hidden' }}
        > */}

        <PageContainer
          header={{
            title: ''
          }}
          style={{ overflow: 'hidden', height: '100vh' }}
        >
          <Addtext />
        </PageContainer>
        {/* </div> */}
      </PersistGate>
    </Provider>
  );
};

export default AddText

