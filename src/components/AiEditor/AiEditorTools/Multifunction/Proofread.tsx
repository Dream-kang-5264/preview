// import { CloseOutlined, CheckCircleOutlined, ForwardOutlined, CloseCircleOutlined } from '@ant-design/icons'
// import React, { useEffect, useState } from 'react'
// import styles from './index.less'
// import { Row, Col, Button, Spin, Badge, Card, Space, Empty, message } from 'antd'
// import { getProofread } from '@/api/Aitool'

// function Proofread({ AiEditorHtml,AiEditorJson }: any) {
//     let [markdownText, setMarkdownText] = useState<any>([])
//     let [contentShow, setContentShow] = useState(false)
//     useEffect(() => {
//         console.log(AiEditorJson);
//         getProofread({ text: AiEditorHtml }).then((res) => {
//             if (res.data.status.code === 200) {
//                 setContentShow(true)
//                 if (Array.isArray(res.data.text_coent)) {
//                     setMarkdownText(res.data.text_coent);
//                 } else {
//                     setMarkdownText([]);
//                 }
//             }
//         }).catch((error) => {
//             message.error(error)
//         })

//     }, [])

//     return (
//         <div className={styles.proofread}>

//             {
//                 contentShow ?

//                     <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//                         {
//                             markdownText.length > 0 ? markdownText.map((item: any, index: number) => {
//                                 let colors = ''
//                                 switch (item.type) {
//                                     case 1:
//                                         colors = 'pink'
//                                         break;
//                                     case 2:
//                                         colors = 'red'
//                                         break;
//                                     case 3:
//                                         colors = 'cyan'
//                                         break;
//                                     case 4:
//                                         colors = 'purple'
//                                         break;
//                                     case 5:
//                                         colors = 'Warning'
//                                         break;
//                                     case 6:
//                                         colors = 'magenta'
//                                         break;
//                                     case 7:
//                                         colors = 'orange'
//                                         break;
//                                     case 8:
//                                         colors = 'volcano'
//                                         break;
//                                     case 9:
//                                         colors = 'gold'
//                                         break;
//                                     default:
//                                         break;
//                                 }
//                                 return <Badge.Ribbon text={item.error_type} color={colors} key={index}>
//                                     <Card title={<div>{item.error_type}</div>} size="small" >
//                                         <div className={styles.proofread_list_item_error}>
//                                             <div className={styles.proofread_list_item_error_original}>原文</div>
//                                             <div className={styles.proofread_list_item_error_content}>{item.error_text}</div>
//                                         </div>
//                                         <div className={styles.proofread_list_item_suggest}>
//                                             <div className={styles.proofread_list_item_suggest_text}>建议</div>
//                                             <div className={styles.proofread_list_item_suggest_content}>{item.edit}</div>
//                                         </div>
//                                     </Card>
//                                 </Badge.Ribbon>
//                             }) : <Empty description={'暂无错误数据'} />
//                         }


//                     </Space>
//                     : <div className={styles.loading}><Spin size='large' /></div>
//             }


//         </div>
//     )
// }

// export default Proofread




{/* <div dangerouslySetInnerHTML={{ __html: continueData.contentText }} /> */ }
{/* <Row gutter={12}>
                <Col span={6} >
                    <div className={styles.proofread_classify}>
                        <div className={styles.proofread_classify_num}>32</div>
                        <div className={styles.proofread_classify_text}>全部错误</div>
                    </div>
                </Col>
            </Row>
            <div className={styles.proofread_content}>
                <div className={styles.proofread_content_item} >
                    <div className={styles.proofread_content_item_content}>
                        <div>错误项</div>
                        <ForwardOutlined style={{ transform: 'scale(2)', color: '#999' }} />
                        <div>纠正后</div>
                    </div>
                    <div className={styles.proofread_content_item_handle}>
                        <CloseCircleOutlined className={styles.proofread_content_item_handle_close} />
                        <CheckCircleOutlined className={styles.proofread_content_item_handle_check} />
                    </div>
                </div>

            </div>

            <Button type="primary" className={styles.proofread_btn}>替换全部错误</Button> */}



import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Spin, Badge, Card, Space, Empty, message } from 'antd';
import { getProofread } from '@/api/Aitool';

interface ProofreadProps {
    AiEditorHtml: string;
    AiEditorJson: any;
}

function Proofread({ AiEditorHtml, AiEditorJson }: ProofreadProps) {
    const [markdownText, setMarkdownText] = useState<any[]>([]);
    const [contentShow, setContentShow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadingShow, setLoadingShow] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchProofreadData = async (startIndex: number) => {
        if (!AiEditorHtml) {
            setContentShow(true);
            return setMarkdownText([]);
        }
        try {
            if (startIndex < AiEditorJson.content.length) {
                const batch = AiEditorJson.content.slice(startIndex, startIndex + 2);
                let htmlContent = '';
                batch.forEach(item => {
                    htmlContent += item.content[0].text + '\n';
                });
                // console.log(htmlContent);
                const response = await getProofread({ text: htmlContent });
                if (response.data.status.code === 200) {
                    setContentShow(true);
                    if (Array.isArray(response.data.text_coent)) {
                        setMarkdownText(prevText => [...prevText, ...response.data.text_coent]);
                    }
                    setCurrentIndex(startIndex + 2);
                    setLoadingShow(true);
                    fetchProofreadData(startIndex + 2); // 递归调用
                }
            } else {
                setLoadingShow(false);
            }
        } catch (error) {
            // setLoadingShow(false);
            // message.warning('内容存在敏感词');
            fetchProofreadData(startIndex + 2); // 递归调用
        }
    };

    useEffect(() => {
        // console.log(AiEditorJson);
        
        fetchProofreadData(0);
    }, [AiEditorHtml, AiEditorJson]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [loadingShow, markdownText]);

    return (
        <div className={styles.proofread} ref={scrollRef}>
            {contentShow ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {markdownText.length > 0 ? (
                        markdownText.map((item, index) => {
                            let colors = '';
                            switch (item.type) {
                                case 1:
                                    colors = 'pink';
                                    break;
                                case 2:
                                    colors = 'red';
                                    break;
                                case 3:
                                    colors = 'cyan';
                                    break;
                                case 4:
                                    colors = 'purple';
                                    break;
                                case 5:
                                    colors = 'warning';
                                    break;
                                case 6:
                                    colors = 'magenta';
                                    break;
                                case 7:
                                    colors = 'orange';
                                    break;
                                case 8:
                                    colors = 'volcano';
                                    break;
                                case 9:
                                    colors = 'gold';
                                    break;
                                default:
                                    break;
                            }
                            return (
                                <Badge.Ribbon text={item.error_type} color={colors} key={index}>
                                    <Card title={<div>{item.error_type}</div>} size="small">
                                        <div className={styles.proofread_list_item_error}>
                                            <div className={styles.proofread_list_item_error_original}>原文</div>
                                            <div className={styles.proofread_list_item_error_content}>{item.error_text}</div>
                                        </div>
                                        <div className={styles.proofread_list_item_suggest}>
                                            <div className={styles.proofread_list_item_suggest_text}>建议</div>
                                            <div className={styles.proofread_list_item_suggest_content}>{item.edit}</div>
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            );
                        })
                    ) : (
                        <Empty description={'暂无错误数据'} />
                    )}
                    {loadingShow && <div style={{ textAlign: 'center' }}><Spin size="default" /></div>}
                </Space>
            ) : (
                <div className={styles.loading}>
                    <Spin size="large" />
                </div>
            )}
        </div>
    );
}

export default Proofread;