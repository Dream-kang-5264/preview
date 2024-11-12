import { Row, Col, Card } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import Proofread from './Multifunction/Proofread'
import Expand from './Multifunction/Expand'
import { FileDoneOutlined, FileWordOutlined, FileSyncOutlined, SnippetsOutlined, TableOutlined, ExclamationCircleOutlined, CloseOutlined, ContainerOutlined, FormOutlined, CloseCircleOutlined } from '@ant-design/icons'
import Tables from './Multifunction/Tables'
import SensitiveWords from './Multifunction/SensitiveWords'
import Continue from './Multifunction/Continue'
import ExtractAndCompile from './Multifunction/ExtractAndCompile'
import Suggestion from './Multifunction/Suggestion'
function Multifunction({ insertionAiEditor, AiEditorHtml, continueInsertion, continueDisplace, isEventStream, AiEditorClear, AiEditorJson }: any) {
    let [menuLook, setMenuLook] = useState(true)
    let [newMenuItem, setNewMenuItem] = useState<any>(null)
    let [toolData, setToolData] = useState({ title: '' })
    // console.log(AiEditorHtml);

    let menuList = [
        {
            title: '文本纠错',
            icon: <FileDoneOutlined />,
            desc: '语句不通顺错别字检索'
        },
        // {
        //     title: '全文扩写',
        //     icon: <FileWordOutlined />,
        //     desc: '文章内容快速扩充'
        // },
        // {
        //     title: '全文改写',
        //     icon: <FileSyncOutlined />,
        //     desc: '文章内容一键改写'
        // },
        {
            title: '全文续写',
            icon: <SnippetsOutlined />,
            desc: '根据原文续写文章内容'
        },
        {
            title: '生成表格',
            icon: <TableOutlined />,
            desc: '根据文章内容生成表格'
        },
        {
            title: '敏感词汇',
            icon: <ExclamationCircleOutlined />,
            desc: '文章内容敏感词汇检测'
        },
        {
            title: '摘要总结',
            icon: <ContainerOutlined />,
            desc: '简要介绍文章的核心主题或主旨'
        },
        {
            title: '修改建议',
            icon: <FormOutlined />,
            desc: '根据文章内容提供修改建议'
        },
    ]
    let handleClick = (item: any, index: number) => {
        setMenuLook(false)
        setToolData((prev: any) => ({
            ...prev,
            title: item.title
        }))
        switch (item.title) {
            case '文本纠错':
                setNewMenuItem(<Proofread AiEditorHtml={AiEditorHtml} AiEditorJson={AiEditorJson} />)
                break;
            case '全文扩写':
                setNewMenuItem(<Expand />)
                break;
            case '生成表格':
                setNewMenuItem(<Tables insertionAiEditor={insertionAiEditor} />)
                break;
            case '敏感词汇':
                setNewMenuItem(<SensitiveWords AiEditorHtml={AiEditorHtml} AiEditorJson={AiEditorJson} />)
                break;
            case '全文续写':
                setNewMenuItem(<Continue AiEditorHtml={AiEditorHtml} continueDisplace={continueDisplace} continueInsertion={continueInsertion} />)
                break;
            case '摘要总结':
                setNewMenuItem(<ExtractAndCompile AiEditorHtml={AiEditorHtml} />)
                break;
            case '修改建议':
                setNewMenuItem(<Suggestion AiEditorHtml={AiEditorHtml} isEventStream={isEventStream} AiEditorClear={AiEditorClear} />)
                break;
            default:
                break;
        }
    }
    return (
        <>

            {

                menuLook ?
                    <Row gutter={24} className={styles.multifunction
                    } >
                        {
                            menuList?.map((item: any, index: number) => {
                                return <Col span={12} key={item.title}>
                                    <div className={styles.multifunction_item} onClick={() => { handleClick(item, index) }}>
                                        <div className={styles.multifunction_item_icon}>{item.icon}</div>
                                        <div className={styles.multifunction_item_title}>{item.title}</div>
                                        <div className={styles.multifunction_item_desc}>{item.desc}</div>
                                    </div>
                                </Col>
                            })
                        }

                    </Row > : <div className={styles.multifunction_content}>
                        <div className={styles.multifunction_content_title}>
                            <div className={styles.multifunction_content_header_title}>{toolData.title}</div>

                            <div className={styles.multifunction_header_right}>
                                <div>
                                    {/* <CheckCircleOutlined />重新校对 */}
                                </div>
                                <CloseOutlined style={{ transform: ' scale(1.2)' }} onClick={() => {
                                    setMenuLook(true)
                                }} />
                            </div>

                        </div>
                        {newMenuItem}
                    </div>
            }
        </>


    )
}

export default Multifunction
