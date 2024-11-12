import React, { useEffect, useRef, useState } from 'react'
import { Button, GetProps, Input, Col, Row, TableColumnsType, Form, FormProps, message, Modal } from 'antd';
import NewModal, { FieldType } from '@/pages/Dictionary/components/NewModal';
import { SearchProps } from 'antd/es/input';
import { CheckCircleOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import NewTable from '@/pages/Dictionary/components/NewTable';
import { addTerm, getTermList } from '@/api/OilIndustry';
import { deleteLexicon } from '@/api/Dictionary';
const { Search } = Input;

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

function OilIndustry() {
    let addRorm = useRef<any>(null)
    let [OilIndustryData, setOilIndustryData] = useState<any>({ currPage: 1, pageSize: 10, total: 0, currData: [], allData: [], checkedList: [], modalOpen: false, search_title: '' })
    // 查询方法
    let handleGetOilIndustry = (page: number, pageSize: number, value: string) => {
        getTermList({ page: page, limit: pageSize, search_title: value }).then((res) => {
            if (res.data.status.code === 200) {
                let newRecords: any = []
                res.data.records.forEach((item: any) => {
                    newRecords.push({
                        key: item.id,
                        term: item.term,
                        definition: item.definition,
                        category: item.category,
                        added_time: item.added_time,
                    })
                })
                setOilIndustryData((prev: any) => ({
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
        handleGetOilIndustry(OilIndustryData.currPage, OilIndustryData.pageSize, OilIndustryData.search_title)
    }, [])

    const columns: TableColumnsType<DataType> = [
        {
            title: '术语',
            dataIndex: 'term',
        },
        {
            title: '定义',
            dataIndex: 'definition',
        },
        {
            title: '分类',
            dataIndex: 'category',
        },
        {
            title: '添加时间',
            dataIndex: 'added_time',
        },
    ];
    // 分页
    let handleOnChange = (page: number, pageSize: number) => {
        setOilIndustryData((prev: any) => ({
            ...prev,
            currPage: page,
            pageSize: pageSize,
        }))
        handleGetOilIndustry(page, pageSize, OilIndustryData.search_title)
    }
    // 确定新增
    const handleOk = () => {
        if (addRorm.current) {
            addRorm.current?.validateFields().then((values: any) => {
                addTerm({ ...values }).then((res) => {
                    if (res.data.status.code === 201) {
                        setOilIndustryData((prev: any) => ({
                            ...prev,
                            modalOpen: false,
                        }))
                        message.success('添加成功')
                        handleGetOilIndustry(OilIndustryData.currPage, OilIndustryData.pageSize, OilIndustryData.search_title)
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
        setOilIndustryData((prev: any) => ({
            ...prev,
            currPage: 1,
        }))
        handleGetOilIndustry(OilIndustryData.currPage, OilIndustryData.pageSize, value)
        setOilIndustryData((prev: any) => ({
            ...prev,
            search_title: '',
        }))
    }
    const handleCancel = () => {
        setOilIndustryData((prev: any) => ({
            ...prev,
            modalOpen: false,
        }))
    };
    // 新增
    let handleAddOilIndustry = () => {
        setOilIndustryData((prev: any) => ({
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
                deleteLexicon({ ids: OilIndustryData.checkedList, type: 'type_8' }).then((res) => {
                    if (res.data.status.code === 200) {
                        message.success('删除成功')
                        handleGetOilIndustry(OilIndustryData.currPage, OilIndustryData.pageSize, OilIndustryData.search_title)
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
    let OilIndustryForm = <Form
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
            label="术语"
            name="term"
            required={false}
            rules={[{ required: true, message: '请输入术语！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="定义"
            name="definition"
            required={false}
            rules={[{ required: true, message: '请输入定义！' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="分类"
            name="category"
            required={false}
            rules={[{ required: true, message: '请输入分类！' }]}

        >
            <Input />
        </Form.Item>
      

    </Form>
    return (
        <div>
            <Row style={{ marginBottom: '10px' }}>
                <Col span={6}>
                    <Search placeholder="请输入关键字" value={OilIndustryData.search_title} onSearch={onSearch} onChange={(e) => {
                        setOilIndustryData((prev: any) => ({
                            ...prev,
                            search_title: e.target.value,
                        }))
                    }} enterButton />
                </Col>
                <Col span={4} push={14} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type='primary' onClick={handleAddOilIndustry}><PlusOutlined />新增</Button>
                    {/* <Button><CheckCircleOutlined />已应用</Button>
                    <Button><DownloadOutlined />导入</Button> */}
                    <Button onClick={handleDeletes}
                        disabled={OilIndustryData.checkedList.length === 0}
                    ><DeleteOutlined />批量删除</Button>
                </Col>
            </Row>
            {

            }
            <NewTable
                tableData={OilIndustryData.allData}
                tableColumns={columns}
                tableCurrPage={OilIndustryData.currPage}
                tablePageSize={OilIndustryData.pageSize}
                tableTotal={OilIndustryData.total}
                handleOnChange={handleOnChange}
                isSelectedRowKeys={(checkedKeys: any) => {
                    setOilIndustryData((prev: any) => ({
                        ...prev,
                        checkedList: checkedKeys,
                    }))
                }}
            />
            <NewModal
                modalTitle={'新增黑名单'}
                modalOpen={OilIndustryData.modalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                modalForm={OilIndustryForm}
            />
        </div>
    )
}

export default OilIndustry
