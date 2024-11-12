import { Table } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useState } from 'react'
interface DataType {
    key?: any;
    error_word?: string;
    mistake_word?: string;
    suggestion_word?: string;
    exception_context?: string;
    error_reason?: string;
    reference_description?: string;
    reference_link?: string;
    added_time?: string;
}

function NewTable({ tableData, tableColumns, tableCurrPage, tablePageSize, tableTotal, handleOnChange, isSelectedRowKeys }: any) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        isSelectedRowKeys(newSelectedRowKeys)
    };
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
    return (
        <div>
            <Table<DataType>
                rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} pagination={{
                    current: tableCurrPage,
                    pageSize: tablePageSize,
                    total: tableTotal,
                    onChange: handleOnChange,
                }} />
        </div>
    )
}

export default NewTable
