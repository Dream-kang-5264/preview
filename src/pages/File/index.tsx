import { userFilesDelete, userFilesList } from '@/api/longText';
import { DeleteOutlined, EditOutlined, EyeOutlined, HeartTwoTone, InfoCircleFilled, InfoCircleOutlined, PlusOutlined, SearchOutlined, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Alert, Card, Typography, Button, Col, Input, Row, Tabs, TabsProps, message, Dropdown, MenuProps, Modal, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './file.less'
import { v4 as uuidv4 } from 'uuid';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';
import { userSaveTitle } from '@/api/Templet';
import { getAnnexDetails } from '@/api/outline';
import { userTitleSearch } from '@/api/file';
// import 'antd/dist/antd.css'; // 引入 Ant Design 的全局样式
const { Search } = Input;

const File: React.FC = () => {
  let dispatch = useAppDispatch()
  useEffect(() => {
    if (history.location.pathname !== '/Addtext') {
      dispatch(setComponentsType([]))
      dispatch(sethistoryType([]))
    }
    dispatch(setisAddHistory(false))
  }, [history])
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 当文档变为可见时刷新页面
        getFileList()
      }
    };

    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数 - 当组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  let [fileList, setFileList] = useState([])
  const [delModalOpen, setDelModalOpen] = useState(false);

  let [controls, setControls] = useState({ delId: '', editTitleId: '', isDelEditTitle: '', currTitle: '', changeValue: '', currId: '', lookValue: '' })
  // 获取附件列表
  let getFileList = () => {
    userFilesList().then((res) => {
      if (res.data.status.code == 200) setFileList(res.data.data)

    }).catch((err) => {

    })
  }
  useEffect(() => {
    getFileList()

  }, [])
  const tabItem: TabsProps['items'] = [
    {
      key: '1',
      label: <div style={{ fontSize: '18px', color: '#000', }}>我的文档</div>,
      children:
        <Row gutter={12}>
          {
            fileList.length > 0 ? fileList.map((item: any, index: number) => {
              return <Col span={4} key={index} style={{}} onClick={() => {
                window.open(`/LongTexts/${item.attachmentId}`, '_blank');
              }}>
                <div className={styles.file_list_item} >

                  <div className={styles.file_list_item_title}>
                    <div>  {item.title.replace(/\.[^/.]+$/, '')}   </div>
                    <EditOutlined
                      onClick={(e: any) => {
                        console.log(item);
                        e.stopPropagation()
                        setDelModalOpen(true)
                        setControls((prve: any) => ({
                          ...prve,
                          editTitleId: item.attachmentId,
                          isDelEditTitle: 'edit',
                          currTitle: item.title
                        }))
                      }}
                    />
                  </div>
                  <div className={styles.file_list_item_img}>
                    <img src="http://180.76.176.120/static/img/onlineWrite.72803902.png" alt="" />
                    <div className={styles.file_list_item_icon}>
                      <EyeOutlined onClick={(e: any) => {
                        e.stopPropagation()
                        setDelModalOpen(true)
                        setControls((prve: any) => ({
                          ...prve,
                          currId: item.attachmentId,
                          isDelEditTitle: 'look'
                        }))
                        getAnnexDetails({ attachment_id: item.attachmentId }).then((res) => {
                          if (res.data.status.code === 200) {
                            console.log(res.data.data[0].content);

                            setControls((prve: any) => ({
                              ...prve,
                              currId: item.attachmentId,
                              lookValue: res.data.data[0].content
                            }))
                          }
                        }).catch((err) => {

                        })
                      }} />
                      <DeleteOutlined onClick={(e: any) => {
                        e.stopPropagation()
                        setDelModalOpen(true)
                        setControls((prve: any) => ({
                          ...prve,
                          delId: item.attachmentId,
                          isDelEditTitle: 'del'
                        }))
                      }} />
                    </div>
                  </div>
                  <div className={styles.file_list_item_time}>
                    {item.created_at}
                  </div>
                </div>

              </Col>

            }) : <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 33vh)', display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Empty style={{ transform: 'scale(2)' }} /></div>
          }

        </Row>

    },
    // {
    //   key: '2',
    //   label: <div style={{ fontWeight: '600', fontSize: '1.3vw', color: '#000' }}>我的文档</div>,
    //   children: <div >

    //     222
    //   </div>
    // },

  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: MenuProps['items'] = [
    {
      label: <div onClick={() => {
        const id = uuidv4();
        window.open(`/LongTexts/${id}`, '_blank');
      }}>新建文档</div>,
      key: '0',
    },
    // {
    //   label: <a href="https://www.aliyun.com">2nd menu item</a>,
    //   key: '1',
    // },

  ];

  const handleOk = () => {
    setDelModalOpen(false);
    if (controls.isDelEditTitle === 'edit') {
      userSaveTitle({ attachment_id: controls.editTitleId, title: controls.changeValue }).then((res) => {
        console.log(res);
        if (res.data.status.code === 200) {
          messageApi.open({
            type: 'success',
            content: '修改成功',
          });
          getFileList()

        }
      }).catch((error) => {
        message.error(error)
      })
    } else if (controls.isDelEditTitle === 'del') {
      userFilesDelete({ attachment_id: controls.delId }).then((res) => {
        if (res.data.code === 200) {
          messageApi.open({
            type: 'success',
            content: '删除成功',
          });
          getFileList()
        }
      }).catch((error) => {
        message.error(error)
      })
    }

  };

  const handleCancel = () => {
    setDelModalOpen(false);
  };
  let onSearch = (value: string) => {
    userTitleSearch({ search_title: value }).then((res) => {
      // console.log(res);
      if (res.data.status.code === 200) {
        setFileList(res.data.data)
      }
    }).catch((error) => {
      message.error(error)
    })
  }
  return (
    <PageContainer
      className={styles.header}
    // style={{position:'relative'}}
    >
      <Row className={styles.search} style={{ display: 'flex', alignItems: 'center' }}>
        <Col span={18}> <Search placeholder="请输入关键词" onSearch={onSearch} enterButton /></Col>
        <Col span={2}></Col>
        <Col span={4}>

          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type='primary' style={{ background: '#1677FF', color: '#fff' }} onClick={() => {

            }}><PlusOutlined />新增</Button>
          </Dropdown>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" items={tabItem} onChange={onChange} />



      {contextHolder}

      <Modal title={controls.isDelEditTitle === 'look' ? '预览' : '提示'} width={controls.isDelEditTitle === 'look' ? 1000 : 400} style={{ height: '500px' }} open={delModalOpen} onOk={handleOk} onCancel={handleCancel}>

        {
          controls.isDelEditTitle === 'del' ? (
            <>
              <InfoCircleFilled size={20} style={{ color: '#f90', marginRight: '5px' }} />
              <span style={{ fontSize: '12px' }}>是否删除该文件？</span>
            </>
          ) : controls.isDelEditTitle === 'edit' ? (
            <>
              <div style={{ fontSize: '12px' }}>请输入名称</div>
              <Input
                defaultValue={controls.currTitle}
                onChange={(e) => {
                  setControls((prev) => ({
                    ...prev,
                    changeValue: e.target.value,
                  }));
                }}
              />
            </>
          ) : (
            <div className={styles.container} style={{ height: '500px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: controls.lookValue }} />
          )
        }

      </Modal>


    </PageContainer >
  );
};

export default File
