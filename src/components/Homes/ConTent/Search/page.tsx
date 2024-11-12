import React, { useState } from 'react'
import { baseUrl } from '@/utils/process'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getCreateRecord } from '@/api/outline';
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import { setComponentsType, setDecordId, setLongtitle, setloadingShow, setoutlineLoading, sethistoryType } from '@/redux/module/LongStore';
import Send from '../../../../../public/home/Frame.png'
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, message } from 'antd';
import Addtext from '../../../Addtext/index';
import { history } from 'umi';
import { setthemeShow } from '@/redux/module/homeStore';

function Index({ setContent }: any) {
    let [borderShow, setborderShow] = useState(true)
    let [inputValue, setInputValue] = useState('')
    let [currId, setCurrId] = useState('')
    let dispatch = useAppDispatch()

    let { componentsType, createDecordId } = useAppSelector(state => state.longReducer)
    // 键盘事件
    let handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && inputValue) {
            handleSend()
        }
    }
    // 首页发送
    let handleSend = async () => {
       
        history.push('/Addtext')
        const ctrl = new AbortController(); //用于中断请求
        // 创建会话
        let { data } = await getCreateRecord()
        // console.log(data, createDecordId);
        dispatch(setDecordId(data.chatId))
        dispatch(setComponentsType([]))
        dispatch(setthemeShow(false))
        dispatch(sethistoryType([]))
        // return
        // 用户的文本
        let newComponents = JSON.parse(JSON.stringify(componentsType))
        let myType = {
            type: 'myType',
            content: inputValue,
            key: Math.floor(Math.random() * 99999999) + 1,
        }
        newComponents.push(myType)
        dispatch(setComponentsType(newComponents))
        // 加载组件
        let longdingComponents = JSON.parse(JSON.stringify(newComponents))
        let loadingType = {
            type: 'loadingType',
            key: Math.floor(Math.random() * 99999999) + 1,
        }
        longdingComponents.push(loadingType)
        dispatch(setComponentsType(longdingComponents))
        // 开启加载动画
        dispatch(setloadingShow(true))

        if (inputValue.includes('写短文')) {
            // console.log(LongValue);

            let attachmentId = uuidv4();
            let src = ''
            let crr: any = []
            let title: any = []
            await fetchEventSource(`${baseUrl}/api/v1/garden/area/general/writing/stream/text`, {
                method: 'POST',
                openWhenHidden: true, //页面退至后台保持连接

                headers: {
                    "Content-Type": 'text/event-stream',
                    "token": localStorage.getItem('token') || '',
                },
                body: JSON.stringify({
                    user_input: inputValue,
                    conversation_id: createDecordId,
                    attachment_id: attachmentId
                }),
                signal: ctrl.signal,

                onmessage(msg) {


                    if (msg.data) {
                        try {
                            dispatch(setloadingShow(false))
                            let addcomponentsType = JSON.parse(JSON.stringify(longdingComponents))
                            // console.log(msg.data)
                            title.push(msg)
                            console.log(title)
                            src += msg.data
                            let essayType = {
                                type: 'essayType',
                                content: src
                            }
                            addcomponentsType.push(essayType)
                            dispatch(setComponentsType(addcomponentsType))
                            // dispatch(setAItext(src))
                            crr = addcomponentsType
                        } catch (err) {
                            console.log(err);
                        }
                    }

                },

                onclose() {//正常结束的回调
                    //在这里写一些GPT回答结束后的一些操作
                    console.log('请求结束');
                    dispatch(setoutlineLoading(false))
                    let attachmentComponents = JSON.parse(JSON.stringify(crr))
                    let newTitle = ''
                    title.forEach((item: any) => {
                        if (item.data.includes('<H1>')) {
                            return newTitle = item.data.match(/<H1>(.*?)<\/H1>/);
                           
                        }
                    });
                    let DraftType = {
                        type: 'DraftType',
                        content: {
                            title: newTitle[1],
                            attachmentId: attachmentId,
                        },
                        id: attachmentId,
                        key: Math.floor(Math.random() * 99999999) + 1
                    }
                    attachmentComponents.push(DraftType)
                    dispatch(setComponentsType(attachmentComponents))
                },
                onerror(err) {//连接出现异常回调
                    // 取消请求
                    message.error('请求内容错误，请重新尝试')
                    console.log(err);
                    ; // 发生错误，拒绝 Promise
                    throw err
                },
            })
            return
        }

        else {
            let src = ""
            await fetchEventSource(`${baseUrl}/api/v1/admin/user/answers`, {
                method: 'POST',
                openWhenHidden: true, //页面退至后台保持连接
                headers: { "Content-Type": 'text/event-stream', "token": localStorage.getItem('token') || '', },
                body: JSON.stringify({
                    text: inputValue,
                    conversation_id: data.chatId,
                    order_id: 1
                }),
                signal: ctrl.signal,
                onmessage(msg) {
                    // 关闭加载动画
                    dispatch(setloadingShow(false))
                    if (msg.data) {
                        try {
                            src += msg.data
                            let thesisComponents = JSON.parse(JSON.stringify(longdingComponents))
                            let thesisType = {
                                type: 'longType',
                                content: src,
                                key: Math.floor(Math.random() * 99999999) + 1,
                            }
                            thesisComponents.push(thesisType)
                            dispatch(setComponentsType(thesisComponents))

                        } catch (err) {
                            console.log(err);
                        }
                    }

                },

                onclose() {//正常结束的回调
                    //在这里写一些GPT回答结束后的一些操作
                    console.log('请求结束');
                },
                onerror(err) {//连接出现异常回调
                    // 取消请求
                    console.log(err);
                    ; // 发生错误，拒绝 Promise
                    throw err
                },
            })
        }
    }
    return (
        <>
            <div style={{ border: borderShow ? '2px solid #D0DCF8' : '2px solid #D0DCF8', padding: '10px', borderRadius: '1rem', height: '4rem', display: 'flex', background: '#fff', alignItems: 'center' }}>
                <input type="text" style={{ flex: 1, outline: 'none', background: '#fff', fontSize: '1vw', border: 'none' }} placeholder='今天需要我做些什么？shift+enter换行'
                    onFocus={() => setborderShow(false)} onBlur={() => setborderShow(true)}
                    value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                />
                {
                    !inputValue ? <Tooltip placement="top" title={'请输入内容'}>
                        <div style={{ background: '#D6E2FF', border: 'none', height: '100%', display: 'flex', alignItems: 'center', width: '5%', borderRadius: '1vh', justifyContent: 'center' }}>    <img width={20} height={20} src={Send} alt='' /></div>

                    </Tooltip> : <div style={{ background: '#3370FF', border: 'none', height: '100%', display: 'flex', alignItems: 'center', width: '5%', borderRadius: '1vh', justifyContent: 'center' }}>    <img width={20} height={20} src={Send} alt='' onClick={handleSend} /></div>
                }



            </div>
        </>
    )
}

export default Index
