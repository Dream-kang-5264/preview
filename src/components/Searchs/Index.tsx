import React, { useCallback, useEffect, useRef, useState, } from 'react'
import styles from './search.module.scss'
import { delUploadMaterial, getAllMaterial, getAllUploadMaterial, getSearchClass, getSearchFilter, uploadFileImg, userAffixText, userFileUpload, userMaterialTypes, userUpdateTitle, userUploadDocument, userUploadPdf, userUploadedList } from '@/api/search'
import { CopyOutlined, DeleteOutlined, DownOutlined, EditOutlined, EllipsisOutlined, LikeOutlined, LoadingOutlined, MessageOutlined, SettingOutlined, StarOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, ConfigProvider, Dropdown, Empty, Input, List, MenuProps, Modal, Pagination, Progress, Select, Space, Spin, Tabs, TabsProps, Tooltip, message } from 'antd'

const zhCN = require('antd/lib/locale/zh_CN').default;
import Send from '../../../public/send.svg'
import Sends from '../../../public/send2.svg'

import { v4 as uuidv4 } from 'uuid';

import ImageZoom from './ImageZoom'
import { unstable_batchedUpdates } from 'react-dom'
const { Meta } = Card;
// import zhCN from 'antd/es/locale/zh_CN';
function Index() {
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
    // 上传的数据
    let [uploadData, setUploadData] = useState<any>({ loaddingShow: true, img: '', name: '', status: '上传中', progShow: true, modalTitle: '上传记录', uploadList: [], options: [], recordList: [], SelectValue: '全部', text: '', searchValue: '', textCopyShow: false, txtTitle: '', addTextTitle: '' })
    // 编辑器的数据
    let [AiEditorData, setAiEditorData] = useState({ modals: false, imageShow: false, imageUrl: '', content: '', item: '' })
    // 保存纯文本
    let [isModalText, setisModalText] = useState(false)
    let [myPagination, setMyPagination] = useState({ myTotality: 0, myPage: 1, myPageSizes: 10, myPages: 1 })
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
    useEffect(() => {
        getAllMaterial().then((res) => {
            if (res.data.status.code === 200) {
                setClassData(res.data.data);
            }
        }).catch((error) => {
            message.error(error)
        })
        handleAll()
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleAllUploadData('')
                setUploadData((prve: any) => ({
                    ...prve,
                    SelectValue: '全部'
                }))
            }
        };

        // 添加事件监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 清理函数 - 当组件卸载时移除事件监听器
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };

    }, [])
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
        console.log(item);
        setPages(1)
        setCurrPage(1)
        getSearchFilter({ category_id: item.CategoryID, limit: pageSizes, page: pages }).then((res) => {
            console.log(res);
            setCurrId(item.CategoryID)
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }
        }).catch((error) => {
            message.error(error)
        })
    }
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
            handleSearch()
        }
        setTimeout(() => {
            targetRef.current?.removeEventListener('mouseover', mouseOverEvent);
        }, 1000)
    }
    // 点击搜索
    let handleSearch = () => {
        setPages(1)
        setEmpty(false)
        getSearchFilter({ search_title: searchValue, limit: pageSizes, page: pages }).then((res) => {
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
    // 点击内容打开弹窗
    let handleContent = (item: any, index: number) => {
        setIsModalOpen(true);
        setModalContent(item.content)
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
    // 获取所有类型
    let getUserMaterialTypes = () => {
        userMaterialTypes().then((res) => {
            setUploadData((prve: any) => ({
                ...prve,
                options: res.data.data.data
            }))

        }).catch((err) => {

        })
    }
    // 键盘事件
    let handleMyKeyDown = (event: any) => {
        const mouseOverEvent = new Event('mouseover', {
            bubbles: true,
            cancelable: true,
        });
        if (event.key === 'Enter') {

            handleMySearch()
        }

    }
    // 我的素材搜索
    let handleMySearch = () => {
        getAllUploadMaterial({ search_title: uploadData.searchValue }).then((res) => {

            if (res.status === 200) {
                setUploadData((prve: any) => ({
                    ...prve,
                    uploadList: res.data.data.data,
                    searchValue: ''
                }))
            }


        }).catch((err) => {
            console.log(err);
        })
    }
    const onChange = (key: string) => {
        if (key === '2') {
            handleAllUploadData('')
        }
    };
    // 新增素材的数据
    const items: MenuProps['items'] = [
        {
            key: '1',
            // type: 'group',
            label: '从本地上传',
            children: [
                {
                    key: '1-1',
                    label: <div onClick={() => {
                        if (uploadFileRef.current) {
                            uploadFileRef.current?.click()
                        }
                    }}>上传文档</div>,
                },
                {
                    key: '1-2',
                    label: <div onClick={() => {
                        if (uploadImgRef.current) {
                            uploadImgRef.current?.click()
                        }
                    }}>上传图片</div>,
                },
            ],
        },
        {
            key: '2',
            label: '从外部链接添加',

        },
        {
            key: '3',
            label: <div onClick={() => { setisModalText(true) }}>新增粘贴纯文本</div>,

        },
        // {
        //     key: '3',
        //     label: '新增粘贴纯文本',

        // },
        // {
        //     key: '3',
        //     label: '新增粘贴纯文本',

        // },
    ];
    // 下拉框的数据
    const options = uploadData.options.map((item: any, index: number) => {
        return {
            value: item.material_type,
            label: item.content,
            type: item.material_type
        }
    })
    // const hadleTypeChange = useCallback((e: any) => {

    //     setUploadData((prev: any) => ({
    //         ...prev,
    //         SelectValue: e
    //     }));
    //     getUserMaterialTypes();
    //     handleAllUploadData(e);

    // }, []);

    // 切换分类
    let handleTypeChange = (event: string) => {
        setUploadData((prev: any) => ({
            ...prev,
            SelectValue: event
        }));
        getUserMaterialTypes(); // 确认是否需要每次都调用
        handleAllUploadData(event);
    }

    // 获取所有上传的数据
    let handleAllUploadData = (type: any) => {
        getUserMaterialTypes()
        getAllUploadMaterial({ material_type: type }).then((res) => {
            console.log(res, '全部');
            if (res.status === 200) {
                setUploadData((prve: any) => ({
                    ...prve,
                    uploadList: res.data.data.data
                }))
                setMyPagination((prve: any) => ({
                    ...prve,
                    myTotality: res.data.data.total
                }))
            }
        }).catch((err) => {

        })


    }
    // 获取上传列表数据
    let handleUploadList = () => {
        userUploadedList().then((res) => {
            // console.log(res);
            if (res.status === 200) {
                setUploadData((prve: any) => ({
                    ...prve,
                    recordList: res.data.files_is
                }))

            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 点击保存
    let handleTextOk = () => {
        let id = uuidv4()
        userAffixText({ uploaded_files_id: id, text: uploadData.text, title: uploadData.addTextTitle }).then((res) => {
            // console.log(res);
            if (res.data.status.code === 200) {
                message.success('保存成功')
                setisModalText(false)
                handleAllUploadData('')
            }
        }).catch((error) => {
            message.error(error)
        })
    }
    // 我的素材分页
    let handleMyPage = (page: any, pageSize: any) => {
        console.log(page, pageSize);
        setMyPagination((prve: any) => ({
            ...prve,
            myPage: page,
            myPageSizes: pageSize
        }))
        getAllUploadMaterial({ page: page, limit: pageSize }).then((res) => {
            setUploadData((prve: any) => ({
                ...prve,
                uploadList: res.data.data.data
            }))
        }).catch((error) => {
            message.error(error)
        })

    }

    const tabData: TabsProps['items'] = [
        {
            key: '1',
            label: <div>公共素材</div>,
            children: <>
                <div className={styles.search_header}>
                    {/* <Dropdown menu={{ items }}>
                        <Button type="primary"> 新增素材 <DownOutlined /></Button>
                    </Dropdown>

                    <div style={{ width: '1vw', display: 'inline-block' }}></div> */}
                    <Space.Compact
                        style={{ width: '28.8vw' }}
                    >
                        {/* <Select defaultValue="Zhejiang" options={options} /> */}
                        <Input value={searchValue}

                            onChange={(e) => {
                                setSearchValue(e.target.value)
                            }} onKeyDown={handleKeyDown} placeholder='按关键词搜索素材' />
                        {
                            !searchValue ? <Tooltip placement="top" title={'请输入内容'}>
                                <img ref={targetRef} width={50} height={40} src={Send} alt='' style={{ width: '2vw', height: '2vw' }} />
                            </Tooltip> : <img width={50} height={30} src={Sends} alt='' style={{ width: '2vw', height: '2vw' }} onClick={handleSearch} />
                        }
                    </Space.Compact>
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
            </>,
        },
        {
            key: '2',
            label: <div >我的素材</div>,
            children: < >
                <div className={styles.search_header}>
                    <Dropdown menu={{ items }}>
                        <Button type="primary"> 新增素材 <DownOutlined /></Button>
                    </Dropdown>

                    <div style={{ width: '1vw', display: 'inline-block' }}></div>
                    <Space.Compact >
                        <Select value={uploadData.SelectValue} options={options} onChange={handleTypeChange} />
                        <Input value={uploadData.searchValue} onChange={(e) => {
                            setUploadData((prve: any) => ({
                                ...prve,
                                searchValue: e.target.value
                            }))
                        }} onKeyDown={handleMyKeyDown} placeholder='按关键词搜索素材' />
                        {
                            !uploadData.searchValue ? <Tooltip placement="top" title={'请输入内容'}>
                                <img ref={targetRef} width={50} height={40} src={Send} alt='' style={{ width: '2vw', height: '2vw' }} />
                            </Tooltip> : <img width={50} height={30} src={Sends} alt='' style={{ width: '2vw', height: '2vw' }} onClick={handleMySearch} />
                        }
                    </Space.Compact>

                </div>
                <div className={styles.search_my_content}>
                    {
                        uploadData.uploadList.length > 0 ? uploadData.uploadList.map((item: any, index: number) => {
                            return <Card
                                onClick={() => {
                                    if (item.material_type !== "image" && item.material_type !== "txt") {
                                        window.open(`/DocumentDocx/${item.id}`, '_blank');
                                    }
                                    else if (item.material_type === "txt") {
                                        setisModalText(true)
                                        setUploadData((prve: any) => ({
                                            ...prve,
                                            text: item.text_content,
                                            textCopyShow: true,
                                            addTextTitle: item.title
                                        }))
                                    } else {
                                        setAiEditorData((prve: any) => ({
                                            ...prve,
                                            imageShow: true,
                                            imageUrl: item.url
                                        }))
                                    }
                                }}
                                className={styles.search_my_card}
                                key={index}
                                size='small'
                                style={{ width: 200, }}
                                cover={
                                    <img
                                        // onClick={() => {
                                        //     console.log(item.url);
                                        // }}
                                        width={80}
                                        height={130}
                                        alt="example"
                                        src={item.url}
                                    />
                                }

                                actions={

                                    item.material_type === "txt" ? [

                                        <EditOutlined key="edit" onClick={(e) => {
                                            e.stopPropagation();
                                            setInputActive(index)
                                        }} />,

                                        <DeleteOutlined key="delete" onClick={(e: any) => {
                                            e.stopPropagation();
                                            delUploadMaterial({ materials_id: item.id }).then((res) => {
                                                if (res.status === 200) {
                                                    // console.log(res);
                                                    message.success(res.data.message);
                                                    handleAllUploadData('')
                                                }
                                            }).catch((err) => {
                                            })
                                        }} />
                                    ] : [

                                        // <SettingOutlined key="setting" />,
                                        // <EditOutlined key="edit" />,
                                        <DeleteOutlined key="delete" onClick={(e: any) => {
                                            e.stopPropagation();
                                            delUploadMaterial({ materials_id: item.id }).then((res) => {
                                                if (res.status === 200) {
                                                    // console.log(res);
                                                    message.success(res.data.message);
                                                    handleAllUploadData('')
                                                }
                                            }).catch((err) => {
                                            })
                                        }} />
                                        // <EllipsisOutlined key="ellipsis" />,
                                    ]}
                            >
                                <Meta
                                    // style={{ height: 50 }}
                                    // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                    title={
                                        item.material_type === 'txt' ?
                                            <>
                                                {
                                                    inputActive === index ?
                                                        <input defaultValue={item.title} className={inputActive === index ? styles.search_my_card_title_active : styles.search_my_card_title}
                                                            onBlur={() => {
                                                                setInputActive(-1)
                                                                userUpdateTitle({ uploaded_files_id: item.id, title: uploadData.txtTitle }).then((res) => {
                                                                    if (res.data.status.code === 200) {
                                                                        message.success(res.data.status.msg)
                                                                    }
                                                                }).catch((error) => {
                                                                    message.error(error)
                                                                })
                                                            }}
                                                            onClick={(e) => { e.stopPropagation(); }}
                                                            onChange={(e) => {
                                                                setUploadData((prve: any) => ({
                                                                    ...prve,
                                                                    txtTitle: e.target.value
                                                                }))
                                                            }}
                                                        /> : <div className={styles.search_my_card_title}>{item.title}</div>
                                                }
                                            </>


                                            : <div className={styles.search_my_card_title}>{item.title}</div>
                                    }
                                // description={item.title}
                                />
                            </Card>
                        }) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Empty description={'暂无数据'} /></div>


                    }


                </div>
                {/* 分页 */}
                <div className={styles.search_pagination}>
                    <ConfigProvider locale={zhCN}>
                        <Pagination
                            align={'center'}
                            // size="small"
                            total={myPagination.myTotality}
                            showSizeChanger
                            showQuickJumper
                            current={myPagination.myPage}
                            pageSize={myPagination.myPageSizes}
                            defaultCurrent={myPagination.myPages}
                            showTotal={(total) => `共 ${total} 条`}
                            onChange={handleMyPage}
                        />  </ConfigProvider></div>
            </>,
        },

    ];

    // 文件上传
    let handleFileChange = (event: any) => {
        setFileModalOpen(true)
        handleUploadList()
        const file = event.target.files[0];
        const extension = file.name.split('.').pop()
        setUploadData((prve: any) => ({
            ...prve,
            name: file.name,
            modalTitle: <Spin indicator={<LoadingOutlined spin />} size="small" >上传中</Spin>
        }))


        switch (extension) {
            case 'docx':
                setUploadData((prve: any) => ({
                    ...prve,
                    img: 'https://img1.baidu.com/it/u=2522339005,3531004293&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
                }))
                break;
            case 'pdf':
                setUploadData((prve: any) => ({
                    ...prve,
                    img: 'https://img0.baidu.com/it/u=3213689374,3217537493&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500'
                }))
                break;
            case 'text':
                setUploadData((prve: any) => ({
                    ...prve,
                    img: 'https://img1.baidu.com/it/u=1446035942,1762458174&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
                }))
                break;
            case 'txt':
                setUploadData((prve: any) => ({
                    ...prve,
                    img: 'https://img1.baidu.com/it/u=1446035942,1762458174&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
                }))
                break;
            case 'jpg':
                setUploadData((prve: any) => ({
                    ...prve,
                    img: 'https://i.52112.com/icon/jpg/256/20191030/65176/2833641.jpg'
                }))
                break;
            case 'png':
                setUploadData((prve: any) => ({
                    ...prve,
                    img: 'https://i.52112.com/icon/jpg/256/20191030/65176/2833641.jpg'
                }))
                break;
            default:
                break;
        }
        if (file) {
            const formData = new FormData();
            let token: any = localStorage.getItem('token')
            formData.append('file', file);
            const id = uuidv4();
            formData.append('uploaded_files_id', id);
            const mimeType = file.type;
            formData.append('token', token);


            if (mimeType.startsWith('image/')) {
                formData.append('token', token);
                uploadFileImg(formData).then((res) => {
                    if (res.data.status.code === 200) {
                        setTimeout(() => {
                            setUploadData((prve: any) => ({
                                ...prve,
                                progShow: false,
                                status: '上传成功',
                                loaddingShow: false,
                                modalTitle: '上传记录'
                            }))
                            setProg(100)
                            handleUploadList()
                            message.success('上传成功')
                        }, 5000)
                    }
                }).catch((err) => {

                })
                // console.log('Image');
            } else if (mimeType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {

                userUploadDocument(formData).then((res) => {

                    if (res.data.status.code === 200) {
                        setTimeout(() => {
                            setUploadData((prve: any) => ({
                                ...prve,
                                progShow: false,
                                status: '上传成功',
                                loaddingShow: false,
                                modalTitle: '上传记录'
                            }))
                            handleUploadList()
                            // console.log(uploadData.recordList[0]);
                            userUploadedList().then((res) => {
                                if (res.data.files_is[0].upload_status === '解析失败') {
                                    message.error('解析失败');
                                    return;
                                }
                                // 只有在没有解析失败的情况下才执行
                                message.success('上传成功');
                            }).catch((error) => {
                                message.error(error)
                            })
                        }, 5000)
                    }
                }).catch((err) => {

                })


            } else if (mimeType.startsWith('application/pdf')) {

                userUploadPdf(formData).then((res) => {
                    if (res.data.status.code === 200) {
                        setTimeout(() => {
                            setUploadData((prve: any) => ({
                                ...prve,
                                progShow: false,
                                status: '上传成功',
                                loaddingShow: false,
                                modalTitle: '上传记录'
                            }));
                            handleUploadList();

                            userUploadedList().then((res) => {
                                if (res.data.files_is[0].upload_status === '解析失败') {
                                    message.error('解析失败');
                                    return;
                                }
                                // 只有在没有解析失败的情况下才执行
                                message.success('上传成功');
                            }).catch((error) => {
                                message.error(error)
                            })
                        }, 5000);
                    }
                }).catch((err) => {
                    console.log(err);
                });

            }

        }
        uploadFileRef.current.value = null;
        uploadImgRef.current.value = null;
    }
    const data = [
        {
            title: 'Ant Design Title 1',
        },
    ];
    return (
        <div className={styles.search_div} style={{ width: '100%', background: '#F7F8FA', padding: '1vw', borderRadius: '1vw' }}>

            <div style={{ display: 'none' }}>
                <input type="file" ref={uploadFileRef} accept=".txt,.docx,.pdf,.txt" onChange={handleFileChange} />
                <input type="file" ref={uploadImgRef} accept=".pjp,.jpg,.pjpe,.jpg,.png" onChange={handleFileChange} />
            </div>
            <Tabs defaultActiveKey="1" items={tabData} onChange={onChange} />
            {/* 上传列表的弹窗 */}
            <Modal title={uploadData.modalTitle} footer={false} open={fileModalOpen} onCancel={() => {
                setFileModalOpen(false); setUploadData((prve: any) => ({
                    ...prve,
                    progShow: true,
                    status: '上传中',
                    loaddingShow: true
                }))
                setProg(10)

                handleAllUploadData('')
            }} onOk={() => { setFileModalOpen(false) }} >
                <div className={styles.fileModal}>
                    {
                        uploadData.loaddingShow ? <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[<div key="list-loadmore-edit">{uploadData.status}</div>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={uploadData.img} />}
                                        title={<>{uploadData.name}</>}
                                        description={uploadData.progShow ? <div>  <Progress strokeColor="#998" size="small" percent={prog} showInfo={false} /></div> : ''}
                                    />
                                </List.Item>

                            )}
                        /> : ''
                    }

                    <List
                        itemLayout="horizontal"
                        dataSource={uploadData.recordList}
                        renderItem={(item: any, index) => (
                            <List.Item
                                actions={[<a key="list-loadmore-edit">{item.upload_status}</a>]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.file_path} />}
                                    title={<>{item.file_name}</>}
                                // description={<div>  <Progress strokeColor="#998" size="small" percent={prog} showInfo={false} /></div>}
                                />
                            </List.Item>

                        )}
                    />
                </div>
            </Modal>
            {/* 纯文本的弹窗 */}
            <Modal title="纯文本上传" open={isModalText} footer={null} onCancel={() => {
                setisModalText(false)
                handleAllUploadData('')
                setUploadData((prve: any) => ({
                    ...prve,
                    textCopyShow: false,
                    text: '',
                    addTextTitle: ''
                }))
            }} >
                <div className={styles.textModalTitle}>
                    <div>标题：</div>
                    <Input placeholder='请输入标题' value={uploadData.addTextTitle} onChange={(e) => {
                        setUploadData((prve: any) => ({
                            ...prve,
                            addTextTitle: e.target.value
                        }))
                    }}></Input>
                </div>
                <div className={styles.textModalTitle}>
                    <div>文本:</div>
                    <Input.TextArea showCount maxLength={1000} placeholder='请输入' value={uploadData.text} onChange={(e) => {
                        setUploadData((prve: any) => ({
                            ...prve,
                            text: e.target.value
                        }))
                    }} style={{ height: 220, resize: 'none' }} />

                </div>

                <div className={styles.textModalBtn}>

                    {uploadData.textCopyShow ? <Button type="primary" onClick={() => {
                        navigator.clipboard.writeText(uploadData.text)
                        message.success('复制成功')
                    }}>复制</Button> : <Button type="primary" onClick={handleTextOk}>保存</Button>}
                </div>
            </Modal>
            {contextHolder}



            {/* <AiEditorModal AiEditorData={AiEditorData} setAiEditorData={setAiEditorData}></AiEditorModal> */}
            {
                AiEditorData.imageShow ? <ImageZoom src={AiEditorData.imageUrl} alt={AiEditorData.imageUrl} setAiEditorData={setAiEditorData} /> : ''
            }
        </div >
    )
}

export default Index
