
import { PageContainer, } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { Button, GetProps, Input, Table, Col, Row, TableProps, TableColumnsType, Form, message, Modal, FormProps } from 'antd';
const { Search } = Input;
import { CheckCircleOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { addDepartmentList, deleteLexicon, getDepartmentList } from '@/api/Dictionary';
import NewTable from './components/NewTable';
import NewModal, { FieldType } from './components/NewModal';
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

// 部门机构
const Department: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    let [DepartmentData, setDepartmentData] = useState<any>({ currPage: 1, pageSize: 10, total: 0, currData: [], allData: [], checkedList: [], modalOpen: false, search_title: '' })
    let addRorm = useRef<any>(null)
    let handleDepartmentList = (page: number, pageSize: number, value: string) => {
        getDepartmentList({ page: page, limit: pageSize, search_title: value }).then((res: any) => {
            if (res.data.status.code === 200) {
                let newRecords: any = []
                res.data.records.forEach((item: any) => {
                    newRecords.push({
                        key: item.id,
                        full_name: item.full_name,
                        short_name: item.short_name,

                        reference_description: item.reference_description,
                        reference_link: item.reference_link,
                        added_by: item.added_by,
                        added_time: item.added_time,
                    })
                })
                setDepartmentData((prev: any) => ({
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

        handleDepartmentList(DepartmentData.currPage, DepartmentData.pageSize, DepartmentData.search_title)
    }, [])

    const columns: TableColumnsType<DataType> = [
        {
            title: '部门全称',
            dataIndex: 'full_name',
        },
        {
            title: '部门简称',
            dataIndex: 'short_name',
        },


        {
            title: '依据说明',
            dataIndex: 'reference_description',
        },
        {
            title: '依据链接',
            dataIndex: 'reference_link',
            render: (text) => {
                return <a href={text}>{text}</a>
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
        setDepartmentData((prev: any) => ({
            ...prev,
            currPage: page,
            pageSize: pageSize,
        }))
        handleDepartmentList(page, pageSize, DepartmentData.search_title)
    }
    // 确定新增
    const handleOk = () => {
        if (addRorm.current) {
            addRorm.current?.validateFields().then((values: any) => {
                addDepartmentList({ ...values }).then((res) => {
                    if (res.data.status.code === 201) {
                        setDepartmentData((prev: any) => ({
                            ...prev,
                            modalOpen: false,
                        }))
                        message.success('添加成功')
                        handleDepartmentList(DepartmentData.currPage, DepartmentData.pageSize, DepartmentData.search_title)
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
        setDepartmentData((prev: any) => ({
            ...prev,
            currPage: 1,
        }))
        handleDepartmentList(DepartmentData.currPage, DepartmentData.pageSize, value)
        setDepartmentData((prev: any) => ({
            ...prev,
            search_title: '',
        }))
    }
    const handleCancel = () => {
        setDepartmentData((prev: any) => ({
            ...prev,
            modalOpen: false,
        }))
    };
    // 新增
    let handleAddFallibleWord = () => {
        setDepartmentData((prev: any) => ({
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
                deleteLexicon({ ids: DepartmentData.checkedList, type: 'type_1' }).then((res) => {
                    if (res.data.status.code === 200) {
                        message.success('删除成功')
                        handleDepartmentList(DepartmentData.currPage, DepartmentData.pageSize, DepartmentData.search_title)
                    }
                }).catch((err) => {
                    message.error('删除失败')
                    console.log(err);
                })
            },
        });


        // console.log(BlacklistData.checkedList);
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    let FallibleWordForm = <Form
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
            label="部门全称"
            name="full_name"
            required={false}
            rules={[{ required: true, message: '请输入部门全称！' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="部门简称"
            name="short_name"
            required={false}
            rules={[{ required: true, message: '请输入部门简称！' }]}
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
            <Row>
                <Col span={6}>
                    <Search placeholder="请输入关键字"
                        value={DepartmentData.search_title}
                        onSearch={onSearch}
                        onChange={(e) => {
                            setDepartmentData((prev: any) => ({
                                ...prev,
                                search_title: e.target.value,
                            }))
                        }}
                        enterButton />
                </Col>
                <Col span={4} push={14} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type='primary' onClick={handleAddFallibleWord}><PlusOutlined />新增</Button>
                    {/* <Button><CheckCircleOutlined />已应用</Button>
                    <Button><DownloadOutlined />导入</Button> */}
                    <Button onClick={handleDeletes}
                        disabled={DepartmentData.checkedList.length === 0}><DeleteOutlined />批量删除</Button>
                </Col>
            </Row>
            <NewTable
                tableData={DepartmentData.allData}
                tableColumns={columns}
                tableCurrPage={DepartmentData.currPage}
                tablePageSize={DepartmentData.pageSize}
                tableTotal={DepartmentData.total}
                handleOnChange={handleOnChange}
                isSelectedRowKeys={(checkedKeys: any) => {
                    setDepartmentData((prev: any) => ({
                        ...prev,
                        checkedList: checkedKeys,
                    }))
                }}
            />
            <NewModal
                modalTitle={'新增部门机构'}
                modalOpen={DepartmentData.modalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                modalForm={FallibleWordForm}
            />
        </PageContainer>
    );
};

export default Department