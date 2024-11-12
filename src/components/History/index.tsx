import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons'
import { isToday, isThisWeek, isThisMonth, startOfDay, format } from 'date-fns';
import { Empty, Tooltip, message } from 'antd';
import { DeleteRecord, UpdateNickname, getCreateRecord, getHistory, getRecordDetails } from '@/api/outline';
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';

import _ from 'lodash';
import { setComponentsType, setDecordId, setLongtitle, setattachmentId, setdecodeTitle, setgetLongtext, sethistoryDecordId, sethistoryLongtextId, sethistoryType, setisAddHistory, setlongTextLength, setmessageOutlineId } from '@/redux/module/LongStore';
import { history } from "umi";
import chatAI from '../../../public/2.svg'
import webImg from '../../../public/webp.png'
import rightOpen from '../../../public/add/Frame(3).png'
import { setIndex } from '@/redux/module/homeStore';
import Addtext from '../Addtext/index';

function Index({ setContent, setMenuKey }: any) {

    const [messageApi, contextHolder] = message.useMessage();
    let { longTextLength, historyType, } = useAppSelector(state => state.longReducer)
    let dispatch = useAppDispatch()

    interface ContentsType {
        historyList?: any
    }
    const someDate = new Date().getTime();
    // console.log(isToday(someDate));//判断当天
    // console.log(isThisWeek(someDate));//判断本周
    // console.log(isThisMonth(someDate));//判断本月
    let [userContent, setuserContent] = useState<ContentsType>({
        historyList: []
    })
    // 获取历史会话
    let getUserHistory = () => {
        getHistory().then(res => {
            // console.log(res);
            if (res.data.data.length === 0) {
                dispatch(setlongTextLength([]))

            }
            setuserContent(prev => ({
                ...prev,
                historyList: res.data.data// 假设 res.data.data 是你要更新的数据 .filter((item:any)=>item.name!=='新会话')  
            }));

        }).catch((error) => {
            message.error(error)
        })
    }
    useEffect(() => {
        getUserHistory()

        const interval = setInterval(() => {
            // 这里放置需要执行的自动刷新逻辑
            window.location.reload(); // 这会重新加载整个页面
        }, 5 * 60 * 1000); // 每五分钟触发一次，单位是毫秒

        // 清除定时器以避免内存泄漏
        return () => clearInterval(interval);
    }, [])
    // 会话详情
    function IsOutline(props: any) {
        let { datas, upTime, title, chatId, items } = props
        let [iconShow, setIconShow] = React.useState(false)
        let [titleInput, settitleInput] = useState(true)

        return (

            <div className={styles.user_text} onMouseEnter={() => { setIconShow(true) }} onMouseLeave={() => { setIconShow(false) }} onClick={async () => {
                let serveSend = {
                    conversation_id: chatId
                }
                // console.log(chatId,'会话id')
                // return
                // 获取会话详情
                //   return
                let { data } = await getRecordDetails(serveSend)
                // console.log(JSON.parse(data.data.messageList[1].content))
                console.log(data);

                // return 
                history.push('/Addtext')
                dispatch(setLongtitle(0))
                dispatch(sethistoryDecordId(chatId))
                dispatch(sethistoryLongtextId(chatId))
                let recordDetails: any = _.cloneDeep(historyType)
                dispatch(setdecodeTitle(title))
                data.data.messageList.forEach((item: any) => {
                    let recordType = {
                        type: item.role,
                        content: item,
                        chatId: chatId
                    }
                    recordDetails.push(recordType)
                })
                dispatch(sethistoryType(recordDetails))
                dispatch(setisAddHistory(true))

                let currId: any = longTextLength.findLast((item: any) => item.id === chatId)
                // console.log(longTextLength);

                // console.log(currId, 'currId');
                if (currId?.length === recordDetails.length) {
                    let historyTypes: any = _.cloneDeep(recordDetails);
                    historyTypes.push({
                        type: 'ProgressType',
                        key: Math.floor(Math.random() * 99999999) + 1

                    })
                    dispatch(sethistoryType(historyTypes))


                }
            }}>
                <div className={styles.user_outline}>
                    <div className={styles.userInfo}>
                        <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#fff' }} />
                        {titleInput ? <span style={{ fontSize: '1vw', paddingLeft: '10px' }}>{title}</span> : <input onClick={(event) => { event.stopPropagation() }} onFocus={(event) => { event.stopPropagation() }} style={{ width: '100%', border: '1px solid blue', height: '2rem', borderRadius: '.4rem', outline: 'none', fontSize: '1vw', paddingLeft: '10px', marginLeft: '10px' }} defaultValue={title} onBlur={async (event) => {
                            // setUptitle(event.target.value),
                            // 修改昵称
                            UpdateNickname({ conversation_id: chatId, name: event.target.value }).then((res) => {
                                if (res.data.code === 200) {
                                    messageApi.open({
                                        type: 'success',
                                        content: res.data.msg,
                                    });
                                }
                            }).finally(() => {
                                getUserHistory()
                            }).catch((error) => {
                                message.error(error)
                            })

                            settitleInput(true)
                        }}></input>}
                    </div>
                    {!iconShow ? <span style={{ fontSize: '16px', }}>{upTime}</span> : <span className={styles.file_icon}>
                        <Tooltip className={styles.file_dle} placement="top" title={'修改命名'}>
                            <FormOutlined className={styles.file_seticon} onClick={(event) => {
                                event.stopPropagation()
                                settitleInput(false)
                            }} />
                        </Tooltip>
                        <i></i>
                        <Tooltip className={styles.file_dle} placement="top" title={'删除会话'}>
                            <DeleteOutlined className={styles.file_seticon} onClick={(event) => {
                                event.stopPropagation()
                                let deleteSerce = {
                                    conversation_id: chatId
                                }
                                DeleteRecord(deleteSerce).then((res) => {
                                    if (res.data.code === 200) {
                                        messageApi.open({
                                            type: 'success',
                                            content: '删除成功',
                                        });
                                    }
                                    let longTextLengths = _.cloneDeep(longTextLength)
                                    longTextLengths.forEach((item: any, index: any) => {
                                        if (item === chatId) {
                                            longTextLengths.splice(index, 1);
                                        }
                                    })

                                    dispatch(setlongTextLength(longTextLengths))
                                }).finally(() => {
                                    getUserHistory()
                                }).catch((error) => {
                                    message.error(error)
                                })
                            }} />
                        </Tooltip>
                    </span>}

                </div>
                <div className={styles.outline_style}>
                    {datas?.map((item: any, index: any) => {
                        return <div key={item.attachmentId} className={styles.outline_docx} onClick={(event) => {
                            event.stopPropagation()
                            window.open(`/LongTexts/${item.attachmentId}`, '_blank');
                        }}>

                            <div className={styles.outline_title}>

                                <img width={30} height={35} src={webImg} alt="" style={{}} />
                                <div style={{ display: '1', marginLeft: '1vh' }}>
                                    <span style={{ fontSize: '1vw' }} className={styles.outline_title_text}>{item.title}</span>
                                    <span className={styles.outline_size}>DOCX，60KB</span>
                                </div>
                                {/* <Image src={rightOpen} width={15} height={15} alt=''></Image> */}
                                <RightOutlined />
                            </div>
                        </div>
                    })}
                </div>

            </div>

        )
    }
    // 新增会话
    let handleAdd = async () => {
        let { data } = await getCreateRecord()
        dispatch(setDecordId(data.chatId))
        setContent(<Addtext />)
        dispatch(setLongtitle(0))
        dispatch(setIndex(1))
    }
    return (

        <div className={styles.history_div} style={{ width: '100%', background: '#fff', borderRadius: '1vw', minHeight: 'calc(100vh - 23vh)',maxHeight:'100vh',overflow:'auto' }}>
            {/* 头部 */}
            {/* <div className={styles.history_header}>
                <span className={styles.record}>历史会话</span>
                <span className={styles.add_record} onClick={handleAdd}><PlusOutlined />新增会话</span>
            </div> */}
            {contextHolder}
            <div className={styles.history_content} >
                {
                    isToday(someDate) ? <div>
                        {/* <span style={{ fontSize: '1vw' }} className={styles.time}>今天</span> */}
                        {
                            userContent.historyList.length > 0 ? userContent.historyList?.map((item: any, index: any) => {

                                return <IsOutline key={item.chatId} upTime={item.updated_at} title={item.name} chatId={item.chatId} datas={item.data} items={item}></IsOutline>

                            }) : <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 23vh)', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Empty style={{ transform: 'scale(2)' }} /></div>
                        }
                    </div> : ''
                }


            </div>
        </div>

    )
}

export default Index

// import React, { useEffect, useState } from 'react';
// import styles from './history.module.scss';
// import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import { message } from 'antd';
// import { DeleteRecord, UpdateNickname, getHistory, getRecordDetails } from '@/api/outline';
// import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
// import { useRouter } from 'next/router';
// import { cloneDeep } from 'lodash';
// import {  setdecodeTitle, setgetLongtext, sethistoryDecordId, sethistoryLongtextId, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
// import Image from 'next/image';
// import { format } from 'date-fns';

// function Index() {
//     const [messageApi, contextHolder] = message.useMessage();
//     const { getLongtext, historyType } = useAppSelector(state => state.longReducer);
//     const dispatch = useAppDispatch();
//     const router = useRouter();

//     interface HistoryListItem {
//         chatId: string;
//         name: string;
//         updated_at: string;
//         data: any[];
//     }

//     interface UserContent {
//         historyList: HistoryListItem[];
//     }

//     const [userContent, setUserContent] = useState<UserContent>({
//         historyList: []
//     });

//     useEffect(() => {
//         fetchUserHistory();
//     }, []);

//     const fetchUserHistory = async () => {
//         const response = await getHistory();
//         if (response.data.data.length === 0) {
//             dispatch(setgetLongtext([]));
//         }
//         setUserContent({
//             historyList: response.data.data
//         });
//     };

//     const handleDetailClick = async (chatId:string, title: string) => {
//         const { data } = await getRecordDetails({ conversation_id: chatId });
//         router.push('/Dialogue');
//         dispatch(sethistoryDecordId(chatId));
//         dispatch(sethistoryLongtextId(chatId));
//         dispatch(setdecodeTitle(title));

//         let recordDetails: any = cloneDeep(historyType);
//         data.data.messageList.forEach((item: { role: any; }) => {
//             const recordType: any = { type: item.role, content: item };
//             recordDetails.push(recordType);
//         });

//         dispatch(sethistoryType(recordDetails));

//         // Check if long text exists for the chat
//         const hasLongText = getLongtext.includes(chatId);
//         if (hasLongText) {
//             const progressComponents = cloneDeep(recordDetails);
//             progressComponents.push({
//                 type: 'ProgressType',
//                 key: Math.floor(Math.random() * 99999999) + 1
//             });
//             dispatch(sethistoryType(progressComponents));
//         }

//         dispatch(setisAddHistory(true));
//     };

//     const handleNicknameUpdate = async (chatId: string, newName: string) => {
//         try {
//             const response = await UpdateNickname({ conversation_id: chatId, name: newName });
//             if (response.data.code === 200) {
//                 messageApi.open({
//                     type: 'success',
//                     content: response.data.msg,
//                 });
//             }
//         } finally {
//             fetchUserHistory();
//         }
//     };

//     const handleDeleteConversation = async (chatId: string) => {
//         try {
//             const response = await DeleteRecord({ conversation_id: chatId });
//             if (response.data.code === 200) {
//                 messageApi.open({
//                     type: 'success',
//                     content: '删除成功',
//                 });
//             }
//         } finally {
//             fetchUserHistory();
//         }
//     };

//     const IsOutline = ({ item }: { item: HistoryListItem }) => {
//         const [iconShow, setIconShow] = useState(false);
//         const [titleInput, setTitleInput] = useState(true);

//         const toggleTitleInput = () => {
//             setTitleInput(!titleInput);
//         };

//         const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
//             toggleTitleInput();
//             await handleNicknameUpdate(item.chatId, event.currentTarget.value);
//         };

//         return (
//             <div
//                 className={styles.user_text}
//                 onMouseEnter={() => setIconShow(true)}
//                 onMouseLeave={() => setIconShow(false)}
//                 onClick={() => handleDetailClick(item.chatId, item.name)}
//             >
//                 <div className={styles.user_outline}>
//                     <div className={styles.userInfo}>
//                         <Image
//                             width={53}
//                             height={10}
//                             src="/2.svg"
//                             alt=""
//                             style={{
//                                 borderRadius: '50%',
//                                 width: '2.8rem',
//                                 height: '2.8rem',
//                                 background: '#fff'
//                             }}
//                         />
//                         {titleInput ? (
//                             <span style={{ fontSize: '1vw' }}>{item.name}</span>
//                         ) : (
//                             <input
//                                 onClick={toggleTitleInput}
//                                 onFocus={toggleTitleInput}
//                                 style={{
//                                     width: '100%',
//                                     border: '1px solid blue',
//                                     height: '2rem',
//                                     borderRadius: '.4rem',
//                                     outline: 'none',
//                                     fontSize: '1vw'
//                                 }}
//                                 defaultValue={item.name}
//                                 onBlur={handleBlur}
//                             />
//                         )}
//                     </div>
//                     {!iconShow ? (
//                         <span style={{ fontSize: '1vw' }}>{format(new Date(item.updated_at), 'yyyy-MM-dd HH:mm')}</span>
//                     ) : (
//                         <span className={styles.file_icon}>
//                             <EditOutlined
//                                 onClick={(event) => {
//                                     event.stopPropagation();
//                                     toggleTitleInput();
//                                 }}
//                             />
//                             <DeleteOutlined
//                                 style={{ color: 'red' }}
//                                 onClick={(event) => {
//                                     event.stopPropagation();
//                                     handleDeleteConversation(item.chatId);
//                                 }}
//                             />
//                         </span>
//                     )}
//                 </div>
//                 <div className={styles.outline_style}>
//                     {item.data?.map((doc) => (
//                         <div
//                             key={doc.attachmentId}
//                             className={styles.outline_docx}
//                             onClick={(event) => {
//                                 event.stopPropagation();
//                                 window.open(`/LongTexts/${doc.attachmentId}`, '_blank');
//                             }}
//                         >
//                             <div>
//                                 <div className={styles.outline_title}>
//                                     <Image
//                                         width={53}
//                                         height={10}
//                                         src="/webp.png"
//                                         alt=""
//                                         style={{
//                                             borderRadius: '50%',
//                                             width: '2.5vw',
//                                             height: '2vw',
//                                             background: '#fff'
//                                         }}
//                                     />
//                                     <span style={{ fontSize: '1vw' }} className={styles.outline_title_text}>
//                                         {doc.title}
//                                     </span>
//                                 </div>
//                                 <span className={styles.outline_size}>DOCX，60KB</span>
//                             </div>
//                             <EditOutlined style={{ fontSize: '1vw' }} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className={styles.history_div}>
//             <div className={styles.history_header}>
//                 <span className={styles.record}>历史会话</span>
//                 <span className={styles.add_record}><PlusOutlined />新增会话</span>
//             </div>
//             {contextHolder}
//             <div className={styles.history_content}>
//                 {userContent.historyList.map((item) => (
//                     <IsOutline key={item.chatId} item={item} />
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Index;