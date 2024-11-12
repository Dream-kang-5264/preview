
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/storeIndex';
import { setLoginShow, setloginButtonShow } from '@/redux/module/homeStore';
import { message } from 'antd';
import { history } from 'umi';
import { store, persistor } from "@/redux";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
const WithAuth = (WrappedComponent: React.ComponentType) => {
    const AuthComponent = (props: any) => {

        const dispatch = useAppDispatch();
        const [messageApi, contextHolder] = message.useMessage();
        useEffect(() => {
            const checkAuth = () => {
                const token = localStorage.getItem('token');
                const loginTime = Number(localStorage.getItem('loginTime'));
                const tokenTime = Number(localStorage.getItem('tokenTime'));
                const currentTime = Math.floor(Date.now() / 1000);
                if (!token) {
                    messageApi.open({
                        type: 'error',
                        content: '登录超时，请重新登录',
                    });
                    history.push('/Login');

                    return;
                }

                if (tokenTime < currentTime - loginTime) {
                    messageApi.open({
                        type: 'error',
                        content: '登录超时，请重新登录',
                    });
                    dispatch(setloginButtonShow(false));

                    history.push('/Login');
                    return;
                }
            };

            checkAuth();
        }, [dispatch, messageApi, history]);

        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <WrappedComponent {...props} />
                    {contextHolder}
                </PersistGate>
            </Provider>
        );
    };

    return AuthComponent;
};

export default WithAuth;




