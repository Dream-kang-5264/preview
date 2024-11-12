import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Alert, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';

import Website from '@/components/MaterialManages/website'
import PublicAccount from '@/components/MaterialManages/PublicAccount';
const index: React.FC = () => {

    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    const [selectedItem, setSelectedItem] = useState<string | null>('网站抓取');
    let [contentShow, setContentShow] = useState<any>()
    let MaterialData: any = ['网站抓取', '公众号抓取',]

    useEffect(() => {
        switch (selectedItem) {
            case '网站抓取':
                setContentShow(<Website />)
                break;
            case '公众号抓取':
                setContentShow(<PublicAccount />)
                break;
            default:
                break;
        }
    }, [selectedItem])
    return (
        <PageContainer
            header={{
                title: (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {MaterialData.map((item) => (
                            <div
                                key={item}
                                // strong={selectedItem === item}
                                style={{
                                    cursor: 'pointer',
                                    color: selectedItem === item ? '#1677FF' : undefined,
                                    borderBottom: selectedItem === item ? '2px solid #1677FF' : undefined,
                                }}
                                onClick={() => { setSelectedItem(item) }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                ),
            }}
            // content="材料管理"
            extra={[
                // <Typography.Text key="config" strong>
                //     添加材料
                // </Typography.Text>,
            ]}
            footer={[
                // <div key="footer">Footer</div>,
            ]}
        >

            {contentShow}
        </PageContainer>
    );
};

export default index
