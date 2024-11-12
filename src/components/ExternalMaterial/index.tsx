import { getAllExternalMaterial, getMaterialSource } from '@/api/MaterialGrab';
import { Button, Col, message, Row, Space, Table, TableColumnsType, Tabs, TabsProps } from 'antd'
import Search from 'antd/es/input/Search'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
interface DataType {
  key: React.Key;
  name: string;
  description: string;
  uploadTime: string;
  type?: string;
  id?: number | string; // 文件大小
  url?: string;
  status?: string;
  title?: string;
  pub_time?: any;
}
// 外部素材
function index() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  let [ExternalMaterialData, setExternalMaterialData] = useState({ currPage: 1, pageSize: 10, total: 0, allData: [], materialSourceData: [{ id: '', source_name: '全部' }], currType: 'type_1', searchText: '', currTypeId: '' })
  useEffect(() => {
    onTabChange('1')
    MaterialSource()
  }, [])
  // 数据来源类型
  let MaterialSource = () => {
    getMaterialSource({}).then((res) => {
      if (res.status === 200) {
        // console.log(res.data.records);
        setExternalMaterialData((prev: any) => ({
          ...prev,
          materialSourceData: [
            ...prev.materialSourceData,  // 保留原有的数据
            ...res.data.records           // 追加新的数据
          ]
        }));
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  // 抓取记录的状态方法
  let statusRender = (status: string) => {
    switch (status) {
      case 'active':
        return '运行中'
        break;
      case 'stopped':
        return '已停止'
        break;
      case 'error':
        return '出错'
        break;
      default:
        break;
    }
  };
  // 网站抓取的数据
  let WebsiteCrawlingData = (currTypeId: string, page: any, currType: any, searchText: any) => {

    getAllExternalMaterial({
      source_id: currTypeId,
      page: page,
      type: currType,
      search_title: searchText
    }).then((res) => {
      if (res.status === 200) {
        const data: DataType[] = res.data.records.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          pub_time: item.pub_time,
          status: statusRender(item.status),
        }));

        setExternalMaterialData((prve: any) => ({
          ...prve,
          allData: data,
          total: res.data.total,
        }))
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  const onTabChange = (key: string) => {
    const currType = key === '1' ? 'type_1' : 'type_2'; // 根据 tab 改变当前类型

    setExternalMaterialData((prev: any) => ({
      ...prev,
      currType: currType,
      searchText: '', // 切换类型时清空搜索文本,
      currPage: 1,
    }));
    WebsiteCrawlingData('', 1, currType, ExternalMaterialData.searchText); // 切换 tab 时调用数据获取方法
  };
  // 分页
  let handleOnChange = (page: number) => {
    setExternalMaterialData((prev: any) => ({
      ...prev,
      currPage: page
    }))
    WebsiteCrawlingData(ExternalMaterialData.currTypeId, page, ExternalMaterialData.currType, ExternalMaterialData.searchText);
  }
  // 网站抓取搜索key
  let onSearch = (key: any) => {
 
    if(!key) return message.warning('请输入关键字')

    setExternalMaterialData((prev: any) => ({
      ...prev,
      searchText: key
    }))
    WebsiteCrawlingData(ExternalMaterialData.currTypeId, 1, ExternalMaterialData.currType, key)
  }



  const columns: TableColumnsType<DataType> = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '35%',
      key: 'title'
    },

    {
      title: '发布时间',
      dataIndex: 'pub_time',
      key: 'pub_time',
      width: '20%',
      // render: (_, record) =>(
      //     <div><Switch defaultChecked onChange={onSwitchChange} /> 私密</div>
      // )
    },
    // {
    //   title: '当前状态',
    //   dataIndex: 'status',
    //   // width: '15%',
    // },
    {
      title: '素材描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          {/* <a>删除</a> */}
          <a
            onClick={() => {
              // console.log(record);
              // return
              window.open(`/lookExternalMaterial/${record.id}`, '_blank');
            }}
          >预览</a>
        </Space>
      ),
    },
  ];
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <div className={styles.classFiy_title}> 网站抓取</div>,
      children: <>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{ backgroundColor: '#fff' }}
          onChange={(key: any) => {
            setExternalMaterialData((prev: any) => ({
              ...prev,
              currPage: 1,
              currTypeId: key,
              searchText: '',
            }))
            WebsiteCrawlingData(key, 1, ExternalMaterialData.currType, ExternalMaterialData.searchText)
          }}
          items={ExternalMaterialData.materialSourceData.map((item: any, index: number) => {

            return {
              label: item.source_name,
              key: item.id,
              children: <>
                <Table size="large" columns={columns} dataSource={ExternalMaterialData.allData} pagination={{
                  current: ExternalMaterialData.currPage,
                  pageSize: ExternalMaterialData.pageSize,
                  total: ExternalMaterialData.total,
                  onChange: handleOnChange,
                }} />
              </>
            }
          })}
        // items={[
        //   {
        //     label: '全部',
        //     key: '1',
        //     children: <>
        //       <Table size="large" rowSelection={rowSelection} columns={columns} dataSource={ExternalMaterialData.allData} pagination={{
        //         current: ExternalMaterialData.currPage,
        //         pageSize: ExternalMaterialData.pageSize,
        //         total: ExternalMaterialData.total,
        //         onChange: handleOnChange,
        //       }} />
        //     </>,
        //   },
        //   {
        //     label: '其他分类',
        //     key: '2',
        //     children: '正在开发中',

        //   },

        // ]}
        />

      </>,
    },
    {
      key: '2',
      label: <div className={styles.classFiy_title}>公众号抓取</div>,
      children: '正在开发中',
    },
    // {
    //   key: '3',
    //   label: 'Tab 3',
    //   children: 'Content of Tab Pane 3',
    // },
  ]

  return (
    <div>
      <Row style={{ padding: '10px 0' }}>
        <Col span={6}>
          <Search placeholder="请输入关键字" onSearch={onSearch} enterButton onChange={(e) => setExternalMaterialData((prev: any) => ({
            ...prev,
            searchText: e.target.value
          }))} value={ExternalMaterialData.searchText} />
        </Col>
    
      </Row >
    
      <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} className={styles.ExternalMaterial_tabs} tabBarStyle={{ backgroundColor: '#fff' }} />
    </div>
  )
}

export default index