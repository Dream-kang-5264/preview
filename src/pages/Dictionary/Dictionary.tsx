
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import Dictionarys from '@/components/Dictionarys/Dictionarys';


const Dictionary: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])

    return (
        <PageContainer
        >
            <Dictionarys></Dictionarys>
        </PageContainer>
    );
};

export default Dictionary
