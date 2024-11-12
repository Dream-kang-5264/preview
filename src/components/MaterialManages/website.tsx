import { message, Modal, Select, Tabs, } from 'antd';
import type { SelectProps, TabsProps } from 'antd';

type LabelRender = SelectProps['labelRender'];
import React, { useEffect, useState } from 'react'
import { Space, Table, Tag, Button } from 'antd';
import type { TableProps } from 'antd';
import { getGrabLog, getGrabRecord, getMaterialSource, grabMaterial } from '@/api/MaterialGrab';
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

interface DataType {
    id?: string;
    source_name?: string;
    source_url?: string;
    description?: string;
    source_type?: string;
    crawler_name?: string;
    frequency?: string;
    last_run_time?: string;
    source_id?: string;
    status?: any;
    crawler?: string;
    error_message?: string;
    task_start?: string;
    task_end?: string;
    material_count?: string;
}

function website() {
    let [websiteData, setWebsiteData] = useState<any>({ dataSource: [], currPage: 1, pageSize: 10, total: 0, currTabkey: '1' })
    useEffect(() => {
        getMaterialSource({ search_title: '' }).then((res) => {
            if (res.status === 200) {
                const data: DataType[] = [];
                res.data.records.forEach((item: any) => {
                    data.push({
                        id: item.id,
                        description: item.description,
                        source_type: item.source_type,
                        source_name: item.source_name,
                        source_url: item.source_url,
                    })
                })
                setWebsiteData((prev: any) => ({
                    ...prev,
                    dataSource: data,
                    total: res.data.total
                }))
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    // 抓取记录的状态方法
    let statusRender = (status: string) => {
        switch (status) {
            case 'active':
                return <div><RefreshCw className="h-200 w-200 text-blue-600 animate-spin" />运行中</div>
                break;
            case 'stopped':
                return <div className='flex items-center'><AlertCircle className="h-5 w-5 text-yellow-500" />已停止</div>
                break;
            case 'error':
                return '出错'
                break;
            default:
                break;
        }
    };
    // 抓取日志的状态方法
    let statusLog = (status: string) => {
        switch (status) {
            case 'success':
                return <div className='flex items-center'><CheckCircle className="h-5 w-5 text-green-500" />成功</div>
                break;
            case 'failure':
                return <div className='flex items-center'><XCircle className="h-5 w-5 text-red-500" />失败</div>
                break;
            case 'pending':
                return <div className='flex items-center'><RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />处理中</div>
                break;
            default:
                break;
        }
    };
    const onChange = (key: string) => {
        setWebsiteData((prev: any) => ({
            ...prev,
            currTabkey: key
        }))
        // 抓取数据源
        if (key === '1') {
            getMaterialSource({ search_title: '' }).then((res) => {
                if (res.status === 200) {
                    const data: DataType[] = [];
                    res.data.records.forEach((item: any) => {
                        data.push({
                            id: item.id,
                            description: item.description,
                            source_type: item.source_type,
                            source_name: item.source_name,
                            source_url: item.source_url,
                            frequency: item.frequency,
                        })
                    })
                    setWebsiteData((prev: any) => ({
                        ...prev,
                        dataSource: data
                    }))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        // 抓取记录
        else if (key === '2') {

            getGrabRecord({}).then((res) => {
                if (res.status === 200) {
                    const data: DataType[] = [];
                    res.data.records.forEach((item: any) => {
                        data.push({
                            id: item.id,
                            description: item.description,
                            frequency: item.frequency,
                            crawler_name: item.crawler_name,
                            last_run_time: item.last_run_time,
                            source_id: item.source_id,
                            status: statusRender(item.status),
                        })
                    })
                    setWebsiteData((prev: any) => ({
                        ...prev,
                        dataSource: data,
                        total: res.data.total
                    }))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        // 抓取日志
        else if (key === '3') {
            getGrabLog({}).then((res) => {
                if (res.status === 200) {
                    const data: DataType[] = [];
                    res.data.records.forEach((item: any) => {
                        data.push({
                            id: item.id,
                            crawler: item.crawler,
                            error_message: item.error_message,
                            status: statusLog(item.status),
                            task_start: item.task_start,
                            task_end: item.task_end === 'N/A' ? '正在处理中' : item.task_end,
                            material_count: item.material_count
                        })
                    })
                    setWebsiteData((prev: any) => ({
                        ...prev,
                        dataSource: data,
                        total: res.data.total
                    }))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    };
    // 素材来源清单
    const columns: TableProps<DataType>['columns'] = [
        {
            title: '来源名称',
            dataIndex: 'source_name',
            key: 'source_name',
        },
        {
            title: '来源地址',
            dataIndex: 'source_url',
            key: 'source_url',
            render: (data) => {
                return <a href={data} target='_blank' rel="noreferrer">{data}</a>
            }
        },

        {
            title: '类型',
            dataIndex: 'source_type',
            key: 'source_type',
        },
        {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
            width: '20%'
        },
        // {
        //     title: '操作',
        //     key: 'action',
        //     width: '10%',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <a type="primary" onClick={() => {
        //                 // console.log(record);

        //                 grabMaterial({ source_id: record.id }).then((res) => {
        //                     console.log(res);

        //                 }).catch((err) => {
        //                     console.log(err);

        //                 })
        //             }}>抓取</a>
        //             {/* <a>Delete</a> */}
        //         </Space>
        //     ),
        // },
    ];

  
    // 任务
    const columnsRecords: TableProps<DataType>['columns'] = [
        {
            title: '任务名称',
            dataIndex: 'crawler_name',
            key: 'crawler_name',
        },
        {
            title: '更新时间',
            dataIndex: 'last_run_time',
            key: 'last_run_time',
        },
        {
            title: '来源名称',
            key: 'source_id',
            dataIndex: 'source_id',
        },
        {
            title: '更新频率',
            dataIndex: 'frequency',
            key: 'frequency',
        },
        {
            title: '当前状态',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: '操作',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <a type="primary" onClick={() => {
                        Modal.confirm({
                            title: '提示信息',
                            content: '确定启动吗？',
                            onOk: () => {
                                setWebsiteData((prev: any) => ({
                                    ...prev,
                                    dataSource: prev.dataSource.map((item) =>
                                        item.id === record.id
                                            ? {
                                                ...item,
                                                status: <div className='flex items-center'>
                                                    <RefreshCw className="h-200 w-200 text-blue-600 animate-spin" />
                                                    运行中
                                                </div>
                                            }
                                            : item
                                    )
                                }));

                                grabMaterial({ crawler_tasks_id: record.id })
                                    .then((res) => {

                                        if (res.data.status.code === 200) {
                                        
                                            message.success('启动成功');
                                            setWebsiteData((prev) => ({
                                                ...prev,
                                                dataSource: prev.dataSource.map((item) =>
                                                    item.id === record.id
                                                        ? {
                                                            ...item,
                                                            status: <div className='flex items-center'>
                                                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                                                已停止
                                                            </div>
                                                        }
                                                        : item
                                                )
                                            }));
                                        } else if (res.data.status.code === 210) {
                                            console.log(res);
                                            message.warning('数据暂无更新');
                                            setWebsiteData((prev:any) => ({
                                                ...prev,
                                                dataSource: prev.dataSource.map((item:any) =>
                                                    item.id === record.id
                                                        ? {
                                                            ...item,
                                                            status: <div className='flex items-center'>
                                                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                                                已停止
                                                            </div>
                                                        }
                                                        : item
                                                )
                                            }));
                                        } else if (res.data.status.code === 500) {
                                            console.log(3333);

                                            message.error('抓取失败');
                                            setWebsiteData((prev: any) => ({
                                                ...prev,
                                                dataSource: prev.dataSource.map((item) =>
                                                    item.id === record.id
                                                        ? {
                                                            ...item,
                                                            status: <div className='flex items-center'>
                                                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                                                已停止
                                                            </div>
                                                        }
                                                        : item
                                                )
                                            }));
                                        }
                                        else {


                                        }
                                        console.log(res);
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        message.error('请求失败');
                                        setWebsiteData((prev: any) => ({
                                            ...prev,
                                            dataSource: prev.dataSource.map((item) =>
                                                item.id === record.id
                                                    ? {
                                                        ...item,
                                                        status: <div className='flex items-center'>
                                                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                                                            已停止
                                                        </div>
                                                    }
                                                    : item
                                            )
                                        }));
                                    })
                                    .finally(() => {
                                        // 可以在这里处理一些最终操作，例如关闭加载动画
                                    });
                            },
                        });
                    }}>启动</a>
                </Space>
            ),
        },
    ];

    // 抓取日志
    const columnsLog: TableProps<DataType>['columns'] = [
        {
            title: '任务名称',
            dataIndex: 'crawler',
            key: 'crawler',
        },

        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '开始时间',
            key: 'task_start',
            dataIndex: 'task_start',
        },
        {
            title: '结束时间',
            key: 'task_end',
            dataIndex: 'task_end',
        },
        {
            title: '抓取数量',
            dataIndex: 'material_count',
            key: 'material_count',
        },
        {
            title: '错误信息',
            dataIndex: 'error_message',
            key: 'error_message',

        },
        // {
        //     title: '操作',
        //     key: 'action',
        //     width: '10%',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <a type="primary">删除</a>
        //             {/* <a>Delete</a> */}
        //         </Space>
        //     ),
        // },
    ];
    // 分页
    let handleOnChange = (page: number, pageSize: number) => {
        if (websiteData.currTabkey === '1') {
            getMaterialSource({ search_title: '', }).then((res) => {
                if (res.status === 200) {
                    const data: DataType[] = [];
                    res.data.records.forEach((item: any) => {
                        data.push({
                            id: item.id,
                            description: item.description,
                            source_type: item.source_type,
                            source_name: item.source_name,
                            source_url: item.source_url,
                            frequency: item.frequency,
                        })
                    })
                    setWebsiteData((prev: any) => ({
                        ...prev,
                        dataSource: data,
                        total: res.data.total
                    }))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        // 抓取记录
        else if (websiteData.currTabkey === '2') {

            getGrabRecord({}).then((res) => {
                if (res.status === 200) {
                    const data: DataType[] = [];
                    res.data.records.forEach((item: any) => {
                        data.push({
                            id: item.id,
                            description: item.description,
                            frequency: item.frequency,
                            crawler_name: item.crawler_name,
                            last_run_time: item.last_run_time,
                            source_id: item.source_id,
                            status: statusRender(item.status),
                        })
                    })
                    setWebsiteData((prev: any) => ({
                        ...prev,
                        dataSource: data,
                        total: res.data.total
                    }))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        // 抓取日志
        else if (websiteData.currTabkey === '3') {
            getGrabLog({ page: page, }).then((res) => {
                if (res.status === 200) {
                    const data: DataType[] = [];
                    res.data.records.forEach((item: any) => {
                        data.push({
                            id: item.id,
                            crawler: item.crawler,
                            error_message: item.error_message,
                            status: statusLog(item.status),
                            task_start: item.task_start,
                            task_end: item.task_end === 'N/A' ? '正在处理中' : item.task_end,
                            material_count: item.material_count
                        })
                    })
                    setWebsiteData((prev: any) => ({
                        ...prev,
                        dataSource: data,
                        currPage: page,
                        total: res.data.total
                    }))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '素材来源清单',
            children: <>
                <Table columns={columns} dataSource={websiteData.dataSource}
                    pagination={{
                        current: websiteData.currPage,
                        pageSize: websiteData.pageSize,
                        total: websiteData.total,
                        onChange: handleOnChange,
                    }}
                />
            </>,
        },
        {
            key: '2',
            label: '任务',
            children: <>
                <Table columns={columnsRecords} dataSource={websiteData.dataSource}
                    pagination={{
                        current: websiteData.currPage,
                        pageSize: websiteData.pageSize,
                        total: websiteData.total,
                        onChange: handleOnChange,
                    }}
                />
            </>,
        },
        {
            key: '3',
            label: '任务执行记录',
            children: <>
                <Table columns={columnsLog} dataSource={websiteData.dataSource}
                    pagination={{
                        current: websiteData.currPage,
                        pageSize: websiteData.pageSize,
                        total: websiteData.total,
                        onChange: handleOnChange,
                    }}
                />
            </>,
        },
    ];
    return (
        <div>

            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    )
}

export default website
