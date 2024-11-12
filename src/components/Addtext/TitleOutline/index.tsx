"use client";
import React, { useEffect, useRef, useState } from 'react'
import styles from '@/components/Addtext/TitleOutline/TitleOutline.module.scss'
import { Button, Dropdown, Input, Modal, Steps, Timeline, Tooltip, message } from 'antd'
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import {
    ExclamationCircleOutlined,

} from '@ant-design/icons';
import { setComponentsType, setaddOutlineid, setgetLongtext, sethistoryType, setloadingShow, setlongTextLength, setoutlineLoading, setprogressShow, settitleOutlineShow } from '@/redux/module/LongStore';

import _ from 'lodash'

import Content from './Timelines'
import { exchangeOutline, getOutline } from '@/api/outline/index';
import { getCreateRecord, getHistory } from '@/api/outline';

import chatAI from '../../../../public/2.svg'
function Index(props: any) {
    let { titleOutline } = props
    let outlineRef = useRef<HTMLDivElement>(null)
    let dispatch = useAppDispatch()
    let { isAddHistory, outlineValue, historyType, componentsType, createDecordId, orderId, addOutlineid, longTextLength, historyDecordId } = useAppSelector(state => state.longReducer)
    let [getData, setGetData]: any = useState([])
    // 按钮禁用
    let [forbidden, setForbidden] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false); // 换个大纲的弹窗框状态
    useEffect(() => {
        if (outlineRef.current) {
            outlineRef.current.scrollTop = outlineRef.current.scrollHeight - outlineRef.current.clientHeight;
        }
    }, [titleOutline]);
    // 渲染的数据
    // console.log(JSON.parse(titleOutline.content));

    let upData: any = null
    if (titleOutline.content) {
        // console.log(titleOutline);
        upData = JSON.parse(titleOutline.content)

    } else if (titleOutline) {
        upData = JSON.parse(titleOutline)
    }


    let onData = (data: any) => {
        // console.log(data);
        function addChapterNumbers(chapters: any, chapterNumber: number = 1): any {
            return chapters.map((chapter, index) => {
                const newTitle = `第${chapterNumber + index}章 ${chapter.title}`;
                const newSubchapters = chapter.subchapters?.map((subchapter, subIndex) => {
                    const subChapterNumberStr = `${chapterNumber + index}.${subIndex + 1}`;
                    const newSubSubchapters = subchapter.subchapters?.map((subsubchapter, subsubIndex) => {
                        const subSubChapterNumberStr = `${subChapterNumberStr}.${subsubIndex + 1}`;
                        return {
                            ...subsubchapter,
                            title: `${subSubChapterNumberStr} ${subsubchapter.title}`
                        };
                    });

                    return {
                        ...subchapter,
                        title: `${subChapterNumberStr} ${subchapter.title}`,
                        subchapters: newSubSubchapters
                    };
                });

                return {
                    ...chapter,
                    title: newTitle,
                    subchapters: newSubchapters
                };
            });
        }
        let arr = addChapterNumbers(data.chapters)

        let newData = {
            title: data.title,
            chapters: arr
        }
        // console.log(newData);
        setGetData(newData)
    }
    useEffect(() => {
        // console.log(historyType);
    }, [])
    // 参数
    let obj = {
        title: getData.title,
        chapters: getData.chapters,
        conversation_id: isAddHistory ? historyDecordId : createDecordId,
        order_id: orderId
    }
    // 点击生成长文
    const ctrl = new AbortController(); //用于中断请求


    let getLongContent = async () => {
        setForbidden(true);

        if (isAddHistory) {
            let longTextLengths: any = _.cloneDeep(longTextLength)
            longTextLengths.push({
                id: historyDecordId,
                length: historyType.length
            })
            dispatch(setlongTextLength(longTextLengths))
            let componentProgres: any = _.cloneDeep(historyType)
            let ProgressTypes = {
                type: 'ProgressType',
                key: Math.floor(Math.random() * 99999999) + 1
            }
            componentProgres.push(ProgressTypes)
            dispatch(sethistoryType(componentProgres))
            dispatch(setprogressShow(true))

            getOutline(obj).then((res) => {
                console.log(res, '长文获取完毕')
                if (res.data.status.code === 200) {
                    let DraftDocument: any = _.cloneDeep(historyType)
                    let DraftType = {
                        type: 'DraftType',
                        content: res.data,
                        key: Math.floor(Math.random() * 99999999) + 1
                    }
                    let longTextLengths = _.cloneDeep(longTextLength)
                    longTextLengths.forEach((item: any, index: any) => {
                        if (res.data.chatId === item) {
                            longTextLengths.splice(index, 1)
                            dispatch(setlongTextLength(longTextLengths))
                        }
                    })
                    DraftDocument.push(DraftType)
                    dispatch(sethistoryType(DraftDocument))
                    dispatch(setprogressShow(false))
                }
                if (res.data.status.code === 500) {
                    dispatch(setprogressShow(false))
                    setForbidden(false)
                    message.error('内部服务器错误')
                }
            }).catch((error) => {
                message.error(error)
            })
        }
        else {
            let longTextLengths: any = _.cloneDeep(longTextLength)
            longTextLengths.push({
                id: createDecordId,
                length: componentsType.length - 3
            })
            dispatch(setlongTextLength(longTextLengths))
            let componentProgress: any = _.cloneDeep(componentsType)
            let ProgressType = {
                type: 'ProgressType',
                key: Math.floor(Math.random() * 99999999) + 1
            }
            componentProgress.push(ProgressType)
            dispatch(setComponentsType(componentProgress))
            // 开启进度条组件
            dispatch(setprogressShow(true))

            getOutline(obj).then((res) => {
                console.log(res, '长文获取完毕');
                if (res.data.status.code === 200) {
                    setForbidden(false)
                    let DraftDocument: any = _.cloneDeep(componentsType)
                    let DraftType = {
                        type: 'DraftType',
                        content: res.data,
                        key: Math.floor(Math.random() * 99999999) + 1
                    }
                    DraftDocument.push(DraftType)
                    dispatch(setComponentsType(DraftDocument))
                    let longTextLengths = _.cloneDeep(longTextLength)
                    longTextLengths.forEach((item: any, index: any) => {
                        if (res.data.chatId === item) {
                            longTextLengths.splice(index, 1)
                            dispatch(setlongTextLength(longTextLengths))
                        }
                    })
                }
            }).catch((error) => {
                message.error(error)
            })
        }


    }


    let handleReplace = async () => {
        //  换个大纲
        let loadingComponentsType = JSON.parse(JSON.stringify(componentsType))
        loadingComponentsType.forEach((item: any, index: number) => {
            if (item.type === 'loadingType') {
                loadingComponentsType.splice(index, 1)
            }
        })
        dispatch(setComponentsType(loadingComponentsType))
        setIsModalOpen(true);
    }


    const handleOk = async () => {
        setIsModalOpen(false);

        // 移除outlineType类型的组件
        const filteredComponentsTypes = componentsType.filter((item: any) => item.type !== 'outlineType');
        dispatch(setComponentsType(filteredComponentsTypes));

        // 添加loadingType组件
        const loadingType = [
            ...filteredComponentsTypes,
            {
                type: 'loadingType',
                key: Math.floor(Math.random() * 99999999) + 1
            }
        ];
        dispatch(setComponentsType(loadingType));

        // 显示加载状态
        dispatch(setloadingShow(true));

        try {
            const res = await exchangeOutline({ user_input: outlineValue, messages_id: addOutlineid });

            if (res.data.status.code === 200) {
                dispatch(setloadingShow(false));
                dispatch(setaddOutlineid(res.data.messageId));

                // 添加outlineType组件
                const outlineComponents = [
                    ...loadingType,
                    {
                        type: 'outlineType',
                        content: res.data.article_outline,
                        key: Math.floor(Math.random() * 99999999) + 1
                    }
                ];
                dispatch(setComponentsType(outlineComponents));
            }
        } catch (error) {
            // 处理错误
            dispatch(setloadingShow(false));
            console.error('Error fetching outline:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    let modalTitle = <div> <ExclamationCircleOutlined style={{ color: 'blue', marginRight: '.5rem' }} />重新生成大纲</div>


    return (
        <div className={styles.outline_div} >
            <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
            <div className={styles.outline_title} style={{ background: 'F7F8FA' }}>
                <p className={styles.outline_items}>已为您生成长文大纲，您可以直接修改，或者继续生成长文</p>
                <div style={{ width: '100%', position: 'relative', marginTop: '10px', borderTop: '1px #eee solid' }} ref={outlineRef} className={styles.outline_content} >
                    {/* <Content datas={data} getLongContent={onData}  messageId={titleOutline.messageId}></Content> */}
                    <Content datas={upData} getLongContent={onData} messageId={titleOutline.messageId}></Content>
                </div>
                <div className={styles.outline_forter}>
                    {isAddHistory ? '' : <Button style={{ marginRight: '1vw', fontSize: '1vw', border: '1px solid #4E82F9', }} onClick={handleReplace}>换个大纲</Button>}
                    <Button disabled={forbidden ? true : false} style={{ background: '#1677FF', color: '#fff' }} onClick={getLongContent}>生成长文</Button>
                    <Modal title={modalTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="取消" okText="确定" okType="primary" width={420} closable={false} maskClosable={false} >
                        <p>长文标题、大纲、及大纲下补充的内容将重置，确定重试？</p>
                    </Modal>
                </div>

            </div>
        </div>
    )
}

export default Index



