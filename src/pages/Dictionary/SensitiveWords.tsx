
import { PageContainer, } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { Button, GetProps, Input, Table, Col, Row, TableProps, TableColumnsType, Form, FormProps, message, Modal } from 'antd';
const { Search } = Input;
import { CheckCircleOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { addSensitiveList, getSensitiveList } from '@/api/Dictionary';
import NewTable from './components/NewTable';
type SearchProps = GetProps<typeof Input.Search>;
import NewModal, { FieldType } from './components/NewModal';

interface DataType {
    key: any;
    mistake_word: string;
    suggestion_word: string;
    address: string;
    exception_context: string;
    error_reason: string;
    reference_description: string;
    reference_link: string;
    added_time: string;

}


// 敏感词
const SensitiveWords: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    let [SensitiveWordsData, setSensitiveWordsData] = useState<any>({ currPage: 1, pageSize: 10, total: 0, currData: [], allData: [], checkedList: [], modalOpen: false, search_title: '' })
    let addRorm = useRef<any>(null)

    let handleSensitiveWordsList = (page: number, pageSize: number, value: string) => {
        getSensitiveList({ page: page, limit: pageSize, search_title: value }).then((res: any) => {
            console.log(res);
            if (res.data.status.code === 200) {
                let newRecords: any = []
                res.data.records.forEach((item: any) => {
                    newRecords.push({
                        key: item.id,
                        sensitive_word: item.sensitive_word,
                        sensitive_reason: item.sensitive_reason,

                        exception_context: item.exception_context,

                        reference_description: item.reference_description,
                        reference_link: item.reference_link,
                        added_time: item.added_time,
                    })
                })
                setSensitiveWordsData((prev: any) => ({
                    ...prev,
                    allData: newRecords,
                    total: res.data.total,
                }))
            }
        }).catch((err) => {
            console.log(err, 'error');
        })
    }
    useEffect(() => {

        handleSensitiveWordsList(SensitiveWordsData.currPage, SensitiveWordsData.pageSize, SensitiveWordsData.search_title)

    }, [])
    const columns: TableColumnsType<DataType> = [
        {
            title: '敏感词',
            dataIndex: 'sensitive_word',
        },
        {
            title: '敏感原因',
            dataIndex: 'sensitive_reason',
        },

        {
            title: '依据说明',
            dataIndex: 'reference_description',
        },
        {
            title: '依据链接',
            dataIndex: 'reference_link',
            render: (text) => {
                // 跳转新的页面
                return <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>
            }
        },
        {
            title: '添加时间',
            dataIndex: 'added_time',
        },
    ];

    // 分页
    let handleOnChange = (page: number, pageSize: number) => {
        setSensitiveWordsData((prev: any) => ({
            ...prev,
            currPage: page,
            pageSize: pageSize,
        }))
        handleSensitiveWordsList(page, pageSize, SensitiveWordsData.search_title,)
    }
    // 确定新增
    const handleOk = () => {
        if (addRorm.current) {
            addRorm.current?.validateFields().then((values: any) => {
                addSensitiveList({ ...values }).then((res) => {
                    if (res.data.status.code === 201) {
                        setSensitiveWordsData((prev: any) => ({
                            ...prev,
                            modalOpen: false,
                        }))
                        message.success('添加成功')
                        handleSensitiveWordsList(SensitiveWordsData.currPage, SensitiveWordsData.pageSize, SensitiveWordsData.search_title)
                        // 清空表单的内容
                        addRorm.current?.resetFields()
                    }
                })

            }).catch((err: any) => {
                console.log(err);
            })
        }
    };
    // 模糊搜索
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (!value) {
         return   message.warning('请输入关键字')

        }
        setSensitiveWordsData((prev: any) => ({
            ...prev,
            currPage: 1,
        }))
        handleSensitiveWordsList(SensitiveWordsData.currPage, SensitiveWordsData.pageSize, value)
        setSensitiveWordsData((prev: any) => ({
            ...prev,
            search_title: '',
        }))
    }
    const handleCancel = () => {
        setSensitiveWordsData((prev: any) => ({
            ...prev,
            modalOpen: false,
        }))
    };
    // 新增
    let handleAddSensitiveWords = () => {
        setSensitiveWordsData((prev: any) => ({
            ...prev,
            modalOpen: true,
        }))
    }
    // 删除
    let handleDeletes = () => {
        Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',

            onOk() {
                deleteLexicon({ ids: SensitiveWordsData.checkedList, type: 'type_4' }).then((res) => {
                    if (res.data.status.code === 200) {
                        message.success('删除成功')
                        handleSensitiveWordsList(SensitiveWordsData.currPage, SensitiveWordsData.pageSize, SensitiveWordsData.search_title)
                    }
                }).catch((err) => {
                    message.error('删除失败')
                    console.log(err);
                })
            },
        });


        // console.log(SensitiveWordsData.checkedList);
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    let SensitiveWordsForm = <Form
        ref={addRorm}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item<FieldType>
            label="敏感词"
            name="sensitive_word"
            required={false}
            rules={[{ required: true, message: '请输入敏感词！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="敏感原因"
            name="sensitive_reason"
            required={false}
            rules={[{ required: true, message: '请输入敏感原因！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="依据说明"
            name="reference_description"
            required={false}
            rules={[{ required: true, message: '请输入依据说明！' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="依据链接"
            name="reference_link"
            required={false}
            rules={[{ required: true, message: '请输入依据链接！' }]}
        >
            <Input />
        </Form.Item>
    </Form>
    return (
        <PageContainer
        >
            <Row style={{ marginBottom: '10px' }}>
                <Col span={6}>
                    <Search placeholder="请输入关键字" onSearch={onSearch} enterButton />
                </Col>
                <Col span={4} push={14} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type='primary' onClick={handleAddSensitiveWords}><PlusOutlined />新增</Button>
                    {/* <Button><CheckCircleOutlined />已应用</Button>
                    <Button><DownloadOutlined />导入</Button> */}
                    <Button><DeleteOutlined />批量删除</Button>
                </Col>
            </Row>

            <NewTable
                tableData={SensitiveWordsData.allData}
                tableColumns={columns}
                tableCurrPage={SensitiveWordsData.currPage}
                tablePageSize={SensitiveWordsData.pageSize}
                tableTotal={SensitiveWordsData.total}
                handleOnChange={handleOnChange}
                isSelectedRowKeys={(checkedKeys: any) => {
                    setSensitiveWordsData((prev: any) => ({
                        ...prev,
                        checkedList: checkedKeys,
                    }))
                }}
            />
            <NewModal
                modalTitle={'新增敏感词'}
                modalOpen={SensitiveWordsData.modalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                modalForm={SensitiveWordsForm}
            />
        </PageContainer>
    );
};

export default SensitiveWords
