import { Col, ConfigProvider, Empty, Input, Modal, Pagination, Row, Space, Tooltip, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'
import Send from '../../../public/send.svg'
import Sends from '../../../public/send2.svg'
import { getAllMaterial, getSearchClass, getSearchFilter } from '@/api/search'
import { CopyOutlined, StarOutlined } from '@ant-design/icons'
const { Search } = Input;
const zhCN = require('antd/lib/locale/zh_CN').default;
import { PageContainer } from '@ant-design/pro-components';
import WithAuth from '@/components/WithAuth/Index'
function index() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isMouseOver, setIsMouseOver] = useState(false);
    let [iconShow, setIconShow] = useState(-1)
    // 分类的数据
    const [classData, setClassData] = useState([])
    let [classIndex, setClassIndex] = useState(-1)
    // 类别的数据
    let [classLevel, setClassLevel] = useState([])
    let [classLevelIndex, setClassLevelIndex] = useState(-1)
    // 是否显示下一级
    let [classShow, setClassShow] = useState(false)
    // 内容区的数据
    let [classContext, setClassContext] = useState([])
    // 当前的id
    let [currId, setCurrId] = useState('')
    // 搜索框的值
    let [searchValue, setSearchValue] = useState('')
    // 总条数
    let [totality, setTotality] = useState(0)
    //当前页
    let [currPage, setCurrPage] = useState(1)
    // 每页多少条数据
    let [pageSizes, setPageSizes] = useState(30)
    // 默认当前页
    let [pages, setPages] = useState(1)
    // 显示空状态
    let [empty, setEmpty] = useState(false)
    const targetRef: any = useRef(null)
    // 弹窗的显示隐藏
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 弹窗的内容
    const [modalContent, setModalContent] = useState('');
    let uploadFileRef = useRef<any>(null)
    let uploadImgRef = useRef<any>(null)
    let [prog, setProg] = useState(10)
    let [fileModalOpen, setFileModalOpen] = useState(false)
    let [inputActive, setInputActive] = useState(-1)
    useEffect(() => {
        getAllMaterial().then((res) => {
            if (res.data.status.code === 200) {
                setClassData(res.data.data);
            }
        }).catch((error) => {
            message.error(error)
        })
        handleAll()
    }, [])
    // useEffect(() => {
    //     getAllMaterial().then((res) => {
    //         if (res.data.status.code === 200) {
    //             setClassData(res.data.data);
    //         }
    //     })
    //     handleAll()
    //     const handleVisibilityChange = () => {
    //         if (document.visibilityState === 'visible') {
    //             // handleAllUploadData('')
    //             // setUploadData((prve: any) => ({
    //             //     ...prve,
    //             //     SelectValue: '全部'
    //             // }))
    //         }
    //     };

    //     // 添加事件监听器
    //     document.addEventListener('visibilitychange', handleVisibilityChange);

    //     // 清理函数 - 当组件卸载时移除事件监听器
    //     return () => {
    //         document.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };

    // }, [])
    // 键盘事件
    let handleKeyDown = (event: any) => {
        const mouseOverEvent = new Event('mouseover', {
            bubbles: true,
            cancelable: true,
        });
        if (event.key === 'Enter') {
            if (searchValue === '') {
                setIsMouseOver(true);
                targetRef?.current.dispatchEvent(mouseOverEvent);
                return
            }
            handleSearch(searchValue)
        }
        setTimeout(() => {
            targetRef.current?.removeEventListener('mouseover', mouseOverEvent);
        }, 1000)
    }
    // 点击搜索
    let handleSearch = (key: any) => {
        setPages(1)
        setEmpty(false)
        getSearchFilter({ search_title: key, limit: pageSizes, page: pages }).then((res) => {
            console.log(res);
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
                setSearchValue('')
                if (res.data.total === 0) {
                    setEmpty(true)
                    setTotality(0)
                }
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 获取全部数据
    let handleAll = () => {
        setEmpty(false)
        setClassIndex(-1)
        setPages(1)
        setCurrPage(1)
        setClassShow(false)
        getSearchFilter({ limit: pageSizes, page: pages, }).then((res) => {
            // console.log(res.data, '所有数据');
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }

        }).catch((error) => {
            message.error(error)
        })
    }
    // 切换类别
    let handleClassChildren = (item: any, index: number) => {
        setCurrId(item.category_id)
        setClassShow(true)
        setClassIndex(index)
        setClassLevelIndex(0)
        setPages(1)
        setCurrPage(1)
        setEmpty(false)
        getSearchClass({ category_id: item.category_id, limit: pageSizes, page: pages }).then((res) => {
            if (res.data.status.code === 200) {
                setClassLevel(res.data.data[0].children)
                setCurrId(res.data.data[0].children[0].CategoryID)
                getSearchFilter({ category_id: res.data.data[0].children[0].CategoryID, limit: pageSizes, page: pages }).then((res) => {
                    if (res.data.status.code === 200) {
                        setClassContext(res.data.records)
                        setTotality(res.data.total)

                    }
                }).catch((error) => {
                    message.error(error)
                })
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 切换分类
    let handleClassLevel = (item: any, index: number) => {
        setEmpty(false)
        setClassLevelIndex(index)
        // console.log(item);
        setPages(1)
        setCurrPage(1)
        getSearchFilter({ category_id: item.CategoryID, limit: pageSizes, page: pages }).then((res) => {
            // console.log(res);
            setCurrId(item.CategoryID)
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 点击内容打开弹窗
    let handleContent = (item: any, index: number) => {
        setIsModalOpen(true);
        setModalContent(item.content)
    }
    // 复制的功
    let handleCopy = (item: any, event: any) => {
        setIsModalOpen(false);
        event.stopPropagation()
        navigator.clipboard.writeText(item.content)
        messageApi.open({
            type: 'success',
            content: '复制成功',
        });
    }
    // 点击确定复制按钮
    const handleOk = () => {
        navigator.clipboard.writeText(modalContent)
        setIsModalOpen(false);
        messageApi.open({
            type: 'success',
            content: '复制成功',
        });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    // 分页
    let handlePage = (page: any, pageSize: any) => {
        setPageSizes(pageSize)
        setCurrPage(page)
        // setCurrId('')
        getSearchFilter({ limit: pageSize, page: page, category_id: classIndex === -1 ? '' : currId, }).then((res) => {
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }
        }).catch((err) => {

        })

    }
    return (
        <PageContainer


        >
            <div className={styles.PublicMaterial}>
                <div className={styles.search_header}>
                    {/* <Dropdown menu={{ items }}>
                        <Button type="primary"> 新增素材 <DownOutlined /></Button>
                    </Dropdown>

                    <div style={{ width: '1vw', display: 'inline-block' }}></div> */}
                    {/* <Space.Compact
                    style={{ width: '28.8vw' }}
                >
                
                    <Input value={searchValue}

                        onChange={(e) => {
                            setSearchValue(e.target.value)
                        }} onKeyDown={handleKeyDown} placeholder='按关键词搜索素材' />
                    {
                        !searchValue ? <Tooltip placement="top" title={'请输入内容'}>
                            <img ref={targetRef} width={50} height={40} src={Send} alt='' style={{ width: '2vw', height: '2vw' }} />
                        </Tooltip> : <img width={50} height={30} src={Sends} alt='' style={{ width: '2vw', height: '2vw' }} onClick={handleSearch} />
                    }
                </Space.Compact> */}
                    <Row>
                        <Col span={6}>
                            <Search placeholder="按关键词搜索素材" onChange={(e) => {
                                setSearchValue(e.target.value)
                            }} onSearch={handleSearch} enterButton />
                        </Col>
                    </Row>
                    {/* <div className={styles.search_header_from}>
                        <input type="text" placeholder='按关键词搜索素材' value={searchValue} onChange={(e) => {
                            setSearchValue(e.target.value)
                        }} onKeyDown={handleKeyDown} />
                        {
                            !searchValue ? <Tooltip placement="top" title={'请输入内容'}>
                                <Image ref={targetRef} width={50} height={30} src={Send} alt='' style={{ width: '1.5vw', height: '1.5vw' }} />
                            </Tooltip> : <Image width={50} height={30} src={Sends} alt='' style={{ width: '1.5vw', height: '1.5vw' }} onClick={handleSearch} />
                        }
                    </div> */}

                </div>
                <div className={styles.search_class}>
                    <div className={styles.search_class_title}>
                        <i></i>
                        <span>素材类型</span>
                    </div>
                    <div className={styles.search_class_list}>
                        类别：   <span className={classIndex === -1 ? styles.search_class_list_item_active : styles.search_class_list_item} onClick={handleAll}>全部</span>{
                            classData.map((item: any, index) => {
                                return <span className={classIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassChildren(item, index) }}>{item.name}</span>
                            })
                        }
                    </div>
                    {
                        classShow ?
                            <div className={styles.search_class_level}>
                                分类：{
                                    classLevel.map((item: any, index) => {
                                        return <span className={classLevelIndex === index ? styles.search_class_list_item_active : styles.search_class_lever_item} key={index} onClick={() => { handleClassLevel(item, index) }}>{item.name}</span>
                                    })
                                }
                            </div> : ''
                    }
                </div>
                <div className={styles.search_content}>

                    {
                        !empty ? classContext.map((item: any, index: number) => {
                            return <div key={index} className={iconShow === index ? styles.search_content_item_active : styles.search_content_item} onMouseEnter={() => {
                                setIconShow(index)
                            }} onMouseLeave={() => {
                                setIconShow(-1)
                            }} onClick={() => { handleContent(item, index) }}>

                                <div className={styles.search_content_item_text}>{item.content}</div>
                                {
                                    iconShow === index ? <span className={styles.search_content_item_icon} onClick={(e) => { e.stopPropagation() }}> <Tooltip placement="bottom" title={'复制'}>
                                        <CopyOutlined style={{ padding: '0 .5vh' }} onClick={() => { handleCopy(item, event) }} />
                                    </Tooltip> <Tooltip placement="bottom" title={'收藏'}>
                                            <StarOutlined />
                                        </Tooltip></span> : <span></span>
                                }

                            </div>
                        }) : <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5vw 0' }}><Empty description={'暂无数据'} />
                        </div>
                    }
                    {/* 弹窗 */}
                    <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText={'取消'} okText={'复制'}>
                        <div className={styles.search_modal} style={{ marginTop: '1.5vw', border: '1px solid #ccc', borderRadius: '1vh' }} ><div style={{ padding: '1vh', }}>{modalContent}</div></div>
                    </Modal>
                </div>
                {contextHolder}
                {/* 分页 */}
                <div className={styles.search_pagination}>
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
                        />  </ConfigProvider></div>
            </div>

        </PageContainer>

    )
}

export default index