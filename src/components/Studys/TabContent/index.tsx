
import { getCategoryData, getClassChildren } from '@/api/Study';
import React, { useEffect, useState } from 'react'
import styles from '../studys.module.scss';
import { Modal, message } from 'antd';
function index({ data, setSearchId, setCategoryData, categoryShow, setCategoryShow, categoryData, contextData, setContextData, classData, setClassData }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let [classDataIndex, setClassDataIndex] = useState(0)
    let [categoryDataIndex, setCategoryDataIndex] = useState(0)
    let [contextHtml, setContextHtml] = useState('')
    let [contextTitle, setContextTitle] = useState('')
    let [SetShow, setSetShow] = useState(-1)
    // console.log(data);

    useEffect(() => {
        // 获取二级
        getClassChildren({ category_id: data.CategoryID }).then((res) => {
            // console.log(res);
            if (res.data.status.code === 200) {
                setClassData(res.data.data[0].children)
                getClassChildren({ category_id: classData[0]?.CategoryID }).then((res) => {
                    if (res.data.status.code === 200) {
                        console.log(res.data.data[0].children);
                        if (res.data.data[0].children?.length > 0) {
                            setCategoryData(res.data.data[0].children)
                            console.log(res.data.data[0].children);
                            setCategoryShow(true)
                        } else {
                            setCategoryShow(false)
                        }

                    }

                }).catch((error) => {
                    message.error(error)
                })
            }
        }).catch((error) => {
            message.error(error)
        })
    }, [data, classData])


    // 分类的切换
    let handleClassTab = (data: any, index: number) => {
        setCategoryDataIndex(0)
        setClassDataIndex(index)
        getClassChildren({ category_id: data.CategoryID }).then((res) => {
            if (res.data.status.code === 200 && res.data.data[0].children.length > 0) {
                setCategoryShow(true)
                console.log('有三级');
                setCategoryData(res.data.data[0].children)
                if (categoryShow) {
                    getCategoryData({ limit: '30', page: '1', category_id: res.data.data[0].children[0].CategoryID }).then((ressl) => {
                        // console.log(res, '内容');有三级
                        setSearchId(res.data.data[0].CategoryID)
                        if (ressl.data.status.code === 200) {
                            setContextData(ressl.data.records)
                        }
                        // console.log(ressl, 'ressl');

                    }).catch((error) => {
                        message.error(error)
                    })
                }
            }
            else if (!res.data.data[0].children.length) {
                console.log('没三级');
                setSearchId(data.CategoryID)
                getCategoryData({ limit: '30', page: '1', category_id: data.CategoryID }).then((ressl) => {
                    // console.log(res, '内容');有三级
                    if (ressl.data.status.code === 200) {
                        setContextData(ressl.data.records)
                    }
                    // console.log(ressl, 'ressl');

                }).catch((error) => {
                    message.error(error)
                })
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 类别的切换
    let handleTabCategory = (item: any, index: number) => {
        setSearchId(item.CategoryID)
        setCategoryDataIndex(index)
        getCategoryData({ limit: '30', page: '1', category_id: item.CategoryID }).then((ressl) => {
            // console.log(res, '内容');有三级
            if (ressl.data.status.code === 200) {
                setContextData(ressl.data.records)
            }
            // console.log(ressl, 'ressl');

        }).catch((error) => {
            message.error(error)
        })
    }
    const handleOk = () => {
        setIsModalOpen(false);
        // setContextHtml('')
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        // setContextHtml('')
    };
    let handleOpenModal = (item: any) => {
        setIsModalOpen(true);
        setContextHtml(item.content_html)
        setContextTitle(item.title)
        // console.log(contextHtml, 'ContextHtml');
    }

    return (
        <div className={styles.study_body}>
            <div className={styles.study_body_type}>分类：
                {
                    classData?.map((item: any, index: number) => {
                        return <span className={`${styles.class_item} ${index === classDataIndex ? styles.class_item_active : ''}`} key={index} onClick={() => { handleClassTab(item, index) }}>{item.name}</span>
                    })
                }
            </div>
            {
                categoryShow ? <div>类别：
                    {
                        categoryData?.map((item: any, index: number) => {
                            return <span className={`${styles.class_item} ${index === categoryDataIndex ? styles.class_item_active : ''}`} key={item.CategoryID} onClick={() => { handleTabCategory(item, index) }}>{item.name}</span>
                        })
                    }
                </div> : ''
            }

            <div className={styles.study_body_time}>时间：{data.updated_at}</div>
            <div className={styles.study_body_List} >
                {
                    contextData?.map((item: any, index: number) => {
                        // style={{background:'url(https://aiwritebeijing.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240814192252.png)',backgroundSize:'cover',backgroundRepeat:'repeat'}}
                        return <div key={index} className={SetShow === index ? styles.study_body_List_item_active : styles.study_body_List_item} onClick={() => { handleOpenModal(item) }} onMouseEnter={() => setSetShow(index)} onMouseLeave={() => setSetShow(-1)} >

                            <div className={styles.study_body_List_item_title}>{item.title}</div>
                            <div className={styles.study_body_List_item_content}>{item.summary}</div>
                            {
                                SetShow === index ? <div className={styles.study_body_List_icon}>22</div> : ''
                            }
                        </div>
                    })

                }
                <Modal open={isModalOpen} width={'90%'} onOk={handleOk} okText={'应用'} cancelText={'收藏'} onCancel={handleCancel} style={{ padding: '1vw', overflow: 'hidden' }}>
                    <div style={{ fontSize: '1.7vw', width: '100%', textAlign: 'center', fontWeight: '600' }}> {contextTitle}</div>
                    <div style={{ padding: '1vw', border: '1px solid #ccc', borderRadius: '1vw', marginTop: '1vw', overflow: 'auto', height: '70vh' }} dangerouslySetInnerHTML={{ __html: contextHtml }} />
                  
                </Modal>

            </div>


        </div>
    );
}

export default index