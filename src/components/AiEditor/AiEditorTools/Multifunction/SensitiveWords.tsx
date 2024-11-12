import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'
import TextArea from 'antd/es/input/TextArea'
import { Badge, Button, Card, Empty, Space, Spin, message } from 'antd'
import { useAppSelector } from '@/redux/storeIndex'
import { getSensitiveWords, } from '@/api/Aitool'
function SensitiveWords({ AiEditorHtml, AiEditorJson }: any) {
    let [tableData, setTableData] = useState({ textContent: '', TableShow: false, loadingShow: false, lookList: [], createBut: true, insertionBtn: true, SensitiveBtn: false })
    let { SelectData } = useAppSelector(state => state.firstDraftReducer)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [markdownText, setMarkdownText] = useState<any[]>([]);
    const [loadingShow, setLoadingShow] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    // console.log(AiEditorHtml);
    const fetchProofreadData = async (startIndex: number) => {
        if (!AiEditorHtml) {
            message.warning('检测内容不能为空')
            return setTableData((prve: any) => ({
                ...prve,
                lookList: []
            }))
        }
        try {
            if (startIndex < AiEditorJson.content.length) {
                const batch = AiEditorJson.content.slice(startIndex, startIndex + 2);
                let htmlContent = '';
                batch.forEach(item => {
                    htmlContent += item.content[0].text + '\n';
                });
                // console.log(htmlContent);
                const response = await getSensitiveWords({ text: htmlContent });
                if (response.data.status.code === 200) {
                    // setContentShow(true);
                    // console.log(response);
                    if (response.data.text_coent[0].edit !== '无敏感内容') {
                        if (Array.isArray(response.data.text_coent)) {

                            setMarkdownText(prevText => [...prevText, ...response.data.text_coent]);


                        }
                    }


                    setTableData((prevState: any) => ({
                        ...prevState, // 使用正确的变量名
                        loadingShow: true,
                        // lookList: [...prevState.lookList, ...response.data.text_content], // 假设 response.data.text_content 是正确的字段
                        // insertionBtn: false,
                    }));
                    setCurrentIndex(startIndex + 2);
                    setLoadingShow(true);
                    fetchProofreadData(startIndex + 2); // 递归调用
                }
            } else {
                setLoadingShow(false);
                setTableData((prevState: any) => ({
                    ...prevState, // 使用正确的变量名
                    loadingShow: true,
                    // lookList: [...prevState.lookList, ...response.data.text_content], // 假设 response.data.text_content 是正确的字段
                    insertionBtn: false,
                    SensitiveBtn: false
                }));
            }
        } catch (error) {
            // setLoadingShow(false);
            // message.warning('检测内容存在敏感词');
            fetchProofreadData(startIndex + 2); // 递归调用
        }
    };
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [loadingShow, markdownText]);
    return (
        <div className={styles.tables} ref={scrollRef}>
            {/* <div dangerouslySetInnerHTML={{ __html: arr }} /> */}
            <div className={styles.tables_content}>
                <div className={styles.tables_content_title}>
                    <div style={{ fontWeight: '400', marginBottom: '5px' }}>选中文字:</div>
                    <TextArea rows={5}
                        style={{ height: '120px' }}
                        onChange={(e) => {

                            setTableData((prve: any) => ({
                                ...prve,
                                textContent: e.target.value,
                                TableShow: false
                            }))
                        }} placeholder='请输入' value={tableData.textContent} />
                    <div className={styles.tables_content_title_but}>
                        <Button
                            size='small'
                            type="primary"
                            onClick={() => {
                                setTableData((prve: any) => ({
                                    ...prve,
                                    textContent: SelectData,
                                    createBut: false,
                                    TableShow: false,
                                    loadingShow: false,
                                }))

                            }}
                        >获取选中的文本</Button>
                    </div>

                </div>

                <Button style={{ width: '100%', marginTop: '10px' }}
                    disabled={tableData.createBut}
                    type='primary'
                    onClick={() => {
                        setTableData((prve: any) => ({
                            ...prve,
                            TableShow: true
                        }))
                        getSensitiveWords({ text: tableData.textContent }).then((res) => {

                            setTableData((prve: any) => ({
                                ...prve,
                                loadingShow: true,
                                lookList: res.data.text_coent,
                                insertionBtn: false
                            }))
                        }).catch((error) => {
                            message.error(error)
                        })
                    }}
                >检测敏感词</Button>
                <Button style={{ width: '100%', marginTop: '10px' }}
                    disabled={tableData.SensitiveBtn}
                    type='primary'
                    onClick={() => {

                        setTableData((prve: any) => ({
                            ...prve,
                            TableShow: true,
                            SensitiveBtn: true,
                            loadingShow: false,
                        }))
                        fetchProofreadData(0)
                        // getSensitiveWords({ text: AiEditorHtml }).then((res) => {
                        //     setTableData((prve: any) => ({
                        //         ...prve,
                        //         loadingShow: true,
                        //         lookList: res.data.text_coent,
                        //         insertionBtn: false,
                        //         SensitiveBtn: false
                        //     }))
                        // }).catch((error) => {
                        //     message.error(error)
                        // })
                    }}
                >检测全文</Button>
                <div className={styles.tables_content_chart}>

                    {
                        tableData.TableShow ? <>
                            {
                                tableData.loadingShow ? <div className={styles.SensitiveWords_content_chart_show}>
                                    {
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            {
                                                markdownText.length > 0 ? markdownText.map((item: any, index: number) => {
                                                    let colors = ''

                                                    switch (item.type) {
                                                        case 1:
                                                            colors = 'pink'
                                                            break;
                                                        case 2:
                                                            colors = 'red'
                                                            break;
                                                        case 3:
                                                            colors = 'cyan'
                                                            break;
                                                        case 4:
                                                            colors = 'purple'
                                                            break;
                                                        case 5:
                                                            colors = 'volcano'
                                                            break;
                                                        case 6:
                                                            colors = 'magenta'
                                                            break;
                                                        case 7:
                                                            colors = 'orange'
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    return <Badge.Ribbon text={<div >{item.error_type}</div>} color={colors} key={index}>
                                                        <Card title={<div>{item.error_type}</div>} size="small" >
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
                                                }) : <Empty description={'暂无错误数据'} />
                                            }
                                            {loadingShow && <div style={{ textAlign: 'center' }}><Spin size="large" /></div>}

                                        </Space>
                                    }
                                </div> : <div className={styles.tables_content_chart_loading} >   <Spin /></div>
                            }
                        </> : ''
                    }
                </div>
            </div>
            <div className={styles.tables_content_but}>
                {/* <Button style={{ width: '100%', marginTop: '10px' }}
                    disabled={tableData.insertionBtn}
                    type='primary'
                    onClick={() => {
                    insertionAiEditor(tableData.lookTable)
                    }}
                >插入编辑器</Button> */}
            </div>
        </div>
    )
}

export default SensitiveWords
