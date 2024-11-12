import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { Checkbox, CheckboxProps, Spin, message } from 'antd'
import { EditOutlined } from '@ant-design/icons';
import { getExtractData } from '@/api/written';
function Extract({ sendServer, setSendServer }: any) {
    let [extractData, setExtractData] = useState<any>([])
    const [messageApi, contextHolder] = message.useMessage();
    let [loadingShow, setLoadingShow] = useState(true)
    useEffect(() => {
        // console.log(sendServer, '摘编');

        if (!sendServer.last) {
            getExtractData(sendServer).then((res: any) => {
                if (res.data.status.code === 200) {
                    setLoadingShow(false)
                    setExtractData(JSON.parse(res.data.article_outline))
                    // setupdataextractData(JSON.parse(res.data.article_outline))
                    setSendServer((prevState: any) => ({
                        ...prevState,
                        compile: res.data.article_outline,
                        disdisabledBut: false
                    }))
                }

            }).catch((error) => {
                messageApi.open({
                    type: 'error',
                    content: error.response.data.message,
                });
            })
            // const [messageApi, contextHolder] = message.useMessage();
        }
        else {
            setLoadingShow(false)
            setExtractData(JSON.parse(sendServer.compile))
        }
        // console.log(sendServer);
        return () => {

        }
    }, [])

    const onChange = (e: any, item: any, index: number) => {
        // console.log(item, e.target.checked);
        if (!e.target.checked) {
            let arr = JSON.parse(JSON.stringify(extractData))
            arr.content?.splice(index, 1)

            setSendServer((prevState: any) => ({
                ...prevState,
                compile: JSON.stringify(arr)
            }))
        }
        else {
            let arr = JSON.parse(JSON.stringify(extractData))
            arr.content.push(item)
            setSendServer((prevState: any) => ({
                ...prevState,
                compile: JSON.stringify(arr)
            }))

        }


        // console.log(JSON.parse(themeData.compile));
        // console.log(extractData);   
        // setExtractData(JSON.parse(themeData.compile))

    };
    return (
        <div className={styles.extract_body}>
            <div className={styles.extract_title}>生成摘编:</div>
            {
                loadingShow ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,height:'90%' }}>  <Spin size="large" /></div> : <div style={{ overflow: 'auto' }}>
                    {
                        extractData.content?.map((item: any, index: number) => {
                            return <div className={styles.extract_item} key={index}>
                                <div className={styles.extract_item_context}><span style={{ color: 'blue' }}>摘编{index + 1}:</span><span>{item.description}</span>

                                </div>
                                <div className={styles.extract_item_icon}>
                                    <Checkbox onChange={(e) => { onChange(e, item, index) }} defaultChecked ></Checkbox>
                                    <EditOutlined style={{ color: 'blue' }} />
                                </div>
                            </div>
                        })
                    }
                </div>
            }
            {contextHolder}
        </div>
    )
}

export default Extract