import React, { useEffect, useState } from 'react'
import styles from './index.less'

import webp from '../../../../public/webp.png'
import { setToolTitle } from '@/redux/module/firstDraftStore'
import { useAppDispatch } from '@/redux/storeIndex'
import { Button, Col, Modal, Row, message } from 'antd'
import { getTempletChildren, getTempletData } from '@/api/Templet'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
function TemplateTool({ isSceneChildren, isScenetitle, isTemplateEdit, setAiEditorData }: any) {
    let [templateData, setTemplateData] = useState<any>({ classColor: 0 })
    let dispatch = useAppDispatch()
    let [contextHtml, setContextHtml] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    useEffect(() => {
        getTempletData().then((res) => {
            if (res.data.status.code === 200) {
                // console.log(res);
                isScenetitle(res.data.data[0]);
                setTemplateData((prve: any) => ({
                    ...prve,
                    classify: res.data.data,
                }))
                getTempletChildren({ category_id: res.data.data[0].category_id }).then((res) => {
                    // console.log(res);
                    if (res.data.status.code === 200) {
                        setTemplateData((prve: any) => ({
                            ...prve,
                            classChildren: res.data.records,
                        }))
                    }
                }).catch((error) => {
                    message.error(error)
                })
            }

        }).catch((error) => {
            message.error(error)
        })

    }, [])
    // 分类的切换
    let handleItemtap = (item: any, index: any) => {
        isScenetitle(item)
        getTempletChildren({ category_id: item.category_id }).then((res) => {
            if (res.data.status.code === 200) {
                // console.log(res,'res');

                setTemplateData((prve: any) => ({
                    ...prve,
                    classChildren: res.data.records,
                }))

            }
        }).catch((error) => {
            message.error(error)
        })
        setTemplateData((prve: any) => ({
            ...prve,
            classColor: index,
        }))
    }
    useEffect(() => {
        // console.log(templateData);

    }, [])
    // 获取全部
    let handleAll = () => {
        setTemplateData((prve: any) => ({
            ...prve,
            classColor: -1,
        }))
    }
    // 点击使用模版
    let handleApply = (item: any) => {
        isSceneChildren(item)
        setAiEditorData((prve: any) => ({
            ...prve,
            currIndex: 2
        }))
    }
    // 点击编辑
    let handleEdit = (item: any) => {
        isTemplateEdit(item)
    }
    //   点击查看
    const handleLook = (item: any) => {
        // console.log(item.content_html);
        setIsModalOpen(true);
        setContextHtml(item.content_html)
        // setContextTitle(item.title)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className={styles.template_body}>
            {/* 分类 */}
            <Row className={styles.template_classify} gutter={2}>
                {/* <span className={templateData.classColor === -1 ? styles.template_classify_item_active : styles.template_classify_item} onClick={handleAll}>全部</span> */}
                {
                    templateData.classify?.map((item: any, index: number) => {
                        return <Col span={6} key={index} className={templateData.classColor === index ? styles.template_classify_item_active : styles.template_classify_item} onClick={() => { handleItemtap(item, index) }}>{item.name}</Col>
                    })
                }
            </Row>
            {/* 内容 */}
            <Row gutter={12} className={styles.template_contents}>
                {
                    templateData.classChildren?.map((item: any, index: number) => {
                        return <Col span={8} key={index}>
                            <div className={styles.template_content_items} >
                                <div className={styles.template_content_items_title}>{item.title}</div>
                                <img src='http://180.76.176.120/static/img/onlineWrite.72803902.png' alt='' style={{ width: '50px' }} />

                                <div className={styles.template_content_items_icon}>
                                    <EyeOutlined
                                        style={{ transform: 'scale(1)', }}
                                        onClick={() => { handleLook(item) }}
                                    />
                                    <EditOutlined
                                        style={{ transform: 'scale(1)', }}
                                        onClick={() => { handleEdit(item) }}
                                    />



                                </div>
                                <div>

                                    {
                                        item.applicable_types !== 4 ? <Button size="small" style={{ background: '#3370FF', color: '#fff', borderRadius: '1vh', padding: '.5vh 1vh' }} onClick={() => handleApply(item)}>使用模版</Button> : <Button size="small" style={{ opacity: '0', pointerEvents: 'none' }}></Button>
                                    }
                                </div>
                            </div>
                        </Col>
                    })
                }


            </Row>
            {/* <div className={styles.template_content}>
                {
                    templateData.classChildren?.map((item: any, index: number) => {
                        return <div key={index} className={styles.template_content_item}>
                            <img className={styles.template_content_item_img} src={webp} width={30} height={30} alt=''></img>
                            <div className={styles.template_content_item_text}>
                                <div className={styles.template_content_item_title}>{item.title}</div>
                                <div className={styles.template_content_item_plain}>{item.content_plain}</div>
                            </div>
                            <div className={styles.template_content_item_btn}>
                                <Button size="small" style={{ borderRadius: '1vh' }} onClick={() => { handleLook(item) }}>预览</Button>
                                <Button size="small" style={{ borderRadius: '1vh' }} onClick={() => { handleEdit(item) }}>编辑</Button>

                                {
                                    item.applicable_types !== 4 ? <Button size="small" style={{ background: '#3370FF', color: '#fff', borderRadius: '1vh', padding: '.5vh 1vh' }} onClick={() => handleApply(item)}>使用模版</Button> : ''
                                }


                            </div>
                        </div>


                    })
                }</div> */}
            <Modal open={isModalOpen} width={'80%'} footer={false} loading={loading} onOk={handleOk} okText={'应用'} cancelText={'收藏'} onCancel={handleCancel} style={{ padding: '1vw', overflow: 'hidden' }}>
                {
                    <div style={{ padding: '1vw', border: '1px solid #ccc', borderRadius: '1vw', marginTop: '1vw', overflow: 'auto', height: '80vh', userSelect: 'none', }} dangerouslySetInnerHTML={{ __html: contextHtml }} />
                }
            </Modal>
        </div>
    )
}

export default TemplateTool



