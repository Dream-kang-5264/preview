
import { PageContainer, } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { Button, GetProps, Input, Col, Row, TableColumnsType, Form, FormProps, message, Modal } from 'antd';
const { Search } = Input;
import { CheckCircleOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { addBlackList, deleteLexicon, getBlackList } from '@/api/Dictionary';
import NewTable from './components/NewTable';
import NewModal, { FieldType } from './components/NewModal';
type SearchProps = GetProps<typeof Input.Search>;

interface DataType {
    key: any;
    error_word: string;
    suggestion_word: string;
    address: string;
    exception_context: string;
    error_reason: string;
    reference_description: string;
    reference_link: string;
    added_time: string;
}

// 黑名单
const Blacklist: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    let addRorm = useRef<any>(null)
    let [BlacklistData, setBlacklistData] = useState<any>({ currPage: 1, pageSize: 10, total: 0, currData: [], allData: [], checkedList: [], modalOpen: false, search_title: '' })
    // 查询方法
    let handleGetBlackList = (page: number, pageSize: number, value: string) => {
        getBlackList({ page: page, limit: pageSize, search_title: value }).then((res) => {
            if (res.data.status.code === 200) {
                let newRecords: any = []
                res.data.records.forEach((item: any) => {
                    newRecords.push({
                        key: item.id,
                        error_word: item.error_word,
                        suggestion_word: item.suggestion_word,
                        context: item.context,
                        exception_context: item.exception_context,
                        error_reason: item.error_reason,
                        reference_description: item.reference_description,
                        reference_link: item.reference_link,
                        added_time: item.added_time,
                    })
                })
                setBlacklistData((prev: any) => ({
                    ...prev,
                    allData: newRecords,
                    total: res.data.total,
                }))
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        handleGetBlackList(BlacklistData.currPage, BlacklistData.pageSize, BlacklistData.search_title)
    }, [])

    const columns: TableColumnsType<DataType> = [
        {
            title: '错误词',
            dataIndex: 'error_word',
        },
        {
            title: '建议词',
            dataIndex: 'suggestion_word',
        },
        {
            title: '语境',
            dataIndex: 'context',
        },
        {
            title: '例外语境',
            dataIndex: 'exception_context',
        },
        {
            title: '错误原因',
            dataIndex: 'error_reason',
        },
        {
            title: '依据说明',
            dataIndex: 'reference_description',
        },
        {
            title: '依据链接',
            dataIndex: 'reference_link',
            render: (text) => {
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
        setBlacklistData((prev: any) => ({
            ...prev,
            currPage: page,
            pageSize: pageSize,
        }))
        handleGetBlackList(page, pageSize, BlacklistData.search_title)
    }
    // 确定新增
    const handleOk = () => {
        if (addRorm.current) {
            addRorm.current?.validateFields().then((values: any) => {
                addBlackList({ ...values }).then((res) => {
                    if (res.data.status.code === 201) {
                        setBlacklistData((prev: any) => ({
                            ...prev,
                            modalOpen: false,
                        }))
                        message.success('添加成功')
                        handleGetBlackList(BlacklistData.currPage, BlacklistData.pageSize, BlacklistData.search_title)
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
            return message.warning('请输入关键字')

        }
        setBlacklistData((prev: any) => ({
            ...prev,
            currPage: 1,
        }))
        handleGetBlackList(BlacklistData.currPage, BlacklistData.pageSize, value)
        setBlacklistData((prev: any) => ({
            ...prev,
            search_title: '',
        }))
    }
    const handleCancel = () => {
        setBlacklistData((prev: any) => ({
            ...prev,
            modalOpen: false,
        }))
    };
    // 新增
    let handleAddBlacklist = () => {
        setBlacklistData((prev: any) => ({
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
                deleteLexicon({ ids: BlacklistData.checkedList, type: 'type_4' }).then((res) => {
                    if (res.data.status.code === 200) {
                        message.success('删除成功')
                        handleGetBlackList(BlacklistData.currPage, BlacklistData.pageSize, BlacklistData.search_title)
                    }
                }).catch((err) => {
                    message.error('删除失败')
                    console.log(err);
                })
            },
        });
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    let BlacklistForm = <Form
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
            label="错误词"
            name="error_word"
            required={false}
            rules={[{ required: true, message: '请输入错误词！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="建议词"
            name="suggestion_word"
            required={false}
            rules={[{ required: true, message: '请输入建议词！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="语境"
            name="context"
            required={false}
            rules={[{ required: true, message: '请输入语境！' }]}

        >
            <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="例外语境"
            name="exception_context"
            required={false}
            rules={[{ required: true, message: '请输入例外语境！' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="错误原因"
            name="error_reason"
            required={false}
            rules={[{ required: true, message: '请输入错误原因！' }]}
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
                    <Search placeholder="请输入关键字" value={BlacklistData.search_title} onSearch={onSearch} onChange={(e) => {
                        setBlacklistData((prev: any) => ({
                            ...prev,
                            search_title: e.target.value,
                        }))
                    }} enterButton />
                </Col>
                <Col span={4} push={14} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type='primary' onClick={handleAddBlacklist}><PlusOutlined />新增</Button>
                    {/* <Button><CheckCircleOutlined />已应用</Button>
                    <Button><DownloadOutlined />导入</Button> */}
                    <Button onClick={handleDeletes}
                        disabled={BlacklistData.checkedList.length === 0}
                    ><DeleteOutlined />批量删除</Button>
                </Col>
            </Row>
            {

            }
            <NewTable
                tableData={BlacklistData.allData}
                tableColumns={columns}
                tableCurrPage={BlacklistData.currPage}
                tablePageSize={BlacklistData.pageSize}
                tableTotal={BlacklistData.total}
                handleOnChange={handleOnChange}
                isSelectedRowKeys={(checkedKeys: any) => {
                    setBlacklistData((prev: any) => ({
                        ...prev,
                        checkedList: checkedKeys,
                    }))
                }}
            />
            <NewModal
                modalTitle={'新增黑名单'}
                modalOpen={BlacklistData.modalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                modalForm={BlacklistForm}
            />
        </PageContainer>
    );
};

export default Blacklist
