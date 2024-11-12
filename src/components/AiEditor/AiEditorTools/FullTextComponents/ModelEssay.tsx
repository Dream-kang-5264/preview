import { getTempletChildren, getTempletData } from '@/api/Templet';
import { getTempletType } from '@/api/written';
import { getAllMaterial, getAllUploadMaterial, getSearchClass, getSearchFilter, lookPublicMaterial } from '@/api/search';
import { DownOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Button, Cascader, CascaderProps, Col, DatePicker, DatePickerProps, Drawer, Dropdown, Form, FormProps, Input, MenuProps, Radio, RadioChangeEvent, Row, message, Pagination, Tooltip, ConfigProvider, Empty, Table, TableColumnsType, TabsProps, Tabs, Modal, Space } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react'
import styles from './index.less'
import TextArea from 'antd/es/input/TextArea';
import Send from '../../../../../public/send.svg'
import Sends from '../../../../../public/send2.svg'
import { TableRowSelection } from 'antd/es/table/interface';
const zhCN = require('antd/lib/locale/zh_CN').default;
interface CustomTableRowSelection extends TableRowSelection<DataType> {
    selectedRowKeysText: React.Key[];

}
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
}


function ModelEssay({ setSendServer, sendSelectIds }: any) {
    // 个人素材
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRowKeysText, setSelectedRowKeysText] = useState<React.Key[]>([]);
    const [selectedRowKeysPublic, setSelectedRowKeysPublic] = useState<React.Key[]>([]);
    const [allSelectedRowKeys, setAllSelectedRowKeys] = useState<React.Key[]>([]);

    let [MaterialData, setMaterialData] = useState({ allData: [], currPage: 1, pageSize: 10, total: 0, currTable: '1', allMateriaData: [], currData: [] })
    useEffect(() => {
        handleGetallMaterial(MaterialData.currTable)

    }, [])

    // 获取所有素材
    let handleGetallMaterial = (type: any, title?: string) => {
        getAllUploadMaterial({ material_type: type, }).then((res) => {
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
                    title: item.title
                })
            })
            // console.log(type)
            if (type === '1') {
                setMaterialData((prve: any) => ({
                    ...prve,
                    allData: data,
                    total: res.data.data.total,
                    currData: data,
                    allMateriaData: prve.allMateriaData.length > 0 ? prve.allMateriaData : data
                }))
            }
            else if (type === '3') {
                // console.log(MaterialData.allData)
                setMaterialData((prve: any) => ({
                    ...prve,
                    allData: data,
                    total: res.data.data.total,
                    allMateriaData: [...prve.currData, ...data],
                }))
            }

        }).catch((error) => {
            message.error(error)
        })

    }
  // 获取公共素材
  let handlePublicMaterial = (type: any,page?:any) => {
    lookPublicMaterial({ material_type: type,page:page }).then((res) => {
        // console.log(res);  
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
                title: item.title
            })
        })
        setMaterialData((prve: any) => ({
            ...prve,
            allData: data,
            total: res.data.data.total,
        }))
    }).catch((err) => {
        console.log(err);
    })
}

    const onChange = (key: any) => {
        // console.log(key);
        setMaterialData((prve: any) => ({
            ...prve,
            currTable: key,
            currPage:1
        }))
        if (key === '2') {
            handlePublicMaterial('4')
        }
        else {
            handleGetallMaterial(key)
        }

    };
    let handleOnChange = (page: any, pageSize: number) => {
        if (MaterialData.currTable === '2') {
            handlePublicMaterial('4',page)
        }
        else {
            handleGetallMaterial(MaterialData.currTable, page)
        }
        setMaterialData((prve: any) => ({
            ...prve,
            currPage: page,
        }))
    }
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      
        setSelectedRowKeys(newSelectedRowKeys);
        updateCombinedSelectedKeys(newSelectedRowKeys, selectedRowKeysText, selectedRowKeysPublic);
    };

    const onSelectChangeText = (newSelectedRowKeys: React.Key[]) => {
      
        setSelectedRowKeysText(newSelectedRowKeys);
        updateCombinedSelectedKeys(selectedRowKeys, newSelectedRowKeys, selectedRowKeysPublic);
    };

    const onSelectChangePublic = (newSelectedRowKeys: React.Key[]) => {
      
        setSelectedRowKeysPublic(newSelectedRowKeys);
        updateCombinedSelectedKeys(selectedRowKeys, selectedRowKeysText, newSelectedRowKeys);
    };
    const updateCombinedSelectedKeys = (firstSet: React.Key[], secondSet: React.Key[], thirdSet: React.Key[]) => {
        // 合并选中 ID
        const combinedSelectedKeys = [...firstSet, ...secondSet, ...thirdSet];
        setAllSelectedRowKeys(combinedSelectedKeys); // 更新合并后的 ID

        // 根据合并后的 ID 过滤数据
        let arr = MaterialData.allMateriaData.filter((item: any) => {
            return combinedSelectedKeys.some((dataItem: any) => item.key === dataItem);
        });

        // 更新发送给服务器的数据
        setSendServer((prev: any) => ({
            ...prev,
            template_id: [...new Set([...prev.template_id, ...combinedSelectedKeys])]
        }));

        sendSelectIds(arr); // 发送合并后的数据
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys: any) => {
                    const newSelectedRowKeys = changeableRowKeys.filter((_: any, index: any) => index % 2 === 0);
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys: any) => {
                    const newSelectedRowKeys = changeableRowKeys.filter((_: any, index: any) => index % 2 !== 0);
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

    const rowSelectionText = {
        selectedRowKeys: selectedRowKeysText,
        onChange: onSelectChangeText,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys: any) => {
                    const newSelectedRowKeys = changeableRowKeys.filter((_: any, index: any) => index % 2 === 0);
                    setSelectedRowKeysText(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys: any) => {
                    const newSelectedRowKeys = changeableRowKeys.filter((_: any, index: any) => index % 2 !== 0);
                    setSelectedRowKeysText(newSelectedRowKeys);
                },
            },
        ],
    };
    const rowSelectionPubilic = {
        selectedRowKeys: selectedRowKeysPublic,
        onChange: onSelectChangePublic,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys: any) => {
                    const newSelectedRowKeys = changeableRowKeys.filter((_: any, index: any) => index % 2 === 0);
                    setSelectedRowKeysPublic(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys: any) => {
                    const newSelectedRowKeys = changeableRowKeys.filter((_: any, index: any) => index % 2 !== 0);
                    setSelectedRowKeysPublic(newSelectedRowKeys);
                },
            },
        ],
    }
    const columns: TableColumnsType<DataType> = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '40%',
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            width: '20%',
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            width: '20%',
        },
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
                        if (MaterialData.currTable === '2') {
                            setMaterialData((prve: any) => ({
                                ...prve,
                                isModalText: true,
                                addTextTitle: record.title,
                                text: record.text_content,
                                textCopyShow: true
                            }))
                        }
                        else if (MaterialData.currTable === '1') {
                            window.open(`/lookfile/${record.key}`, '_blank');
                        }
                        // else if (uploadData.currTable === '3') {
                        //     // console.log(record)
                        //     setUploadData((prve: any) => ({
                        //         ...prve,
                        //         isModalText: true,
                        //         addTextTitle: record.title,
                        //         text: record.text_content,
                        //         textCopyShow: true
                        //     }))
                        // }

                    }}>预览</a>
                    {/* <a>修改</a> */}
                    {/* <a onClick={() => {
                       console.log(record);
                    
                    }}>使用</a> */}
                </Space>
            ),
        },
    ];
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '个人素材',
            children: <Table size="large" rowSelection={rowSelection} columns={columns} dataSource={MaterialData.allData} pagination={{
                current: MaterialData.currPage,
                pageSize: MaterialData.pageSize,
                total: MaterialData.total,
                onChange: handleOnChange,
            }} />,
        },
        {
            key: '2',
            label: '公共素材',
            children: <Table size="large" rowSelection={rowSelectionPubilic} columns={columns} dataSource={MaterialData.allData} pagination={{
                current: MaterialData.currPage,
                pageSize: MaterialData.pageSize,
                total: MaterialData.total,
                onChange: handleOnChange,
            }} />,
        },
        {
            key: '3',
            label: '文本素材',
            children: <Table size="large" rowSelection={rowSelectionText} columns={columns} dataSource={MaterialData.allData} pagination={{
                current: MaterialData.currPage,
                pageSize: MaterialData.pageSize,
                total: MaterialData.total,
                onChange: handleOnChange,
            }} />,
        },

    ];



    return (

        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />


    )
}
export default ModelEssay