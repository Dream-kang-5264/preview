import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Alert, Card, Tabs, TabsProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import UserMaterial from '@/components/Searchs/indexs'
import CommonMaterial from '@/components/CommonMaterial/index'
import GoldenMaterial from '@/components/PublicMaterial/index';
import ExternalMaterial from '@/components/ExternalMaterial';

const index: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>('个人素材');
    let [contentShow, setContentShow] = useState<any>()
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    let MaterialData: any = ['个人素材', '公共素材', '金句素材', '外部素材']
    useEffect(() => {
        switch (selectedItem) {
            case '个人素材':
                setContentShow(<UserMaterial />)
                break;
            case '公共素材':
                setContentShow(<CommonMaterial />)
                break;
            case '金句素材':
                setContentShow(<GoldenMaterial />)
                break;
            case '外部素材':
                setContentShow(<ExternalMaterial />)
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
                        {MaterialData.map((item: string) => (
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
        // tabList={[
        //     {
        //         key: 'detail',
        //         tab: 'Detail',
        //     },
        //     {
        //         key: 'info',
        //         tab: 'Info',
        //     },
        //     {
        //         key: 'account',
        //         tab: 'Account',
        //     },
        // ]
        // }
        >
            {contentShow}
        </PageContainer>
    );
};

export default index
