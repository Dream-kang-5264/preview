import React, { useState, useEffect } from 'react'
import styles from './index.less'
import { Spin, message, Button } from 'antd'
import { baseUrl } from '@/utils/process'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getContinue } from '@/api/Aitool';
function Continue({ AiEditorHtml, continueDisplace, continueInsertion }: any) {
    let [continueData, setContinueData] = useState<any>({ loadingShow: true, contentText: '', butShow: false })
    useEffect(() => {
        getContinue({ text: AiEditorHtml }).then((res) => {
            console.log(res)
        }).catch((error) => {
            message.error(error)
        })
        getContinueData()
    }, [])
    let getContinueData = async () => {
        const ctrl = new AbortController(); //用于中断请求
      

        await fetchEventSource(`${baseUrl}/api/v1/garden/area/continuous/stream/text`, {
            method: 'POST',
            openWhenHidden: true, //页面退至后台保持连接

            headers: {
                "Content-Type": 'text/event-stream',
                "token": localStorage.getItem('token') || '',
            },

            body: JSON.stringify({
                text: AiEditorHtml,

            }),

            signal: ctrl.signal,

            onmessage(msg) {
                if (msg.data) {
                    try {
                        console.log(msg);

                        setContinueData((prev: any) => ({
                            ...prev,
                            contentText: prev.contentText + msg.data,
                            loadingShow: false
                        }))

                    } catch (err) {
                        console.log(err);
                    }
                }

            },

            onclose() {//正常结束的回调
                //在这里写一些GPT回答结束后的一些操作
                console.log('请求结束');
                setContinueData((prev: any) => ({
                    ...prev,
                    butShow: true
                }))
            },
            onerror(err) {//连接出现异常回调
                // 取消请求
                message.error('请求内容错误，请重新尝试')
                console.log(err);
                ; // 发生错误，拒绝 Promise
                throw err
            },
        })
    }
    return (
        <div className={styles.continue_body}>
            {
                continueData.loadingShow ? <div className={styles.loading}><Spin size="large" /></div> :
                    <div className={styles.continue_content}>
                        <div dangerouslySetInnerHTML={{ __html: continueData.contentText }} />
                        {/* {continueData.contentText} */}
                        {
                            continueData.butShow ? <div className={styles.but_box}>
                                <Button type='primary' onClick={() => [
                                    continueDisplace(continueData.contentText)
                                ]}>全文替换</Button>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        continueInsertion(continueData.contentText)
                                    }}>插入左侧</Button>
                            </div> : ''
                        }

                    </div>
            }
        </div>
    )
}

export default Continue