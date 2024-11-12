
// import { EditOutlined, FileDoneOutlined, } from '@ant-design/icons';
// import { PageContainer } from '@ant-design/pro-components';

// import { Col, Modal, Row, Tabs, TabsProps, message } from 'antd';
// import React, { useEffect, useState } from 'react';
// import styles from './index.less'
// import { history } from 'umi'
// import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
// import { useAppDispatch } from '@/redux/storeIndex';
// import { getTempletChildren, getTempletData } from '@/api/Templet';
// import { v4 as uuidv4 } from 'uuid';

// const Templet: React.FC = () => {
// let [contextHtml, setContextHtml] = useState('')
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [loading, setLoading] = React.useState<boolean>(true);
// let [templateData, setTemplateData] = useState({ classFiy: [], currKey: '1', classFiyChildren: [] })



// let dispatch = useAppDispatch()


// useEffect(() => {
//     const handleVisibilityChange = () => {
//         if (document.visibilityState === 'visible') {
//             // 当文档变为可见时刷新页面
//             localStorage.removeItem('templetsEdit')
//             // localStorage.removeItem('templetTitle')
//             localStorage.removeItem('templetChildren')
//         }
//     };

//     // 添加事件监听器
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // 清理函数 - 当组件卸载时移除事件监听器
//     return () => {
//         document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
// }, []);
// useEffect(() => {
//     if (history.location.pathname !== '/Addtext') {
//         dispatch(setComponentsType([]))
//         dispatch(sethistoryType([]))
//     }
//     dispatch(setisAddHistory(false))
// }, [history])

// useEffect(() => {
//     getTempletData().then((res) => {
//         if (res.data.status.code === 200) {
//             setTemplateData((prev: any) => ({
//                 ...prev,
//                 classFiy: res.data.data,
//                 currKey: res.data.data[0].category_id
//             }))
//             localStorage.setItem('templetTitle', JSON.stringify(res.data.data[0]))
//             getTempletChildren({ category_id: res.data.data[0].category_id }).then((res) => {

//                 if (res.data.status.code === 200) {
//                     setTemplateData((prev: any) => ({
//                         ...prev,
//                         classFiyChildren: res.data.records
//                     }))
//                 }

//             }).catch((error) => {
//                 message.error(error)
//             })
//         }
//     }).catch((error) => {
//         message.error(error)
//     })
// }, [])


// let handleCreate = (event: any, item: any) => {
//     event.stopPropagation()
//     localStorage.setItem('templetChildren', JSON.stringify(item))
//     const id = uuidv4();
//     window.open(`/LongTexts/${id}`, '_blank');

// }
// let handleEdits = (event: any, item: any) => {
//     event.stopPropagation()
//     const id = uuidv4();
//     window.open(`/LongTexts/${id}`, '_blank');
//     localStorage.setItem('templetsEdit', JSON.stringify(item))

// }
// const onChange = (key: string) => {
//     setTemplateData((prev: any) => ({
//         ...prev,
//         currKey: key
//     }))
//     let arr = templateData.classFiy.find((item: any) => {
//         return item.category_id === key
//     })

//     localStorage.setItem('templetTitle', JSON.stringify(arr))
//     getTempletChildren({ category_id: key }).then((res) => {
//         if (res.data.status.code === 200) {
//             setTemplateData((prev: any) => ({
//                 ...prev,
//                 classFiyChildren: res.data.records
//             }))
//         }
//     }).catch((error) => {
//         message.error(error)
//     })
// };
// const items: TabsProps['items'] = templateData.classFiy.map((itema: any, index: number) => {
//     return {
//         id: itema.category_id,
//         key: itema.category_id,
//         label: <div className={templateData.currKey === itema.category_id ? styles.active : styles.current} >{itema.name}</div>,
//         children: <Row gutter={24}>
//             {
//                 templateData.classFiyChildren.map((item: any, index: number) => {
//                     return <Col span={6} key={item.id}>
//                         <div className={styles.templet_item} onClick={() => { handleLook(item) }}>
//                             <div className={styles.templet_item_left}>
//                                 <div className={styles.templet_item_title}>{item.title}</div>

//                                 <div className={styles.templet_item_btn}>
//                                     {
//                                         item.applicable_types !== 4 ? <span style={{ marginRight: '10px', }} onClick={(event) => handleCreate(event, item)} ><FileDoneOutlined /> 帮我生成</span> : ''
//                                     }
//                                     <span onClick={(event) => { handleEdits(event, item) }}><EditOutlined /> 编辑</span>
//                                 </div>
//                             </div>

//                             <div><img src={img} alt="" width={'120px'} /></div>
//                         </div>

//                     </Col>
//                 })
//             }

//         </Row>
//     }
// })
// //   点击查看模版
// const handleLook = (item: any) => {
//     console.log(item.content_html);
//     setIsModalOpen(true);
//     setContextHtml(item.content_html)
//     // setContextTitle(item.title)
//     setTimeout(() => {
//         setLoading(false)
//     }, 1000)
// }
// const handleOk = () => {
//     setIsModalOpen(false);
// };

// const handleCancel = () => {
//     setIsModalOpen(false);
// };
// return (
//     <PageContainer
//     >
//         <div style={{ minHeight: 'calc(100vh - 23vh)', }}>
//             <Tabs
//                 onChange={onChange}
//                 type="line"
//                 tabBarGutter={20}
//                 items={items}
//                 defaultActiveKey='1'
//             />
//         </div>
//         <Modal open={isModalOpen} width={'80%'} loading={loading} onOk={handleOk} okText={'应用'} cancelText={'收藏'} footer={false} onCancel={handleCancel} style={{ padding: '1vw', overflow: 'hidden' }}>
//             {
//                 <div style={{ padding: '1vw', border: '1px solid #ccc', borderRadius: '1vw', marginTop: '1vw', overflow: 'auto', height: '80vh', userSelect: 'none', }} dangerouslySetInnerHTML={{ __html: contextHtml }} />
//             }
//         </Modal>
//     </PageContainer>
// );
// };

// export default Templet
// let img = 'data:image/png;base64,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'


import React, { useEffect, useState } from 'react';
import { FileText, Plus, Download, Eye, ArrowLeft } from 'lucide-react';
import TemplateUploader from './TemplateUploader';
import { PageContainer } from '@ant-design/pro-components';
import { getTempletChildren, getTempletData } from '@/api/Templet';
import { Input, message, Modal } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { EditOutlined } from '@ant-design/icons';
const { Search } = Input;

const DocumentTemplates: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('法定公文');
    const [showUploader, setShowUploader] = useState(false);

    let [contextHtml, setContextHtml] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    let [templateData, setTemplateData] = useState({ classFiy: [], currKey: '', classFiyChildren: [], searchText: '' })

    const handleUploadComplete = (template: { title: string; sections: any[] }) => {
        console.log('Template uploaded:', template);
        setShowUploader(false);
        // 这里应该添加模板到列表中
    };
    useEffect(() => {
        getTempletData().then((res) => {
            if (res.data.status.code === 200) {
                setTemplateData((prev: any) => ({
                    ...prev,
                    classFiy: res.data.data,
                    currKey: res.data.data[0].category_id
                }))
                localStorage.setItem('templetTitle', JSON.stringify(res.data.data[0]))
                getTempletChildren({ category_id: res.data.data[0].category_id }).then((res) => {

                    if (res.data.status.code === 200) {
                        setTemplateData((prev: any) => ({
                            ...prev,
                            classFiyChildren: res.data.records
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


    let handleCreate = (event: any, item: any) => {
        event.stopPropagation()
        localStorage.setItem('templetChildren', JSON.stringify(item))
        const id = uuidv4();
        window.open(`/LongTexts/${id}`, '_blank');

    }
    let handleEdits = (event: any, item: any) => {
        event.stopPropagation()
        const id = uuidv4();
        window.open(`/LongTexts/${id}`, '_blank');
        localStorage.setItem('tool', '1')
        localStorage.setItem('templetsEdit', JSON.stringify(item))
    }
    const onChange = (category: any) => {
        setSelectedCategory(category.name)
        setTemplateData((prev: any) => ({
            ...prev,
            currKey: category.category_id,
            searchText: ''
        }))
        let arr = templateData.classFiy.find((item: any) => {
            return item.category_id === category.category_id
        })

        localStorage.setItem('templetTitle', JSON.stringify(arr))
        getTempletChildren({ category_id: category.category_id }).then((res) => {
            if (res.data.status.code === 200) {
                setTemplateData((prev: any) => ({
                    ...prev,
                    classFiyChildren: res.data.records
                }))
            }
        }).catch((error) => {
            message.error(error)
        })
    };
    //   点击查看模版
    const handleLook = (item: any) => {
        setIsModalOpen(true);
        setContextHtml(item.content_html)
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
    // 搜索
    let onSearch = (value: string) => {
        console.log(templateData.currKey);
        if (!value) return message.warning('请输入关键字')
        getTempletChildren({ category_id: templateData.currKey, search_title: value }).then((res) => {

            if (res.data.status.code === 200) {
                setTemplateData((prev: any) => ({
                    ...prev,
                    classFiyChildren: res.data.records
                }))
            }
        }).catch((err) => {
            console.log(err);

        })

    }
    return (

        <PageContainer
        >
            <div className="container mx-auto px-4 py-4">
                {/* <h1 className="text-3xl font-bold mb-8">公文模板库</h1> */}

                <div className="mb-6 flex justify-between items-center">
                    <div className="relative w-64">
                        {/* <input
                            type="text"
                            placeholder="搜索模板..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                        <Search placeholder="请输入关键字" onSearch={onSearch} enterButton onChange={(e) => setTemplateData((prev: any) => ({
                            ...prev,
                            searchText: e.target.value
                        }))} value={templateData.searchText} />
                    </div>
                    {
                        !showUploader ? <div
                            onClick={() => setShowUploader(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center cursor-pointer"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            上传新模板
                        </div> : <div
                            onClick={() => setShowUploader(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            返回
                        </div>
                    }

                </div>

                {showUploader ? (
                    <div className="mb-6">
                        <TemplateUploader onUploadComplete={handleUploadComplete} />
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex space-x-4" >
                            {templateData.classFiy.map((category: any) => (
                                <div
                                    key={category.id}
                                    onClick={() => {
                                        onChange(category);
                                    }}
                                    className={`px-4 py-2 rounded-full cursor-pointer ${category.name === selectedCategory
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {category.name}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
                            {templateData.classFiyChildren.map((template: any) => (
                                <div key={template.id} className="bg-white rounded-lg shadow-md p-6" style={{ background: 'rgb(250, 251, 255)' }} >
                                    <div className="flex items-center mb-4">
                                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                                        <h3 className="text-lg font-semibold">{template.title}</h3>
                                    </div>
                                    {/* <p className="text-sm text-gray-500 mb-4">最后更新: {template.lastUpdated}</p> */}
                                    <p className="text-sm text-gray-500 mb-4">分类: {selectedCategory}</p>
                                    <div className="flex justify-between">
                                        <div className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800" onClick={() => { handleLook(template) }}>
                                            <Eye className="h-5 w-5 mr-1" />
                                            预览
                                        </div>
                                        {/* <div onClick={(event) => { handleEdits(event, template) }} className="flex items-center text-yellow-600 cursor-pointer hover:text-yellow-800" >
                                            <EditOutlined className="h-5 w-5 mr-1" />
                                            编辑
                                        </div> */}

                                        {/* {
                                            item.applicable_types !== 4 ?
                                        } */}
                                        <div className="flex items-center cursor-pointer text-green-600 hover:text-green-800" onClick={(e) => { handleCreate(e, template) }}
                                            style={{ visibility: template.applicable_types === 4 ? 'hidden' : 'visible' }}
                                        >
                                            <Download className="h-5 w-5 mr-1" />
                                            使用模板
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Modal open={isModalOpen} width={'80%'} loading={loading} onOk={handleOk} okText={'应用'} cancelText={'收藏'} footer={false} onCancel={handleCancel} style={{ padding: '1vw', overflow: 'hidden' }}>
                {
                    <div style={{ padding: '1vw', border: '1px solid #ccc', borderRadius: '1vw', marginTop: '1vw', overflow: 'auto', height: '80vh', userSelect: 'none', }} dangerouslySetInnerHTML={{ __html: contextHtml }} />
                }
            </Modal>
        </PageContainer>
    );
};

export default DocumentTemplates;