import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'
import { Avatar, ConfigProvider, Dropdown, Empty, List, MenuProps, Modal, Pagination, Progress, Skeleton, Space, Spin, Table, TableColumnsType, Tabs, TabsProps, Tooltip, message } from 'antd'
import { editMyMaterial, getAllMaterial, getAllUploadMaterial, getSearchClass, getSearchFilter, lookPublicMaterial, recommendMaterial, uploadFileImg, userAffixText, userOutNetSearch, userUploadDocument, userUploadPdf, userUploadedList } from '@/api/search';
const zhCN = require('antd/lib/locale/zh_CN').default;
import { Button, Drawer, Input } from 'antd';

const { Search } = Input;
import Send from '../../../../public/send.svg'
import Sends from '../../../../public/send2.svg'
import { DownOutlined, EnterOutlined, EyeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import Viewer from 'react-viewer';

function MaterialTool({ onInserContent, replaceContent, AiEditorHtml }: any) {
    interface DataType {
        key?: string | any;
        name?: string;
        address?: string;
        uploadTime?: string;
        type?: string;
        size?: number | string; // 文件大小
        url?: string;
        content?: string;
        text_content?: string;
        title?: string;
    }
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
    // 弹窗的显示隐藏
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 弹窗的内容
    const [modalContent, setModalContent] = useState('');
    const [open, setOpen] = useState(false);

    let contentRef = useRef<any>(null)
    let [currIndex, setCurrIndex] = useState('1')
    const [scrollPosition, setScrollPosition] = useState(0);
    let uploadFileRef = useRef<any>(null)
    let uploadImgRef = useRef<any>(null)
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        // top: scrollPosition
        // padding: ,
        // overflow: 'auto',
        // background: token.colorFillAlter,
        // border: 'none',
        // borderRadius: token.borderRadiusLG,
    };
    let [myMaterialData, setMyMaterialData] = useState({ MaterialList: [], loaddingMaterial: false, mySearchValue: '', currPage: 1, pageSize: 10, total: 0 })
    let [fileModalOpen, setFileModalOpen] = useState(false)
    let [prog, setProg] = useState(10)
    // 上传的数据
    let [uploadData, setUploadData] = useState<any>({ loaddingShow: true, img: '', name: '', status: '上传中', progShow: true, modalTitle: '上传记录', uploadList: [], options: [], recordList: [], SelectValue: '全部', text: '', searchValue: '', textCopyShow: false, addTextTitle: '', lookImgShow: false, lookImgUrl: '' })
    // // 编辑器的数据
    // let [AiEditorData, setAiEditorData] = useState({ modals: false, imageShow: false, imageUrl: '', content: '', item: '' })
    // 保存纯文本
    let [isModalText, setisModalText] = useState(false)
    // 搜索的数据
    let [searchData, setsearchData] = useState({ begin: false, sourceData: [], sanswerData: [], loaddingShow: false, lastData: [], searchTitle: '', results: '' })
    // 推荐素材的数据
    let [suggestData, setSuggestData] = useState({ suggestLoadding: true, suggestList: [], EmptyText: '暂无推荐' })
    useEffect(() => {
        recommendMaterial({ content: AiEditorHtml }).then((res: any) => {

            if (!AiEditorHtml) {
                message.warning('文章内容为空')
                return setSuggestData((prev: any) => ({
                    ...prev,
                    suggestLoadding: false,
                    suggestList: null,
                    EmptyText: '暂无推荐数据'
                }))
            }
            if (res.data.status.code === 200) {
                setSuggestData((prev: any) => ({
                    ...prev,
                    suggestLoadding: false,
                    suggestList: res.data.filtered_results
                }))
            }

            else if (res.data.status.code === 500) {
                message.error('内容存在敏感词')
                setSuggestData((prev: any) => ({
                    ...prev,
                    suggestLoadding: false,
                    suggestList: null,
                    EmptyText: '内容存在敏感词'
                }))
            }


        }).catch((err) => {
            message.error(err)

        })
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
                console.log('页面可见');
                handleAllMateroal()
            }
        };

        // 添加事件监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 清理函数 - 当组件卸载时移除事件监听器
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };

    }, [])
    // useEffect(() => {
    //     console.log(suggestData);

    // }, [suggestData])
    useEffect(() => {

        const handleScroll = () => {
            setOpen(false);
            if (contentRef.current) {
                setScrollPosition(contentRef.current.scrollTop);
            }
        };

        const scrollableElement = contentRef.current;
        if (scrollableElement) {
            scrollableElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollableElement) {
                scrollableElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [contentRef.current]);
    // 封装文件类型方法
    let getDocumetType = (data: string) => {
        let type = ''
        switch (data) {
            case 'txt':
                return type = '纯文本'
                break;
            case 'docx':
                return type = '文档'
                break;
            case 'pdf':
                return type = 'pdf文档'
                break;
            case 'image':
                return type = '图片'
                break;
            default:
                break;
        }
    }
    // 点击搜索
    let handleSearch = (key: any) => {
        setPages(1)
        setEmpty(false)
        setOpen(false);

        getSearchFilter({ search_title: key, limit: pageSizes, page: pages }).then((res) => {
            // console.log(res);
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
        setOpen(false);
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

    // 点击打开弹窗
    let handleOpen = (item: any) => {
        // console.log(item);
        setModalContent(item.content)

        setOpen(true);
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
        setOpen(false);
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
        setOpen(false);
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
    // 关闭抽屉
    const onClose = () => {
        setOpen(false);
    };
    // 插入替换内容
    let handleInsertion = (item: any) => {
        console.log();

        onInserContent(item.content)

    }
    // 替换所有内容
    let handleReplace = (item: any) => {
        replaceContent(item.content)
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
        }).catch((error) => {
            message.error(error)
        })

    }
    // 公共素材搜索
    let onPublicSearch = (key: string) => {
        console.log(key);

    }
    // 我的素材
    const columns: TableColumnsType<DataType> = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '60%',
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: '20%',
        },
        // {
        //     title: '上传时间',
        //     dataIndex: 'uploadTime',
        //     width: '30%',
        // },
        // {
        //     title: '文件权限',
        //     dataIndex: 'address',
        // },
        {
            title: '操作',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => {
                        if (record.type === '纯文本') {
                            setisModalText(true)

                            setUploadData((prev: any) => ({
                                ...prev,
                                addTextTitle: record.title,
                                text: record.text_content,
                                textCopyShow: true,
                            }))
                        }
                        else if (record.type === '图片') {
                            console.log(record);
                            setUploadData((prve: any) => ({
                                ...prve,
                                lookImgUrl: record.url,
                                lookImgShow: true
                            }))
                        }
                        else {
                            window.open(`/lookfile/${record.key}`, '_blank');
                        }
                    }}>预览</a>
                    {/* <a>修改</a> */}
                    {/* <a onClick={() => {
                        onInserContent(record.content)
                    }}>插入</a> */}
                </Space>
            ),
        },
    ];
    // 个人素材和公共素材搜索
    let onMySearch = (key: string) => {
        setMyMaterialData((prve: any) => ({
            ...prve,
            loaddingMaterial: false,
        }))
        if (currIndex === '3') {
            lookPublicMaterial({ search_title: key, material_type: '4' }).then((res) => {
                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        // type: item.material_type === 'txt' ? '纯文本' : '文档',
                        text_content: item.text_content,
                        title: item.title
                    })
                })

                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    loaddingMaterial: true,
                    total: res.data.data.total
                }))
            }).catch((err) => {
                console.log(err);
            })
        }
        else if (currIndex === '4') {
            editMyMaterial({ search_title: key }).then((res) => {
                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        // type: item.material_type === 'txt' ? '纯文本' : '文档',
                        text_content: item.text_content,
                        title: item.title
                    })
                })

                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    loaddingMaterial: true,
                    total: res.data.data.total
                }))
            }).catch((err) => {
                console.log(err);
            })
        }

    }
    // 获取我的所有素材
    let handleAllMateroal = () => {
        setMyMaterialData((prve: any) => ({
            ...prve,
            currPage: 1,

        }))
        if (currIndex === '3') {
            lookPublicMaterial({ material_type: '4' }).then((res) => {
                // console.log(res.data.data);
                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {

                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        // type: item.material_type === 'txt' ? '纯文本' : '文档',
                        text_content: item.text_content,
                        title: item.title
                    })
                })


                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    loaddingMaterial: true,
                    total: res.data.data.total,

                }))
            }).catch((err) => {
                console.log(err);
            })
        }
        else if (currIndex === '4') {
            editMyMaterial({}).then((res) => {
                // console.log(res.data.data);
                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        text_content: item.text_content,
                        title: item.title
                    })
                })


                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    loaddingMaterial: true,
                    total: res.data.data.total,

                }))
            }).catch((err) => {
                console.log(err);
            })
        }

    }
    // 我的素材分页
    let handleOnChange = (page: any, pageSize: any) => {


        if (currIndex === '4') {

            editMyMaterial({ page: page, limit: pageSize, }).then((res) => {
                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        url: item.url,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        text_content: item.text_content,
                        title: item.title
                    })
                })
                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    currPage: page,
                }))

            }).catch((error) => {
                message.error(error)
            })
        }
        else if (currIndex === '3') {
            lookPublicMaterial({ page: page, limit: pageSize, material_type: '4' }).then((res) => {
                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        url: item.url,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        text_content: item.text_content,
                        title: item.title
                    })
                })
                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    currPage: page,
                }))

            }).catch((error) => {
                message.error(error)
            })
        }


    }
    //    搜索素材的事件
    let onSearchMaterial = (key: string) => {

        setsearchData((prve: any) => ({
            ...prve,
            begin: true,
            loaddingShow: false,
            searchTitle: `${key}的总结答案`
        }))
        userOutNetSearch({ content: key }).then((res) => {

            setsearchData((prve: any) => ({
                ...prve,
                sourceData: res.data.filtered_results,
                loaddingShow: true,
                // sanswerData: res.data.filtered_results.filter((item: any) => item.media === ''),
                results: res.data.results
            }))


        }).catch((err) => {

        }).finally(() => {

        })
    }

    const tabDada: TabsProps['items'] = [
        {

            key: '1',
            label: <div className={currIndex === '1' ? styles.search_tab_item_active : ''}>推荐素材</div>,
            children: <div className={styles.materialTool_suggest}>
                {
                    suggestData.suggestLoadding ? <div className={styles.suggest_loadding}><Spin size="large" /></div> :
                        <div className={styles.suggest_content}>
                            {
                                suggestData.suggestList ? suggestData.suggestList.map((item: any, index) => {
                                    return <div className={styles.suggest_content_item} key={item.title}>
                                        <a className={styles.suggest_content_link} href={item.link} target="_blank" rel="noopener noreferrer"> {item.title}</a>
                                        <div className={styles.suggest_content_content}>{item.content}</div>
                                        <div style={{ display: 'flex' }} >
                                            <div style={{ width: '80%', height: '100%' }}></div>

                                        </div>
                                    </div>
                                }) : <Empty description={suggestData.EmptyText} />
                            }

                        </div>
                }
            </div>
        },
        {
            key: '2',
            label: <div className={currIndex === '2' ? styles.search_tab_item_active : ''}>搜索素材</div>,
            children: <div className={styles.materialTool_searchs}>
                <Search className={styles.search_input} placeholder="请输入关键词" onSearch={onSearchMaterial} enterButton />
                {
                    searchData.begin ? <>
                        {
                            searchData.loaddingShow ? <>

                                <div className={styles.search_classify} onClick={() => {

                                }}>总结生成答案</div>
                                <div className={styles.search_sanswer}>
                                    <div className={styles.search_source_content}>{searchData.results}</div>
                                    <div style={{ display: 'flex' }} >
                                        <div style={{ width: '80%', height: '100%' }}></div>
                                        <div className={styles.search_source_icon}>
                                            <Tooltip title="加入我的素材">
                                                <PlusOutlined onClick={() => {
                                                    setisModalText(true)
                                                    setUploadData((prve: any) => ({
                                                        ...prve,
                                                        text: searchData.results,
                                                        addTextTitle: searchData.searchTitle
                                                    }))
                                                }} />
                                            </Tooltip>
                                            <Tooltip title="插入编辑器">
                                                <EnterOutlined onClick={() => {
                                                    onInserContent(searchData.results)
                                                }} />
                                            </Tooltip>
                                        </div>
                                    </div>

                                </div>
                                <div className={styles.search_classify}>数据源</div>
                                <div className={styles.search_source}>

                                    {
                                        searchData.sourceData.map((item: any, index: number) => {
                                            return <div key={index} style={{}} className={styles.search_source_item}>
                                                <div className={styles.search_source_media}>{item.media}</div>
                                                <a className={styles.search_source_link} href={item.link} target="_blank" rel="noopener noreferrer"> {item.title}</a>
                                                <div className={styles.search_source_content}>{item.content}</div>
                                                <div style={{ display: 'flex' }} >
                                                    <div style={{ width: '80%', height: '100%' }}></div>
                                                    <div className={styles.search_source_icon}>
                                                        <Tooltip title="加入我的素材">
                                                            <PlusOutlined onClick={() => {
                                                                setisModalText(true)
                                                                console.log(item);

                                                                setUploadData((prve: any) => ({
                                                                    ...prve,
                                                                    text: item.content,
                                                                    addTextTitle: item.title
                                                                }))
                                                            }} />
                                                        </Tooltip>
                                                        <Tooltip title="插入编辑器">
                                                            <EnterOutlined onClick={() => {
                                                                onInserContent(item.content)
                                                            }} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </> : <div style={{ width: '100%', height: '33vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>
                        }


                    </>

                        : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '92%', }}>还没开始搜索</div>
                }


            </div>,
        },
        {
            key: '3',
            label: <div className={currIndex === '3' ? styles.search_tab_item_active : ''}>公共素材</div>,
            children: <div className={styles.materialTool_searchs} ref={contentRef}>
                {/* 搜索框 */}

                <Search className={styles.search_input} placeholder="请输入关键词" onSearch={onMySearch} enterButton />
                <Table style={{ marginTop: '10px' }} size='small' columns={columns} dataSource={myMaterialData.MaterialList} pagination={{
                    current: myMaterialData.currPage,
                    pageSize: myMaterialData.pageSize,
                    total: myMaterialData.total,
                    onChange: handleOnChange,
                }}
                    components={{
                        header: {
                            cell: (props: any) => (
                                <th
                                    {...props}
                                    style={{ fontWeight: 400 }}
                                    className={styles.material_table_header} // 添加自定义样式类
                                />
                            ),
                        },
                    }}
                />

            </div>,
        },

        {
            key: '4',
            label: <div className={currIndex === '4' ? styles.search_tab_item_active : ''}>我的素材</div>,
            children: <div className={styles.materialTool_searchs}>
                {
                    myMaterialData.loaddingMaterial ? <>
                        <Search className={styles.search_input} placeholder="请输入关键词" onSearch={onMySearch} enterButton onChange={(e) => {
                            setMyMaterialData((prve: any) => ({
                                ...prve,
                                mySearchValue: e.target.value
                            }))
                        }} value={myMaterialData.mySearchValue} />

                        <Table style={{ marginTop: '10px' }} size='small' columns={columns} dataSource={myMaterialData.MaterialList} pagination={{
                            current: myMaterialData.currPage,
                            pageSize: myMaterialData.pageSize,
                            total: myMaterialData.total,
                            onChange: handleOnChange,
                        }}
                            components={{
                                header: {
                                    cell: (props: any) => (
                                        <th
                                            {...props}
                                            style={{ fontWeight: 400 }}
                                            className={styles.material_table_header} // 添加自定义样式类
                                        />
                                    ),
                                },
                            }}
                        />

                    </> : <div style={{ height: '30vw', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>
                }

            </div>,
        },
        {
            key: '5',
            label: <div className={currIndex === '5' ? styles.search_tab_item_active : ''}>金句素材</div>,
            children: <div className={styles.materialTool_searchs} ref={contentRef}>
                {/* 搜索框 */}

                <Search className={styles.search_input} placeholder="请输入关键词" onSearch={handleSearch} enterButton />

                {/* 分类 */}
                <div className={styles.materialTool_classify}  >
                    类别：   <span className={classIndex === -1 ? styles.search_class_list_item_active : styles.search_class_list_item} onClick={handleAll}>全部</span>{
                        classData.map((item: any, index) => {
                            return <span className={classIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassChildren(item, index) }}>{item.name}</span>
                        })
                    }
                    {
                        classShow ?
                            <div className={styles.search_class_level} >
                                分类：{
                                    classLevel.map((item: any, index) => {
                                        return <span className={classLevelIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassLevel(item, index) }}>{item.name}</span>
                                    })
                                }
                            </div> : ''
                    }
                </div >
                {/* 内容 */}
                < div className={styles.materialTool_context} style={containerStyle}>
                    {
                        classContext.length > 0 ? classContext?.map((item: any, index: number) => {
                            return <div key={index} className={styles.materialTool_context_item} onClick={() => { handleOpen(item) }}>

                                <div className={styles.materialTool_context_item_text}> {item.content} </div>
                                <div className={styles.materialTool_context_item_button}>  <Button type="primary" size="small" onClick={() => { handleInsertion(item) }}>插入替换</Button>
                                    <Button size="small" onClick={() => { handleReplace(item) }}>替换全部</Button></div>
                            </div>
                        }) : <Empty description='暂无数据' />
                    }


                    <div>
                    </div>
                </div>
                {/* 分页 */}
                < div className={styles.materialTool_pagination} >
                    <ConfigProvider locale={zhCN}>
                        <Pagination
                            align={'center'}
                            size="small"
                            total={totality}
                            // showSizeChanger
                            // showQuickJumper
                            current={currPage}
                            // pageSize={pageSizes}
                            // defaultCurrent={pages}
                            // showTotal={(total) => `共 ${total} 条`}
                            onChange={handlePage}
                        />  </ConfigProvider>

                </div >
            </div>,
        },

    ];
    const onTabChange = (key: string) => {
        setMyMaterialData((prve: any) => ({
            ...prve,
            MaterialList: [],
            loaddingMaterial: false,
            currPage: 1
        }))
        if (key === '5') {
        }
        else if (key === '3') {
            lookPublicMaterial({ material_type: '4' }).then((res) => {
                // console.log(res.data.data);

                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        text_content: item.text_content,
                        title: item.title
                    })
                })


                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    loaddingMaterial: true,
                    total: res.data.data.total,

                }))
            }).catch((err) => {
                console.log(err);
            })
        }
        else if (key === '4') {
            editMyMaterial({}).then((res) => {
                // console.log(res.data.data);

                const data: DataType[] = [];
                res.data.data.data.map((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        content: item.html_content,
                        type: getDocumetType(item.material_type),
                        text_content: item.text_content,
                        title: item.title
                    })
                })


                setMyMaterialData((prve: any) => ({
                    ...prve,
                    MaterialList: data,
                    loaddingMaterial: true,
                    total: res.data.data.total,

                }))
            }).catch((err) => {
                console.log(err);
            })
        }
        setCurrIndex(key)
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
                // {
                //     key: '1-2',
                //     label: <div onClick={() => {
                //         if (uploadImgRef.current) {
                //             uploadImgRef.current?.click()
                //         }
                //     }}>上传图片</div>,
                // },
            ],
        },
        // {
        //     key: '2',
        //     label: '从外部链接添加',

        // },
        {
            key: '3',
            label: <div onClick={() => { setisModalText(true) }}>新增粘贴纯文本</div>,
        },

    ];
    // 获取所有上传的数据
    // let handleMyAllUploadData = () => {
    //     // getUserMaterialTypes()
    //     getAllUploadMaterial({}).then((res) => {
    //         // console.log(res, '全部');
    //         if (res.status === 200) {
    //             setUploadData((prve: any) => ({
    //                 ...prve,
    //                 uploadList: res.data.data.data
    //             }))
    //         }
    //     }).catch((err) => {

    //     })


    // }
    const data = [
        {
            title: 'Ant Design Title 1',
        },
    ];
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
    // 点击保存
    let handleTextOk = () => {
        let id = uuidv4()
        userAffixText({ uploaded_files_id: id, text: uploadData.text, title: uploadData.addTextTitle }).then((res) => {
            // console.log(res);
            if (res.data.status.code === 200) {
                message.success('保存成功,可在我的素材中查看')
                setisModalText(false)
                handleAllMateroal()
            }
        }).catch((error) => {
            message.error(error)
        })
        setUploadData((prev: any) => ({
            ...prev,
            text: '',
            addTextTitle: '',
        }))
    }
    return (
        <div className={styles.materialTool_body} >

            <Tabs defaultActiveKey="1" items={tabDada} onChange={onTabChange} tabBarGutter={10} />
            {/* {

                currIndex === '4' ? <div className={styles.materialTool_add}><Dropdown placement="bottomRight" menu={{ items }}>

                    <Button type="primary" size="small"><PlusOutlined />新增素材</Button>
                </Dropdown></div> : ''
            } */}
            <div style={{ display: 'none' }}>
                <input type="file" ref={uploadFileRef} accept=".txt,.docx,.pdf,.txt" onChange={handleFileChange} />
                <input type="file" ref={uploadImgRef} accept=".pjp,.jpg,.pjpe,.jpg,.png" onChange={handleFileChange} />
            </div>
            {/* 上传列表的弹窗 */}
            <Modal title={uploadData.modalTitle} footer={false} open={fileModalOpen} onCancel={() => {
                setFileModalOpen(false); setUploadData((prve: any) => ({
                    ...prve,
                    progShow: true,
                    status: '上传中',
                    loaddingShow: true
                }))
                setProg(10)

                handleAllMateroal()
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
            <Modal title={searchData.searchTitle} open={isModalText} footer={null} onCancel={() => {
                setisModalText(false);
                setUploadData((prve: any) => ({
                    ...prve,
                    textCopyShow: false,
                    text: '',
                    addTextTitle: '',
                }))

            }} >
                <div className={styles.textModalTitle}>
                    <div>标题：</div>
                    <Input.TextArea placeholder='请输入标题' value={uploadData.addTextTitle} onChange={(e) => {
                        setUploadData((prve: any) => ({
                            ...prve,
                            addTextTitle: e.target.value
                        }))
                    }}></Input.TextArea>
                </div>
                <div className={styles.textModalTitle}>
                    <div>文本:</div>
                    <Input.TextArea showCount maxLength={1000} placeholder='请输入' value={uploadData.text} onChange={(e) => {
                        setUploadData((prve: any) => ({
                            ...prve,
                            text: e.target.value
                        }))
                    }} style={{ height: 220, }} />

                </div>

                <div className={styles.textModalBtn}>

                    {uploadData.textCopyShow ? <Button type="primary" onClick={() => {
                        navigator.clipboard.writeText(uploadData.text)
                        message.success('复制成功')
                    }}>复制</Button> : <Button type="primary" onClick={handleTextOk}>保存</Button>}
                </div>
                {/*                 
                <Input.TextArea showCount maxLength={1000} placeholder='请输入' value={uploadData.text} onChange={(e) => {
                    setUploadData((prve: any) => ({
                        ...prve,
                        text: e.target.value,

                    }))
                }} style={{ height: 220, resize: 'none' }} /> */}


            </Modal>

            <Viewer
                onClose={() => { setUploadData((prev: any) => ({ ...prev, lookImgShow: false })) }}
                visible={uploadData.lookImgShow}
                images={[{ src: uploadData.lookImgUrl, alt: "Example Image" }]}

            />
            {contextHolder}
        </div>
    )
}

export default MaterialTool
