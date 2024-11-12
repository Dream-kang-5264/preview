
import React, { useEffect, useRef, useState } from 'react';
import styles from './studys.module.scss';
const zhCN = require('antd/lib/locale/zh_CN').default;
// import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider, Input, Modal, Pagination, Space, Tooltip, message } from 'antd';

// import PDFViewer from 'pdf-viewer-reactjs';
import { Document, Page, pdfjs } from 'react-pdf';
// import '../../../public/体检报告.pdf'
const { Search } = Input;
import * as pdf from 'pdfjs-dist'

import Send from '../../../public/send.svg'
import Sends from '../../../public/send2.svg'
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.js?url'
import { useLayoutEffect } from "react";
import parse from 'html-react-parser';
import studysIcon from '../../../public/Studys/Frame.png'
import { getClassChildren, getTitleData, getCategoryData, getPdfFile } from '@/api/Study';
import { CopyOutlined } from '@ant-design/icons';
import { baseUrl } from '@/utils/process';

// pdf.GlobalWorkerOptions.workerSrc = pdfWorker;
// / 设置worker路径
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// 设置 pdf.js 的 worker
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.0.0/es5/build/pdf.worker.min.js`;

function Index() {

    const [newTabContent, setNewTabContent]: any = useState(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    let [inputValue, setInputValue] = useState('')
    let [titleData, setTitleData] = useState([])
    let [searchId, setSearchId] = useState('')
    let [categoryData, setCategoryData] = useState<any>([])
    let [contextData, setContextData] = useState([])
    // let [homes, setHome]: any = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    let [classData, setClassData] = useState<any>([])
    let [classDataIndex, setClassDataIndex] = useState(0)
    let [categoryShow, setCategoryShow] = useState(false)
    let [categoryDataIndex, setCategoryDataIndex] = useState(0)
    let [contextHtml, setContextHtml] = useState('')
    let [contextTitle, setContextTitle] = useState('')
    let [SetShow, setSetShow] = useState(-1)
    let [pageSizes, setPageSizes] = useState(30)
    let [pages, setPages] = useState(1)
    let [currPage, setCurrPage] = useState(1)
    // 总条数
    let [totality, setTotality] = useState(0)
    let [trade, setTrade] = useState([])
    let [tradeIndex, setTradeIndex] = useState(-1)
    let [pdfShow, setPdfShow] = useState(false)
    let [pdfSrc, setPdfSrc] = useState('')
    const [loading, setLoading] = React.useState<boolean>(true);
    let [currType, setCurrType] = useState('1')
    useEffect(() => {
        handleAll()
        getTitleData().then((re: any) => {
            // console.log(re.data.data)
            let arr = re.data.data.filter((item: any) => item.category_type === '1')
            let brr = re.data.data.filter((item: any) => item.category_type === '2')
            setTitleData(arr)
            setTrade(brr)
            getClassChildren({
                category_id: re.data.data[0].category_id, type: re.data.data[0].category_type
            }).then((res) => {
                // console.log(res);
                if (res.data.status.code === 200) {
                    setClassData(res.data.data[0].children)
                    // console.log(res.data.data[0].children);

                    getClassChildren({ category_id: res.data.data[0].children[0].CategoryID, type: res.data.data[0].children[0].type }).then((resl) => {
                        // console.log(resl.data.data[0].children);

                        if (resl.data.data[0].children.length > 0) {
                            setCategoryData(resl.data.data[0].children)
                            setCategoryShow(true)
                            setSearchId(resl.data.data[0].children[0].CategoryID)
                            getCategoryData({ limit: pageSizes, page: pages, category_id: resl.data.data[0].children[0].CategoryID }).then((ressl) => {
                                // console.log(res, '内容');有三级
                                if (ressl.data.status.code === 200) {
                                    // console.log(ressl.data.records, 'resss');

                                    setContextData(ressl.data.records)
                                    setTotality(ressl.data.total)
                                }
                                // console.log(ressl, 'ressl');

                            }).catch((error) => {
                                message.error(error)
                            })
                        }
                        else {
                            // console.log('没有三级', resl.data.data);
                            setSearchId(resl.data.data[0].CategoryID)
                            getCategoryData({ limit: pageSizes, page: pages, category_id: resl.data.data[0].CategoryID, type: resl.data.data[0].type }).then((ress) => {
                                // console.log(res, '内容');
                                // console.log(ress, 'ress');
                                if (ress.data.status.code === 200) {
                                    setContextData(ress.data.records)
                                    setTotality(ress.data.total)
                                }
                            }).catch((error) => {
                                message.error(error)
                            })
                        }
                    })

                }
            }).catch((error) => {
                message.error(error)
            })

        }).catch((error) => {
            message.error(error)
        })
        setClassDataIndex(0)
        setSelectedTabIndex(0)
        setTradeIndex(-1)
        // setCurrType('1')
    }, [])
    // 点击搜索
    let handleSend = () => {
        getCategoryData({ limit: pageSizes, page: pages, category_id: searchId, search_title: inputValue, type: currType }).then((res) => {
            if (res.data.status.code === 200) {
                setContextData(res.data.records)
                setTotality(res.data.total)
                setInputValue('')
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 一级分类的切换
    const handleTab = (item: any, index: number) => {
        setCurrPage(1)
        if (item.category_type === '2') {
            setTradeIndex(index)
            setSelectedTabIndex(-1);
            setContextHtml('')
            setClassDataIndex(-1)
            handleAll()
            setCurrType(item.category_type)
        }
        else if (item.category_type === '1') {
            setSelectedTabIndex(index);
            setTradeIndex(-1)
            setClassDataIndex(0)
            setCurrType(item.category_type)
        }
        getClassChildren({ category_id: item.category_id, type: item.category_type }).then((res) => {
            if (res.data.status.code === 200) {
                setClassData(res.data.data[0].children)
                // console.log(res.data.data[0].children, '二级');
                setSearchId(res.data.data[0].children[0].CategoryID)
                getClassChildren({ category_id: res.data.data[0].children[0].CategoryID, type: item.category_type }).then((resl) => {
                    // console.log(resl, 'resl');
                    if (resl.data.status.code === 200) {
                        if (resl.data.data[0].children.length > 0) {
                            setCategoryShow(true)
                            setCategoryData(resl.data.data[0].children)
                            // console.log(resl.data.data[0].children, '三级');
                            setSearchId(resl.data.data[0].children[0].CategoryID)
                            getCategoryData({ limit: pageSizes, page: pages, category_id: resl.data.data[0].children[0].CategoryID, type: item.category_type }).then((ress) => {
                                // console.log(ress, 'ress');
                                if (ress.data.status.code === 200) {
                                    setContextData(ress.data.records)
                                    setTotality(ress.data.total)

                                }
                            }).catch((error) => {
                                message.error(error)
                            })
                        }
                        else {
                            // console.log(item.category_type);
                            getCategoryData({ limit: pageSizes, page: pages, category_id: item.category_type === '1' ? resl.data.data[0].CategoryID : '', type: item.category_type }).then((newRes) => {
                                // console.log(newRes);
                                if (newRes.data.status.code === 200) {
                                    setSearchId(resl.data.data[0].CategoryID)
                                    setContextData(newRes.data.records)
                                    setTotality(newRes.data.total)

                                }
                            }).catch((error) => {
                                message.error(error)
                            })
                            setCategoryShow(false)
                        }
                    }
                })
            }
        }).catch((error) => {
            message.error(error)
        })


    };


    // 分类的切换
    let handleClassTab = (data: any, index: number) => {
        setCurrPage(1)
        setCategoryDataIndex(0)
        setClassDataIndex(index)
        getClassChildren({ category_id: data.CategoryID, type: data.type }).then((res: any) => {
            if (res.data.status.code === 200 && res.data.data[0].children.length > 0) {
                setCategoryShow(true)
                // console.log(res.data.data[0].children, '有三级');
                setCategoryData(res.data.data[0].children)

                if (categoryShow) {

                    getCategoryData({ limit: pageSizes, page: pages, category_id: res.data.data[0].children[0].CategoryID, type: data.type }).then((ressl) => {
                        // console.log(res, '内容');有三级
                        setSearchId(res.data.data[0].children[0].CategoryID)
                        if (ressl.data.status.code === 200) {
                            setContextData(ressl.data.records)
                            setTotality(ressl.data.total)

                        }
                        // console.log(ressl, 'ressl');

                    }).catch((error) => {
                        message.error(error)
                    })
                }
            }
            else if (!res.data.data[0].children.length) {
                // console.log(res, '没三级');
                setSearchId(data.CategoryID)
                getCategoryData({ limit: pageSizes, page: pages, category_id: data.CategoryID, type: data.type }).then((ressl) => {
                    // console.log(res, '内容');有三级
                    if (ressl.data.status.code === 200) {
                        setContextData(ressl.data.records)
                        setTotality(ressl.data.total)

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
        setPages(1)
        setCurrPage(1)
        setSearchId(item.CategoryID)
        setCategoryDataIndex(index)
        getCategoryData({ limit: pageSizes, page: pages, category_id: item.CategoryID, type: item.type }).then((ressl) => {
            // console.log(res, '内容');有三级
            if (ressl.data.status.code === 200) {
                setContextData(ressl.data.records)
                setTotality(ressl.data.total)

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
    // 关闭弹窗
    const handleCancel = () => {
        setIsModalOpen(false);
        // setContextHtml('')
        setPdfSrc('')
        setLoading(true);
    };
    // 打开弹窗
    let handleOpenModal = async (item: any) => {
        setIsModalOpen(true);

        if (item.file_path) {
            try {
                const response = await fetch(`${baseUrl}/api/v1/garden/area/industryReport_pdf`, {
                    method: 'POST',
                    headers: { "Content-Type": 'application/json', "token": localStorage.getItem('token') || '', },
                    body: JSON.stringify({ id: item.id }) // 根据需要传递 ID
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setLoading(false);
                    setPdfSrc(url);
                    // console.log(url);

                } else {
                    console.error('Failed to fetch PDF');
                }
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
            setPdfShow(true);
        }
        else {
            setPdfShow(false);
        }
        setContextHtml(item.content_html)
        setContextTitle(item.title)
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    //分页
    let handlePage = (page: any, pageSize: any) => {
        // console.log(page, pageSize);
        setPageSizes(pageSize)
        setCurrPage(page)
        getCategoryData({ limit: pageSize, page: page, category_id: searchId, type: currType }).then((ressl) => {
            // console.log(res, '内容');有三级
            if (ressl.data.status.code === 200) {
                setContextData(ressl.data.records)
                setTotality(ressl.data.total)
            }
            // console.log(ressl, 'ressl');
        }).catch((error) => {
            message.error(error)
        })
    }
    // 键盘事件
    let handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleSend()
        }
    }
    // 石油行业的全部
    let handleAll = () => {
        setClassDataIndex(-1)
        getCategoryData({ limit: pageSizes, page: pages, type: currType }).then((res) => {

            if (res.data.status.code === 200) {
                // console.log(res);
                setContextData(res.data.records)
                setTotality(res.data.total)
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    return (
        <div className={styles.study_div} style={{ width: '100%', padding: '1vw', borderRadius: '1vw', }}>
            <div className={styles.study_content}>
                {/* 头部的背景图以及搜索框 */}
                <div className={styles.study_header}>
                    <div className={styles.study_title}>资源库</div>

                    {/* 搜索框 */}
                    <div className={styles.study_search}>
                        <input type="text" placeholder="请输入搜索内容" value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} onKeyDown={handleKeyDown} />
                        {
                            !inputValue ? <Tooltip placement="top" title={'请输入内容'}>
                                <img width={100} height={30} src={Send} alt='' style={{ width: '3vw', height: '2vw', }} />
                            </Tooltip> : <img width={100} height={30} src={Sends} alt='' style={{ width: '3vw', height: '2vw' }} onClick={handleSend} />
                        }

                    </div>
                    {/* 选项卡 */}
                    <div className={styles.study_tab}>
                        {/* 左侧资料库 */}

                        <div className={styles.study_tab_left}>
                            <div className={styles.study_tab_left_title}>
                                <i className={styles.study_tab_left_title_icon}>.</i>
                                <span>资料库</span>
                            </div>
                            <div className={styles.study_tab_left_content}>
                                {titleData?.map((item: any, index: number) => (

                                    <div
                                        key={index}
                                        className={`${styles.study_tab_left_item} ${selectedTabIndex === index ? styles.selected : ''}`}
                                        // style={{ background: selectedTabIndex === index ? '#fff' : '' }}
                                        onClick={() => handleTab(item, index)}
                                    >
                                        <div style={{ fontSize: '1.5vw' }}> <img src={studysIcon} width={30} height={30} alt='' /></div>
                                        <div className={styles.study_tab_item_title}>{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 右侧行业报告 */}

                        <div className={styles.study_tab_left}>
                            <div className={styles.study_tab_left_title}>
                                <i className={styles.study_tab_left_title_icon}>.</i>
                                <span>行业报告</span>
                            </div>
                            <div className={styles.study_tab_left_content}>
                                {trade?.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className={`${styles.study_tab_left_item} ${tradeIndex === index ? styles.selected : ''}`}
                                        onClick={() => handleTab(item, index)}
                                    >
                                        <div style={{ fontSize: '1.5vw' }}> <img src={studysIcon} width={30} height={30} alt='' /></div>
                                        <div className={styles.study_tab_item_title}>{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 内容区 */}


                <div className={styles.study_body}>
                    <div className={styles.study_body_type}>分类：{
                        currType === '2' ? <span className={`${classDataIndex === -1 ? styles.class_item_active : ''}`} onClick={handleAll} style={{ cursor: 'pointer' }}>全部</span> : ''
                    }
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

                    {/* <div className={styles.study_body_time}>时间：{ }</div> */}
                    <div className={styles.study_body_List} >
                        {
                            contextData?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className={SetShow === index ? styles.study_body_List_item_active : styles.study_body_List_item} onClick={() => { handleOpenModal(item) }} onMouseEnter={() => setSetShow(index)} onMouseLeave={() => setSetShow(-1)}>
                                        <div style={{
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'cover',
                                            backgroundImage: item.preview_image_path ? `url(${item.preview_image_path})` : "",
                                            height: item.preview_image_path ? '15vw' : "",
                                        }} >
                                            <div >

                                                {currType === '1' ? <div className={styles.study_body_List_item_title}>{item.title}</div> : ''}
                                                <div className={styles.study_body_List_item_content}>{item.summary}</div>
                                                {
                                                    SetShow === index ? <div className={styles.study_body_List_icon}>.</div> : ''
                                                }
                                            </div>

                                        </div>
                                        {
                                            currType === '2' ? <div className={styles.study_body_trade_title} >{item.title}</div> : ''
                                        }
                                    </div>

                                )
                            })

                        }

                        <Modal footer={null} open={isModalOpen} width={'90%'} loading={loading} onOk={handleOk} okText={'应用'} cancelText={'收藏'} onCancel={handleCancel} style={{ padding: '1vw', overflow: 'hidden' }}>
                            {
                                pdfShow ? <iframe width={'100%'} height={'700vw'} style={{ marginTop: '1vw' }} src={pdfSrc}></iframe> : <> <div style={{ fontSize: '1.7vw', width: '100%', textAlign: 'center', fontWeight: '600' }}> {contextTitle}</div>
                                    <div style={{ padding: '1vw', border: '1px solid #ccc', borderRadius: '1vw', marginTop: '1vw', overflow: 'auto', height: '80vh' }} dangerouslySetInnerHTML={{ __html: contextHtml }} /></>
                            }

                        </Modal>

                    </div>


                </div>



            </div>

            {/* 分页 */}
            <div className={styles.study_pagination}>
                <ConfigProvider locale={zhCN}>
                    <Pagination
                        align={'center'}
                        // size="small"
                        total={totality}
                        showSizeChanger
                        showQuickJumper
                        current={currPage}
                        pageSize={pageSizes}
                        defaultCurrent={pages}
                        showTotal={(total) => `共 ${total} 条`}
                        onChange={handlePage}
                    />  </ConfigProvider>
            </div>
        </div >
    );
}

export default Index;