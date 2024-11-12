import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { getWrittenOutline } from '@/api/written'
import { Spin, Tree, message } from 'antd'
function Outline({ sendServer, setSendServer }: any) {
    const [messageApi, contextHolder] = message.useMessage();
    let [loadingShow, setLoadingShow] = useState(true)
    let [outlineData, setOutlineData] = useState<any>([])
    interface DataNode {
        title: string;
        key: string | number;
        isLeaf?: boolean;
        children?: DataNode[];
    }
    useEffect(() => {
      
        if (!sendServer.last) {
            getWrittenOutline(sendServer).then((res) => {
                if (res.data.status.code === 200) {
                    setLoadingShow(false)
                    setOutlineData(JSON.parse(res.data.article_outline))
                    setSendServer((prevState: any) => ({
                        ...prevState,
                        outline: res.data.article_outline,
                        disdisabledBut: false
                    }))
                }
            }).catch((error) => {
                messageApi.open({
                    type: 'error',
                    content: error.response.data.message,
                });
            })

        }
        else {
         

            // getWrittenOutline(themeData).then((res) => {
            //     if (res.data.status.code === 200) {
            //         setLoadingShow(false)
            //         setOutlineData(JSON.parse(res.data.article_outline))
            //         setThemeData((prevState: any) => ({
            //             ...prevState,
            //             outline: res.data.article_outline
            //         }))
            //     }
            // })  
           
            setLoadingShow(false)
            setOutlineData(JSON.parse(sendServer.outline))
        }

        return () => {
         
        }

    }, [])
    let arr = []
    arr.push(outlineData)
    const initTreeData = arr.map((item: any, index: number) => {
        return {
            title: <div style={{ padding: '1vh' }}>主题：{item.title}</div>,
            key: '110',
            isLeaf: false,
            children: item.chapters?.map((items: any, indexs: number) => {

                function indexToChinese(curr: any) {
                    const chineseDigits = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
                    return chineseDigits[curr];
                }
                return {
                    title: <div style={{ padding: '1vh' }}>第{indexToChinese(indexs)}章：{items.title}</div>,
                    key: Math.floor(Math.random() * 99999999) + 1,
                    isLeaf: false,
                    children: items.subchapters?.map((itemss: any, indexss: number) => {
                        return {
                            title: <div style={{ padding: '1vh' }}>{indexs + 1}.{indexss + 1}：{itemss.title}</div>,
                            key: Math.floor(Math.random() * 99999999) + 1,
                            isLeaf: true,
                        }
                    })
                }
            })
        }
    })


    return (
        <div className={styles.outline_body}>
            <div className={styles.outline_title}>生成大纲:</div>

            {
                loadingShow ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'90%' }}>  <Spin size="large" /></div> : <div className={styles.outline_content}>
                    <Tree blockNode defaultExpandParent defaultExpandedKeys={['110']} treeData={initTreeData} />
                </div>
            }
            {contextHolder}
        </div>
    )
}

export default Outline
