import { DownloadOutlined, EditOutlined, HeartTwoTone, SaveOutlined, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { baseUrl } from '@/utils/process'
import { Alert, Card, Layout, Row, Typography, Col, Button, Tree, message, Modal } from 'antd';
import React, { useState, useEffect, ReactElement, useRef } from 'react';
import { useParams } from 'umi';
import userImg from '../../../public/user.png'
import AiEditor from '@/components/AiEditor'
import { Header } from 'antd/es/layout/layout';
import Home from '../../../public/longText/首页.svg'
import styles from './LongText.less'
import { getAnnexDetails } from '@/api/outline';
import AiEditorMenu from '@/components/AiEditor/AiEditorMenu'
import AiEditorTools from '@/components/AiEditor/AiEditorTools/AiEditorTools';
import { store, persistor } from "@/redux";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import { userSaveLongtext } from '@/api/written';
import { history } from 'umi'
import { userSaveTitle } from '@/api/Templet';
import { saveAs } from "file-saver";
import htmlToDocx from "html-to-docx";

const LongTexts: React.FC = ({ }: any) => {
    let [saveTime, setSaveTime] = useState()
    const { id } = useParams<{ id: string }>();
    let [textTitle, setTextTitle] = useState('')
    let [aiEditors, setAiEditors] = useState<any>()
    let [AiEditorData, setAiEditorData] = useState<any>({
        AiEditorCol: 22, toolCol: 0, toolShow: false, currIndex: 0,
        currTitle: '', outlineTop: '15%', timeCol: 8, BtnCol: 4, outlineHeight: '', editorLoadingShow: false,
    });//23、17
    const aiEditorRef = useRef<any>();
    let titleRef = useRef<any>();
    const [outlineData, setOutlineData] = useState<any>();
    let [editTitle, setEditTitle] = useState(false)
    let [initTreeData, setInitTreeData] = useState<any>()
    let [templetTitle, setTempletTitle] = useState()
    let [templetChildren, setTempletChildren] = useState()
    // 全文的数据
    let [AiEditorHtml, setAiEditorHtml] = useState()
    let [AiEditorJson, setAiEditorJson] = useState()
    let [AiEditorText, setAiEditorText] = useState()


    // let { homeToolShow } = useAppSelector(state => state.firstDraftReducer)
    // let dispatch = useAppDispatch()
    // useEffect(() => {
    //     if (history.location.pathname !== '/Addtext') {
    //         dispatch(setComponentsType([]))
    //         dispatch(sethistoryType([]))
    //     }
    //     dispatch(setisAddHistory(false))
    // }, [history])
    // console.log();

    let sendAiEditor = (aiEditor: any) => {
        // aiEditor.focusStart()
        setAiEditors(aiEditor)
        const data = aiEditor.getOutline();
        setOutlineData(data);

    }
    useEffect(() => {

        document.title = "智笔写作系统";
        if (id) {
            getAnnexDetails({ attachment_id: id }).then((res) => {
                if (res.data.code === -1) {
                    if (localStorage.getItem('templetsEdit') && localStorage.getItem('tool')==='1') {
                    
                        setAiEditorData((prve: any) => ({
                            ...prve,
                            AiEditorCol: 22,
                            toolCol: 0,
                            outlineTop: '15%',
                            timeCol: 8,
                            BtnCol: 4,
                            toolShow: false,

                        }))
                        let arr = JSON.parse(localStorage.getItem('templetsEdit') || '')
                        setTextTitle(arr.title)
                    }

                    else if (localStorage.getItem('templetTitle') && localStorage.getItem('templetChildren')) {
                        setAiEditorData((prev: any) => ({
                            ...prev,
                            toolShow: true,
                            toolCol: 6,
                            AiEditorCol: 16,
                            currIndex: 2,
                            timeCol: 6,
                            BtnCol: 6
                        }))
                        setTempletTitle(JSON.parse(localStorage.getItem('templetTitle') || ''))
                        setTempletChildren(JSON.parse(localStorage.getItem('templetChildren') || ''))
                    }
                    else {
                        setTextTitle('新建文档')
                    }
                }
                else {
                    setTextTitle(res.data.data[0].title.slice(0, 15).replace(/\.[^/.]+$/, ''))
                }
                // console.log(res.data.data[0].title.slice(0, 15));

            }).catch((error) => {
                message.error(error)
            })

        }




    }, [])
    useEffect(() => {
        if (aiEditorRef.current) {
            const data = aiEditorRef.current?.sendData();
            // let jsonData = aiEditorRef.current?.getJson()
            setAiEditorJson(aiEditorRef.current.senJsondData())
            setAiEditorText(aiEditorRef.current.sendText())
            setAiEditorHtml(data);
        }
        // console.log(AiEditorText);

    }, [sendAiEditor])
    useEffect(() => {
        if (AiEditorData.toolShow) {
            setAiEditorData((prve: any) => ({
                ...prve,
                outlineHeight: '78vh'
            }))
        }
        else {
            setAiEditorData((prve: any) => ({
                ...prve,
                outlineHeight: '83vh'
            }))
        }

    }, [AiEditorData.toolShow])
    // 处理数据      左侧大纲
    function createTree(data: any) {
        const result: Array<any> = [];
        const stack: Array<any> = [];
        // console.log(data);
        data?.forEach((item: any) => {
            // 如果栈为空或当前项的层级高于栈顶元素的层级
            while (stack.length > 0 && item.level <= stack[stack.length - 1].level) {
                stack.pop();
            }

            if (stack.length === 0) {
                // 如果栈为空，说明当前项是一级节点
                item.children = [];
                result.push(item);
            } else {
                // 否则，当前项是上一个节点的子节点
                const parent = stack[stack.length - 1];
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(item);
            }

            // 将当前节点压入栈中
            stack.push(item);
        });

        return result;
    }
    useEffect(() => {
        const initTreeData = createTree(outlineData).map((item: any, index: number) => {
            return {
                title: <a style={{ color: '#000' }} href={`#${item.id}`}>{item.text}</a>,
                key: item.id,
                isLeaf: item.children ? false : true,
                children: item.children?.map((items: any, indexs: number) => {
                    function indexToChinese(curr: any) {
                        const chineseDigits = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
                        return chineseDigits[curr];
                    }
                    return {
                        title: <a style={{ color: '#000' }} href={`#${items.id}`}>{items.text}</a>,
                        key: items.id,
                        isLeaf: items.children ? false : true,
                        children: items.children?.map((itemss: any, indexss: number) => {
                            return {
                                // {indexs + 1}.{indexss + 1}：
                                title: <a href={`#${itemss.id}`} >{itemss.text}</a>,
                                key: itemss.id,
                                isLeaf: itemss.children ? false : true,
                            }
                        })
                    }
                })
            }
        })
        setInitTreeData(initTreeData)
    }, [aiEditors, setAiEditors, outlineData])

    // 保存
    let handleSave = () => {
        if (!textTitle) {
            setTextTitle('新建文档')
        }
        userSaveLongtext({ attachment_id: id, article: aiEditors.getHtml(), topic: textTitle ? textTitle : '新建文档' }).then((res) => {
            if (res.data.status.code === 200) {
                setSaveTime(res.data.updated_at)
                message.success('已保存首页文件中，可返回查看')
            }
        }).catch((err) => {

        })
    }
    useEffect(() => {
        titleRef.current?.focus();
    }, [editTitle]);
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Row className={styles.longTexts} gutter={8}>
                    <Col span={AiEditorData.AiEditorCol} >
                        <Header className={styles.header}  >
                            <Row style={{ width: '100%' }}>
                                <Col span={12} className={styles.header_title}>

                                    <img src={Home} alt='' width={20} height={25} style={{ cursor: 'pointer' }} onClick={() => {
                                        history.push('/')
                                    }}></img>

                                    <div className={styles.hrader_editTitle}>
                                        {
                                            editTitle ? <input ref={titleRef} onBlur={() => {
                                                userSaveTitle({ title: textTitle, attachment_id: id }).then((res) => {
                                                    message.success('修改标题成功')
                                                    setEditTitle(false)
                                                }).catch((error) => {
                                                    message.error(error)
                                                })
                                            }} className={styles.header_input} type="text" value={textTitle} onChange={(e) => setTextTitle(e.target.value)} /> : <div className={styles.editTitle}>{textTitle}</div>
                                        }
                                        <EditOutlined onClick={() => {
                                            setEditTitle(!editTitle)

                                        }}></EditOutlined>
                                    </div>
                                    <div style={{ flex: 1 }}></div>

                                </Col>
                                <Col span={AiEditorData.timeCol} className={styles.header_right_time}>


                                    {saveTime ? <div style={{ color: '#CACCCE', fontSize: '2vh', }}>{saveTime}已保存</div> : <div style={{ color: '#CACCCE', fontSize: '2vh', }}></div>}

                                </Col>
                                <Col span={AiEditorData.BtnCol} className={styles.header_right}>

                                    <div className={styles.header_right_btn}>
                                        <Button
                                            size="middle"
                                            type="primary"
                                            // style={{ background: '#1890FF' }}
                                            onClick={async () => {
                                                if (!AiEditorHtml) {
                                                    message.warning('内容为空')
                                                }
                                                try {
                                                    const docxBlob = await htmlToDocx(AiEditorHtml, null, {
                                                        table: { row: { cantSplit: true } },  // 可选配置：处理表格
                                                    });
                                                    saveAs(docxBlob, `${textTitle}.docx`);  // 生成并下载 Word 文件
                                                } catch (error) {
                                                    console.error("导出失败:", error);
                                                }
                                                return

                                                fetch(`${baseUrl}/api/v1/admin/user/generate_word_document`, {
                                                    method: 'POST',
                                                    // headers:{'Token':localStorage.getItem('token')},
                                                    body: JSON.stringify({ attachment_id: id })
                                                })
                                                    .then((response: any) => {
                                                        if (!response.ok) {
                                                            // console.log(response);

                                                            return message.success('请先保存需要下载的内容')

                                                            // throw new Error('Network response was not ok');
                                                        }
                                                        return response.blob(); // 将响应转换成 Blob 对象
                                                    })
                                                    .then(blob => {
                                                        // 处理 Blob 对象，例如创建 URL 并下载文件
                                                        const url = window.URL.createObjectURL(blob);
                                                        console.log(blob, url);
                                                        const a = document.createElement('a');
                                                        a.style.display = 'none';
                                                        a.href = url;
                                                        a.download = `${textTitle}.docx`;
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        document.body.removeChild(a);
                                                        window.URL.revokeObjectURL(url); // 释放 URL 对象
                                                    })
                                                    .catch(error => {
                                                        console.error('There has been a problem with your fetch operation:', error);
                                                    });
                                            }}><DownloadOutlined />下载</Button>

                                        <Button
                                            size="middle"
                                            // style={{ background: '#1890FF' }}
                                            onClick={handleSave} type="primary"><SaveOutlined style={{ marginRight: '5px' }} />
                                            保存
                                        </Button>
                                        <img src={userImg} alt="" style={{ borderRadius: '50%', width: '2.2vw', height: '2.2vw', background: '#fff', cursor: 'pointer' }} onClick={() => {
                                            Modal.confirm({
                                                title: '确认退出',
                                                content: '确定要退出登录吗？',
                                                onOk() {
                                                    localStorage.removeItem('token'); // 清除用户信息
                                                    history.push('/login'); // 跳转到登录页面
                                                },
                                            });
                                        }} />
                                    </div>


                                </Col>
                            </Row>

                            {/* <div className={styles.header_content}></div> */}

                        </Header>
                        <AiEditor
                            ref={aiEditorRef}
                            AiEditorData={AiEditorData}
                            sendAiEditor={sendAiEditor}
                            setAiEditorData={setAiEditorData}
                        >
                        </AiEditor>
                        <div className={styles.outlineLeft_body} style={{ top: AiEditorData.outlineTop, height: AiEditorData.outlineHeight }}>
                            <div style={{ padding: '1vh', fontSize: '1.3vw', fontWeight: '300' }}>目录</div>
                            <div className={styles.outlineLeft_content}>
                                <Tree key={Math.floor(Math.random() * 99999999) + 1} defaultExpandAll={true} autoExpandParent={true} treeData={initTreeData} />
                            </div>

                        </div>

                    </Col>
                    <Col span={AiEditorData.toolCol}>
                        <AiEditorTools AiEditorData={AiEditorData}
                            AiEditorHtml={AiEditorHtml}
                            AiEditorJson={AiEditorJson}
                            AiEditorText={AiEditorText}
                            templetTitle={templetTitle}
                            templetChildren={templetChildren}
                            setAiEditorData={setAiEditorData}
                            // 素材插入编辑器
                            onInserContent={(val: string) => {
                                // 替换插入内容
                                aiEditorRef.current?.insertContent(val)
                            }}
                            replaceContent={(val: string) => {
                                // 替换所有
                                aiEditorRef.current?.replaceContent(val)
                            }}
                            onInsertion={(val: any) => {
                                // 替换插入内容
                                // if (val.sendServer) setTextTitle(val.sendServer.user_information[0].value)
                                // console.log(val,'val');

                                aiEditorRef.current?.handleWrittenInsertion(val)
                            }}
                            // 模版的编辑
                            isTemplateEdit={(item: any) => {
                                setTextTitle(item.title)
                                // setValue(item.content_html)
                                aiEditorRef.current?.replaceContent(item.content_html)
                            }}
                            // 金句主题
                            isThemeData={(item: any) => {
                                // console.log(item);
                                aiEditorRef.current?.handleInsertion(item)

                            }}
                            // Echarts传递的Base64
                            isBase64Image={(item: any) => {
                                let arr = `<img   src="${item}"/>`
                                // console.log(item);
                                aiEditorRef.current?.handleInsertion(arr)

                            }}
                            // 流程图传递的Base64
                            isMermaidBase64={(item: any) => {
                                let arr = `<img   src="${item}"/>`
                                // console.log(item);
                                aiEditorRef.current?.handleInsertion(arr)

                            }}
                            // 表格插入编辑器
                            insertionAiEditor={(val: any) => {
                                // console.log(val);
                                aiEditorRef.current?.handleInsertion(val)
                            }}
                            // 全文续写替换全部
                            continueDisplace={(val: any) => {
                                // console.log(val);
                                aiEditorRef.current?.replaceContent(val)
                            }}
                            // 全文续写插入编辑器
                            continueInsertion={(val: any) => {
                                // console.log(val);
                                aiEditorRef.current?.handleInsertion(val)
                            }}
                            AiEditorClear={(val: any) => {
                                // console.log(val);

                                if (val) {
                                    aiEditorRef.current?.handleClear()
                                }
                            }}
                            // 根据建议修改文章流式输出到编辑器
                            isEventStream={(val: any) => {
                                // console.log(val);
                                aiEditorRef.current?.handleisEventStream(val)
                            }}
                            // 会话插入编辑器
                            messageInsertEditor={(val: any) => {
                                // console.log(val);
                                aiEditorRef.current?.handleMessageInsertion(val)
                            }}
                            // 普通成文的Markdown 格式
                            onIsMarkdown={(val: any) => {
                                // console.log(val);
                                aiEditorRef.current?.handleisMarkdown(val)
                            }}
                        ></AiEditorTools>


                    </Col>
                    <Col span={2} className={styles.right_menu}>

                        <AiEditorMenu setAiEditorData={setAiEditorData}></AiEditorMenu>

                    </Col>
                </Row>
            </PersistGate>
        </Provider >

    );
};

export default LongTexts




// import React, { useRef } from "react";
// import { saveAs } from "file-saver";
// import htmlToDocx from "html-to-docx";

// const ExportToWord = () => {
//     const contentRef = useRef();

//     const handleExportToWord = async () => {
//         const element = contentRef.current;
//         try {
//             const docxBlob = await htmlToDocx(element, null, {
//                 table: { row: { cantSplit: true } },  // 可选配置：处理表格
//             });
//             saveAs(docxBlob, "dynamic-content.docx");  // 生成并下载 Word 文件
//         } catch (error) {
//             console.error("导出失败:", error);
//         }
//     };

//     return (
//         <div>
//             {/* 使用 dangerouslySetInnerHTML 渲染动态 HTML */}
//             <div ref={contentRef} dangerouslySetInnerHTML={{ __html: dynamicData }}></div>

//             {/* 点击按钮触发导出 */}
//             <button onClick={handleExportToWord}>导出为 Word</button>
//         </div>
//     );
// };

// export default ExportToWord;


