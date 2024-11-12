

import { PageContainer, } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { Button, GetProps, Input, Table, Col, Row, TableProps, TableColumnsType, FormProps, message, Form, Modal } from 'antd';
const { Search } = Input;
import { CheckCircleOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { addOfficerList, deleteLexicon, getOfficerList } from '@/api/Dictionary';
import NewModal, { FieldType } from './components/NewModal';
import NewTable from './components/NewTable';

type SearchProps = GetProps<typeof Input.Search>;

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

// 落马官员
const FallenOfficial: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    let [FallenOfficialData, setFallenOfficialData] = useState<any>({ currPage: 1, pageSize: 10, total: 0, currData: [], allData: [], checkedList: [], modalOpen: false, search_title: '' })
    let addRorm = useRef<any>(null)

    let handleFallenOfficialList = (page: number, pageSize: number, value: string) => {
        getOfficerList({ page: page, limit: pageSize, search_title: value }).then((res: any) => {
            if (res.data.status.code === 200) {
                let newRecords: any = []
                res.data.records.forEach((item: any) => {
                    newRecords.push({
                        key: item.id,
                        name: item.name,
                        position: item.position,
                        original_unit: item.original_unit,
                        source: item.source,
                        reference_description: item.reference_description,
                        reference_link: item.reference_link,
                        added_by: item.added_by,
                        added_time: item.added_time,
                    })
                })
                setFallenOfficialData((prev: any) => ({
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

        handleFallenOfficialList(FallenOfficialData.currPage, FallenOfficialData.pageSize, FallenOfficialData.search_title)
    }, [])
    const columns: TableColumnsType<DataType> = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '职务',
            dataIndex: 'position',
        },

        {
            title: '原职务所在单位',
            dataIndex: 'original_unit',
        },
        {
            title: '来源',
            dataIndex: 'source',
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
            title: '添加人',
            dataIndex: 'added_by',
        },
        {
            title: '添加时间',
            dataIndex: 'added_time',
        },
    ];

    // 分页
    let handleOnChange = (page: number, pageSize: number) => {
        setFallenOfficialData((prev: any) => ({
            ...prev,
            currPage: page,
            pageSize: pageSize,
        }))
        handleFallenOfficialList(page, pageSize, FallenOfficialData.search_title)
    }
    // 确定新增
    const handleOk = () => {
        if (addRorm.current) {
            addRorm.current?.validateFields().then((values: any) => {
                addOfficerList({ ...values }).then((res) => {
                    if (res.data.status.code === 201) {
                        setFallenOfficialData((prev: any) => ({
                            ...prev,
                            modalOpen: false,
                        }))
                        message.success('添加成功')
                        handleFallenOfficialList(FallenOfficialData.currPage, FallenOfficialData.pageSize, FallenOfficialData.search_title)
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
        setFallenOfficialData((prev: any) => ({
            ...prev,
            currPage: 1,
        }))
        handleFallenOfficialList(FallenOfficialData.currPage, FallenOfficialData.pageSize, value)
        setFallenOfficialData((prev: any) => ({
            ...prev,
            search_title: '',
        }))
    }
    const handleCancel = () => {
        setFallenOfficialData((prev: any) => ({
            ...prev,
            modalOpen: false,
        }))
    };
    // 新增
    let handleAddFallenOfficial = () => {
        setFallenOfficialData((prev: any) => ({
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
                deleteLexicon({ ids: FallenOfficialData.checkedList, type: 'type_7' }).then((res) => {
                    if (res.data.status.code === 200) {
                        message.success('删除成功')
                        handleFallenOfficialList(FallenOfficialData.currPage, FallenOfficialData.pageSize, FallenOfficialData.search_title)
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
    let FallenOfficialForm = <Form
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
            label="姓名"
            name="name"
            required={false}
            rules={[{ required: true, message: '请输入姓名！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="职务"
            name="position"
            required={false}
            rules={[{ required: true, message: '请输入职务！' }]}
        >
            <Input />
        </Form.Item>


        <Form.Item<FieldType>
            label="原单位"
            name="original_unit"
            required={false}
            rules={[{ required: true, message: '请输入原职务所在单位！' }]}

        >
            <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="来源"
            name="source"
            required={false}
            rules={[{ required: true, message: '请输入来源！' }]}

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
        <Form.Item<FieldType>
            label="添加人"
            name="added_by"
            required={false}
            rules={[{ required: true, message: '请输入添加人！' }]}
        >
            <Input />

        </Form.Item>

    </Form>
    return (
        <PageContainer
        >

            <Row style={{ marginBottom: '10px' }}>
                <Col span={6}>
                    <Search placeholder="请输入关键字"
                        value={FallenOfficialData.search_title}
                        onSearch={onSearch}
                        onChange={(e) => {
                            setFallenOfficialData((prev: any) => ({
                                ...prev,
                                search_title: e.target.value,
                            }))
                        }}
                        enterButton />
                </Col>
                <Col span={4} push={14} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type='primary' onClick={handleAddFallenOfficial}><PlusOutlined />新增</Button>
                    {/* <Button><CheckCircleOutlined />已应用</Button>
                    <Button><DownloadOutlined />导入</Button> */}
                    <Button onClick={handleDeletes}
                        disabled={FallenOfficialData.checkedList.length === 0}><DeleteOutlined />批量删除</Button>
                </Col>
            </Row>

            <NewTable
                tableData={FallenOfficialData.allData}
                tableColumns={columns}
                tableCurrPage={FallenOfficialData.currPage}
                tablePageSize={FallenOfficialData.pageSize}
                tableTotal={FallenOfficialData.total}
                handleOnChange={handleOnChange}
                isSelectedRowKeys={(checkedKeys: any) => {
                    setFallenOfficialData((prev: any) => ({
                        ...prev,
                        checkedList: checkedKeys,
                    }))
                }}
            />
            <NewModal
                modalTitle={'新增易错词'}
                modalOpen={FallenOfficialData.modalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                modalForm={FallenOfficialForm}
            />
        </PageContainer>
    );
};

export default FallenOfficial
