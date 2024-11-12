

import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { delUploadMaterial, getAllUploadMaterial, lookPublicMaterial, uploadFileImg, userAffixText, userUploadDocument, userUploadPdf } from '@/api/search';
import { CloudUploadOutlined, InfoCircleFilled, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Space, Table, TableColumnsType, Tabs, TabsProps, Row, Col, Input, Button, Modal, Form, FormProps, UploadProps, message, Switch } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import Dragger from 'antd/es/upload/Dragger';
import { v4 as uuidv4 } from 'uuid';

import Viewer from 'react-viewer';
const { Search } = Input;
const index: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    let [uploadData, setUploadData] = useState<any>({ currTable: '1', allData: [], currPage: '1', pageSize: '10', total: '', ModalOpen: false, fileModalOpen: false, uploadName: '', delModalOpen: false, delKey: '', footerShow: false, lookImgUrl: '', lookImgShow: false, text: '', isModalText: false, addTextTitle: '', textCopyShow: false, textarea: '允许导入markdown、doc、docx、xlsx、xls、csv、pdf、txt格式文件。' });
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                getUploadData(uploadData.currTable)
            }
        };
        // 添加事件监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 清理函数 - 当组件卸载时移除事件监听器
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };

    }, [uploadData.currTable])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // let [imgData, setImgData] = useState({ allImgData: [] })
    const [form] = Form.useForm();
    interface DataType {
        key: React.Key;
        name: string;
        address: string;
        uploadTime: string;
        type?: string;
        size?: number | string; // 文件大小
        url?: string;
        text_content?: string;
        title?: string;
        authority?: any;
        src_from?: string;
    }
    type FieldType = {
        MaterialFile?: string;
        password?: string;
        FileName?: string;
    };
    // 文档图片纯文本切换
    const onChange = (key: string) => {
        setUploadData((prve: any) => ({
            ...prve,
            currTable: key,
            currPage: 1
        }))
        if (key === '1') {
            setUploadData((prve: any) => ({
                ...prve,
                textarea: '允许导入markdown、doc、docx、xlsx、xls、csv、pdf、txt格式文件。'
            }))
        }
        else if (key === '2') {
            setUploadData((prve: any) => ({
                ...prve,
                textarea: '允许导入jpg、jpeg、png、gif、bmp、webp格式文件。'
            }))
        }


        getUploadData(key)
    };
    // 开关变化
    let onSwitchChange = () => {
        console.log('开关变化');
    }
    // 获取全部
    let getUploadData = (type: any, title?: string) => {
        lookPublicMaterial({ material_type: type, search_title: title }).then((res) => {
            // console.log(res);

            if (res.status === 200) {
                const data: DataType[] = [];
                res.data.data.data.forEach((item: any) => {
                    data.push({
                        key: item.id,
                        name: item.title,
                        uploadTime: item.created_at,
                        address: item.url,
                        type: item.material_type,
                        size: item.file_size + 'KB',
                        url: item.url,
                        text_content: item.text_content,
                        title: item.title,
                        src_from:item.src_from
                        // authority: < div><Switch defaultChecked onChange={onSwitchChange} /> 私密</div >
                    })
                })

                setUploadData((prve: any) => ({
                    ...prve,
                    allData: data,
                    total: res.data.data.total
                }))
            }

        }).catch((err) => {
            message.error(err)
        })
    }
    useEffect(() => {
        getUploadData(1)
    }, [])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };



    const columns: TableColumnsType<DataType> = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '30%',
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            width: '20%',
        },
        {
            title: '上传人',
            dataIndex: 'src_from',
            width: '15%',
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            width: '15%',
        },

        {
            title: '操作',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => {
                        if (uploadData.currTable === '2') {
                            setUploadData((prve: any) => ({
                                ...prve,
                                lookImgUrl: record.url,
                                lookImgShow: true
                            }))
                        }
                        else if (uploadData.currTable === '1') {
                            window.open(`/lookfile/${record.key}`, '_blank');
                        }
                        else if (uploadData.currTable === '3') {
                            // console.log(record)
                            setUploadData((prve: any) => ({
                                ...prve,
                                isModalText: true,
                                addTextTitle: record.title,
                                text: record.text_content,
                                textCopyShow: true
                            }))
                        }

                    }}>预览</a>
                    {/* <a>修改</a> */}
                    {/* <a onClick={() => {
                        setUploadData((prve: any) => ({
                            ...prve,
                            delModalOpen: true,
                            delKey: record.key
                        }))

                    }}>删除</a> */}
                </Space>
            ),
        },
    ];
    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };
    // 分页
    let handleOnChange = (page: any, pageSize: any) => {
        lookPublicMaterial({ page: page, limit: pageSize, material_type: uploadData.currTable }).then((res) => {
            const data: DataType[] = [];
            res.data.data.data.map((item: any) => {
                data.push({
                    key: item.id,
                    name: item.title,
                    uploadTime: item.created_at,
                    address: item.url,
                    type: item.material_type,
                    size: item.file_size + 'KB',
                    url: item.url,
                    text_content: item.text_content,
                    title: item.title,
                    src_from:item.src_from
                    // authority: < div><Switch defaultChecked onChange={onSwitchChange} /> 私密</div >
                })
            })
            setUploadData((prve: any) => ({
                ...prve,
                allData: data,
                currPage: page
            }))

        }).catch((error) => {
            message.error(error)
        })

    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <div className={uploadData.currTable === '1' ? styles.active : ''}>文档素材</div>,
            children: <>
                <Table size="large" rowSelection={rowSelection} columns={columns} dataSource={uploadData.allData} pagination={{
                    current: uploadData.currPage,
                    pageSize: uploadData.pageSize,
                    total: uploadData.total,
                    onChange: handleOnChange,
                }} />
            </>,
        },
        {
            key: '2',
            label: <div className={uploadData.currTable === '2' ? styles.active : ''}>图片素材</div>,
            children: <>
                <Table size="large" rowSelection={rowSelection} columns={columns} dataSource={uploadData.allData} pagination={{
                    current: uploadData.currPage,
                    pageSize: uploadData.pageSize,
                    total: uploadData.total,
                    onChange: handleOnChange,
                }} />
            </>,
        },
        {
            key: '3',
            label: <div className={uploadData.currTable === '3' ? styles.active : ''}>纯文本素材</div>,
            children: <>
                <Table size="large" rowSelection={rowSelection} columns={columns} dataSource={uploadData.allData} pagination={{
                    current: uploadData.currPage,
                    pageSize: uploadData.pageSize,
                    total: uploadData.total,
                    onChange: handleOnChange,
                }} />
            </>,
        },

    ];



    const handleCancel = () => {
        setUploadData((prve: any) => ({
            ...prve,
            ModalOpen: false
        }))
        getUploadData(uploadData.currTable)
    };
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values);
                setUploadData((prve: any) => ({
                    ...prve,
                    ModalOpen: false
                }))
                getUploadData(uploadData.currTable)
            })
            .catch((errorInfo) => {
                onFinishFailed(errorInfo);
            });

    };
    // 上传
    const props: UploadProps = {
        accept: '.word, .docx, .pdf,.txt',
        // name: 'file',
        // multiple: true,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {

            // return
            const formData = new FormData();
            let token: any = localStorage.getItem('token')
            formData.append('file', info.file.originFileObj);
            const id = uuidv4();
            formData.append('uploaded_files_id', id);
            formData.append('token', token);

            const { status } = info.file;
            if (status !== 'uploading') {

                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setUploadData((prev: any) => ({
                    ...prev,
                    footerShow: true
                }))
                if (info.file.type === 'application/pdf') {
                    userUploadPdf(formData).then((res) => {
                        if (res.data.status.code === 200) {
                            message.success(`${info.file.name} 解析成功`);
                            setUploadData((prev: any) => ({
                                ...prev,
                                footerShow: false
                            }))
                        }
                    }).catch((error) => {
                        message.error(error)
                    })
                }
                else {
                    userUploadDocument(formData).then((res) => {
                        if (res.data.status.code === 200) {
                            message.success(`${info.file.name} 解析成功`);
                            setUploadData((prev: any) => ({
                                ...prev,
                                footerShow: false
                            }))
                        }
                    }).catch((error) => {
                        message.error(error)
                    })

                }

                form.setFieldsValue({ FileName: info.file.name });

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const propsImg: UploadProps = {
        accept: ".pjp,.jpg,.pjpe,.jpg,.png",
        // name: 'file',
        // multiple: true,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const formData = new FormData();
            let token: any = localStorage.getItem('token')
            formData.append('file', info.file.originFileObj);
            const id = uuidv4();
            formData.append('uploaded_files_id', id);
            formData.append('token', token);

            const { status } = info.file;
            if (status !== 'uploading') {

                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setUploadData((prev: any) => ({
                    ...prev,
                    footerShow: true
                }))
                uploadFileImg(formData).then((res) => {
                    if (res.data.status.code === 200) {
                        message.success(`${info.file.name} 解析成功`);
                    }
                    setUploadData((prev: any) => ({
                        ...prev,
                        footerShow: false
                    }))
                    form.setFieldsValue({ FileName: info.file.name });

                }).catch((error) => {
                    message.error(error)
                })


            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    };
    // 搜索
    let onSearch = (value: string) => {
        // console.log(value);
        if (!value) return message.warning('请输入关键字')
        getUploadData(uploadData.currTable, value)
    }
    // 纯文本保存
    let handleTextOk = () => {
        let id = uuidv4()
        userAffixText({ uploaded_files_id: id, text: uploadData.text, title: uploadData.addTextTitle }).then((res) => {
            // console.log(res);
            if (res.data.status.code === 200) {
                message.success('保存成功,可在我的素材中查看')
                setUploadData((prev: any) => ({
                    ...prev,
                    text: '',
                    addTextTitle: '',
                    isModalText: false
                }))
            }
        }).catch((error) => {
            message.error(error)
        })
        getUploadData(uploadData.currTable)
    }
    return (
       
            <>
                <Row style={{ padding: '10px 0' }}>
                    <Col span={6}>
                        <Search placeholder="请输入关键字" onSearch={onSearch} enterButton />
                    </Col>
                    {/* <Col span={2} push={16}>
                        <Button type="primary" onClick={() => {
                            if (uploadData.currTable === '3') {
                                setUploadData((prve: any) => ({
                                    ...prve,
                                    isModalText: true
                                }))
                            }
                            else {
                                setUploadData((prve: any) => ({
                                    ...prve,
                                    ModalOpen: true
                                }))
                                form.setFieldsValue({ FileName: '' });
                            }

                        }}><PlusOutlined />新增</Button>
                    </Col> */}
                </Row >
                <Row>

                    <Col span={24}>
                        <Tabs defaultActiveKey={uploadData.currTable} items={items} onChange={onChange} />
                    </Col>
                </Row>

                {/* 上传弹窗 */}
                <Modal title="添加文档素材信息" width={450} open={uploadData.ModalOpen} onOk={handleOk} onCancel={handleCancel}
                >
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="素材文件"
                            name="MaterialFile"
                        >
                            <Button size='small' className={styles.uploadBtn} onClick={() => {
                                setUploadData((prve: any) => ({
                                    ...prve,
                                    fileModalOpen: true
                                }))
                            }}><UploadOutlined />导入</Button>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="文件名称"
                            name="FileName"
                            rules={[{ required: true, message: '写作方式不能为空' }]}
                        >
                            <Input placeholder='请输入文件名称' defaultValue={uploadData.uploadName} value={uploadData.uploadName} />
                        </Form.Item>

                    </Form>
                    <Modal title="文件导入" width={400} open={uploadData.fileModalOpen} onOk={() => {

                    }} onCancel={() => {
                        setUploadData((prve: any) => ({
                            ...prve,
                            fileModalOpen: false
                        }))
                    }}

                        footer={[
                            <Button key="back" onClick={() => {
                                setUploadData((prve: any) => ({
                                    ...prve,
                                    fileModalOpen: false
                                }))
                            }}>
                                取消
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => {
                                    setUploadData((prve: any) => ({
                                        ...prve,
                                        fileModalOpen: false
                                    }))
                                }}
                                disabled={uploadData.footerShow}
                            >
                                确定
                            </Button>
                        ]}>
                        {
                            uploadData.currTable === '1' ? <Dragger {...props}>
                                <div style={{ padding: '20px' }}>
                                    {/* transform: 'scale(4)', */}
                                    <CloudUploadOutlined style={{ fontSize: '50px', color: '#ccc' }} />
                                    <div style={{ paddingTop: '20px' }}>将模板拖到此处，或<span style={{ color: '#1E5EFF', }}>点击上传</span></div>
                                </div>
                            </Dragger> : <Dragger {...propsImg}>
                                <div style={{ padding: '20px' }}>
                                    {/* transform: 'scale(4)', */}
                                    <CloudUploadOutlined style={{ fontSize: '50px', color: '#ccc' }} />
                                    <div style={{ paddingTop: '20px' }}>将模板拖到此处，或<span style={{ color: '#1E5EFF', }}>点击上传</span></div>
                                </div>
                            </Dragger>
                        }


                        <div style={{ paddingTop: '10px', color: '#999', width: '100%', textAlign: 'center', fontSize: '12px' }}>{uploadData.textarea}</div>

                    </Modal>

                </Modal>
                <Modal title="系统提示" width={300} open={uploadData.delModalOpen} onCancel={() => {
                    setUploadData((prve: any) => ({
                        ...prve,
                        delModalOpen: false
                    }))
                }} onOk={() => {
                    delUploadMaterial({ materials_id: uploadData.delKey }).then((res) => {
                        if (res.status === 200) {
                            message.success('删除成功')

                            setUploadData((prve: any) => ({
                                ...prve,
                                delModalOpen: false
                            }))
                            getUploadData(uploadData.currTable)
                        }
                    }).catch((error) => {
                        message.error(error)
                    })

                }}>
                    <InfoCircleFilled size={20} style={{ color: '#f90', marginRight: '5px' }} />是否删除当前选中的数据项？
                </Modal>
                <Viewer
                    onClose={() => { setUploadData((prev: any) => ({ ...prev, lookImgShow: false })) }}
                    visible={uploadData.lookImgShow}
                    images={[{ src: uploadData.lookImgUrl, alt: "Example Image" }]}

                />
                {/* 纯文本的弹窗 */}
                <Modal title={'文本预览'} open={uploadData.isModalText} footer={null} onCancel={() => {

                    setUploadData((prve: any) => ({
                        ...prve,
                        textCopyShow: false,
                        text: '',
                        addTextTitle: '',
                        isModalText: false
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
                        }} style={{ height: 220, }} />

                    </div>

                    <div className={styles.textModalBtn}>

                        {uploadData.textCopyShow ? <Button type="primary" onClick={() => {
                            navigator.clipboard.writeText(uploadData.text)
                            message.success('复制成功')
                        }}>复制</Button> : <Button type="primary" onClick={handleTextOk}>保存</Button>}
                    </div>



                </Modal>

            </>
     
    );
};

export default index
