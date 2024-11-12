import React, { useEffect, useState } from 'react'
// 引入子组件
import LongTextItems from '@/components/Homes/ConTent/LongText/LongTextItems/page'
import { EditOutlined, FileDoneOutlined, PlusOutlined } from '@ant-design/icons'
import { userFilesList } from '@/api/longText'
import Files from '../Files/Index'
import styles from './index.less'
import { v4 as uuidv4 } from 'uuid';
import { message, Row, Col, Tabs, TabsProps, Button, Modal } from 'antd'
import { history } from 'umi'
import { setloginButtonShow } from '@/redux/module/homeStore'
import { useAppDispatch } from '@/redux/storeIndex'
import { getTempletChildren, getTempletData } from '@/api/Templet'
import { faBullseye } from '@fortawesome/free-solid-svg-icons'
function Index({ setContent }: any) {
  let [contextHtml, setContextHtml] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  let [templateData, setTemplateData] = useState({ classFiy: [], currKey: '1', classFiyChildren: [] })
  let dispatch = useAppDispatch()
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 当文档变为可见时刷新页面
        getFileList()
      }
    };

    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);
    getTempletData().then((res) => {
      if (res.status === 200) {
        setTemplateData((prev: any) => ({
          ...prev,
          classFiy: res.data.data,
          currKey: res.data.data[0].category_id
        }))
        localStorage.setItem('templetTitle', JSON.stringify(res.data.data[0]))
        getTempletChildren({ category_id: res.data.data[0].category_id }).then((res) => {
          if (res.status === 200) {
            setTemplateData((prev: any) => ({
              ...prev,
              classFiyChildren: res.data.records
            }))
          }

        }).catch((error) => {
          message.error(error)
        })
      }
    }).catch((error) => {
      message.error(error)
    })
    // 清理函数 - 当组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);
  const [messageApi, contextHolder] = message.useMessage();
  let [fileList, setFileList] = useState([])


  // 获取附件列表
  let getFileList = () => {
    userFilesList().then((res) => {
      if (res.data.status.code == 200) setFileList(res.data.data)
    }).catch((error) => {
      let token = localStorage.getItem('token')
      if (!token) {

      }
      const loginTime = Number(localStorage.getItem('loginTime'));
      const tokenTime = Number(localStorage.getItem('tokenTime'));
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenTime < currentTime - loginTime) {
        messageApi.open({
          type: 'error',
          content: '登录超时，请重新登录',
        });
        dispatch(setloginButtonShow(false));
        history.push('/login')

        return;
      }

    })
  }
  useEffect(() => {
    getFileList()
  }, [])
  let handleOpen = () => {
    const id = uuidv4();
    console.log(id);
    window.open(`/LongTexts/${id}`, '_blank');
    // window.open(`/LongTexts/121342`, '_blank');
  }
  let handleCreate = (event: any, item: any) => {
    event.stopPropagation()
    localStorage.setItem('templetChildren', JSON.stringify(item))
    const id = uuidv4();
    window.open(`/LongTexts/${id}`, '_blank');
    setTimeout(() => {
      localStorage.removeItem('templetTitle')
      localStorage.removeItem('templetChildren')
    }, 10000)
  }
  let handleEdits = (item: any) => {
    const id = uuidv4();
    window.open(`/LongTexts/${id}`, '_blank');
    localStorage.setItem('templetsEdit', JSON.stringify(item))
    setTimeout(() => {
      localStorage.removeItem('templetsEdit')
    }, 3000)
  }
  const items: TabsProps['items'] = templateData.classFiy.map((itema: any, index: number) => {
    return {
      id: itema.category_id,
      key: itema.category_id,
      label: <div className={templateData.currKey === itema.category_id ? styles.active : styles.current} >{itema.name}</div>,
      children: <Row gutter={24}>
        {
          templateData.classFiyChildren.map((item: any, index: number) => {
            return <Col span={6} key={item.title} onClick={()=>{handleLook(item)}}>
              <div className={styles.templet_item} >
                <div className={styles.templet_item_left}>
                  <div className={styles.templet_item_title}>{item.title}</div>

                  <div className={styles.templet_item_btn}>
                    {
                      item.applicable_types !== 4 ? <span style={{ marginRight: '10px', }} onClick={() => handleCreate(event, item)} ><FileDoneOutlined /> 帮我生成</span> : ''
                    }
                    <span onClick={() => { handleEdits(item) }}><EditOutlined /> 编辑</span>
                  </div>
                </div>

                <div><img src={img} alt="" width={'120px'} /></div>
              </div>

            </Col>
          })
        }

        {/* {
          templetList.map((item: any, index: number) => {
            return <div key={item.id} className={styles.templet_item} >

              <div style={{ display: 'flex', alignItems: 'flex-end', padding: '1vh' }} onClick={() => { handleLook(item) }}>
                <Image width={40} height={40} src={TempletPng} alt=''></Image>
                <div style={{ paddingLeft: '1vw' }}>
                  <div style={{ fontSize: '1vw', fontWeight: '600' }}>{item.title}</div>
                  <div className={styles.templet_content_plain}>{item.content_plain}</div>
                </div>

              </div>
              <div style={{ fontSize: '1.3vh', textAlign: 'right', paddingTop: '1vh' }}>
                {
                  item.applicable_types !== 4 ? <span onClick={() => handleCreate(event, item)} ><FileDoneOutlined /> 帮我生成</span> : ''
                }
                <span style={{ marginLeft: '1vh' }} onClick={() => { handleEdits(item) }}><EditOutlined /> 编辑</span>
              </div>
            </div>


          })
        } */}
      </Row>
    }
  })
  const onChange = (key: string) => {
    setTemplateData((prev: any) => ({
      ...prev,
      currKey: key
    }))
    let arr = templateData.classFiy.find((item: any) => {
      return item.category_id === key
    })

    localStorage.setItem('templetTitle', JSON.stringify(arr))
    getTempletChildren({ category_id: key }).then((res) => {
      if (res.data.status.code === 200) {
        setTemplateData((prev: any) => ({
          ...prev,
          classFiyChildren: res.data.records
        }))
      }
    }).catch((error) => {
      message.error(error)
    })
  };

  //   点击查看模版
  const handleLook = (item: any) => {
    // console.log(item.content_html);
    setIsModalOpen(true);
    setContextHtml(item.content_html)
    // setContextTitle(item.title)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div style={{ marginTop: '2rem', }}>
      <div style={{ fontWeight: '700', fontSize: '20px' }}>写长文神器</div>
      <LongTextItems setContent={setContent} />

      <div style={{ margin: '10px 0', fontWeight: '700', fontSize: '20px' }}>在线模版</div>
      {/* <Row gutter={12}  >

        <Col span={4}  className={styles.file_list} onClick={handleOpen}>

          <div className={styles.file_img} style={{ background: '#F7F8FA', marginRight: '1vw', textAlign: 'center', height: '18vh', display: 'flex', alignItems: 'center', borderRadius: '1vw', justifyContent: 'center' }} >
            <PlusOutlined style={{ transform: 'scale(3)' }} />
          </div>

          <div className={styles.file_title}>新建文件</div>
          <span>您可以手动创建文件</span>

        </Col>

        {
          fileList.map((item, index) => {
            return <Files key={index} item={item} getFileList={getFileList} />
          })
        }
      </Row> */}
      <div >
        <Tabs
          onChange={onChange}
          type="line"
          tabBarGutter={20}
          items={items}
          defaultActiveKey='1'
        />
      </div>
      <Modal open={isModalOpen} width={'80%'} loading={loading} onOk={handleOk} okText={'应用'} cancelText={'收藏'} footer={false} onCancel={handleCancel} style={{ padding: '1vw', overflow: 'hidden' }}>
        {
          <div style={{ padding: '1vw', border: '1px solid #ccc', borderRadius: '1vw', marginTop: '1vw', overflow: 'auto', height: '80vh', userSelect: 'none', }} dangerouslySetInnerHTML={{ __html: contextHtml }} />
        }
      </Modal>
      {contextHolder}
    </div>
  )
}

export default Index
// function dispatch(arg0: { payload: any; type: "home/setloginButtonShow" }) {
//   throw new Error('Function not implemented.')
// }

let img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK8AAAB1CAYAAAA4N7E8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAi5SURBVHhe7Z3ZWuM4EEZ5/8eZF5jbuZ2bmW62buj+gLCE7IkT6Ix/BzGO+5clb3JZqYuDEQmOhU8q5ZJkzt7e93tFHqv123622GUs0++3u71SQOUVSl7eTOCVClxE5RVKUV4jcLLlJ/IUUXmFslq//yYvWGgE/kTlFQqLvAYV+IDKKxRb5DVA4GT3i57UU0HlFYpLXjBf7tIc+HQFVnmFUpY25MkETk5T4LO3t/SPpYjDJ/IaIPDmBCOwyisU38hryARO3ulJjhWVVyhV5TVsTiiF8JJ3OfqhBKauvOBUBPaT9+Fm//TXH0ogxn//2UhesD6BFELlFchBXv8LNhvrTdwCq7wCaSPyGmIWWOUVSFuR17CKVGCVVyBtywsQyZkAQ0blFUibaUOe2AT2kneXJEpg2o68hphWZXjJq4Sni8hriEVglVcoXcoLYlhWpPIKpWt5wdAntau8QgkhLxiywCqvULq6YGNkqzIGuLBT5RVKqMhrWGSrMrgkUlF5hRIy8hqGtqxI5RVKH/KCIa3KUHmFEjptyHNYlSFfYJVXKH1FXsM8RbrAKq9Q+oy8eSQLrPIKRYq8QOrCTpVXKJLkBRKXFam8QpEmL5C2KkPlFUrfF2w2JK3KUHmFIjHyGvDGYjKFRuUVitTIa5AQgVVeoUiXF/QdgVVeoSBtWKww40soy8NIXJ+T2lVepTa7lD5vcK3yKo1gUoXiDO8eRakLkyoUKq/SiG2faQM7IEXxReVVhguRKhROeVGyufkxjpbFckv7rfghOvJC3n++3keLytsMJlUoPOTd0ZMeC77yYmHiZJZECyIo67cLJlUoVF5PeTEh+/l1k7KOcos3J+u3C00beqSavDjReczJtzGcx1XeAVJF3pf0ZMdKfXn7Q9OGRpE3HjBHgfXbhfDIG7e8c428GfXl7Y9o5L24ftxf37zsv1w80MdtaLXhQKTVBrk5L4QdT3Cx8X70H9OXq93+bjTd/3vuFtlXXoWjF2w1gLj4KM9LW2S+SJyR2DdtUDia81bk68UoFfeNClvkebyk+zBo5G0GkyoUTnmXAuV9eJxTURnow/nVI90P0MjbDI28FcExMVFt3I9mdD9A5W2GylsRHBeT1MZ4sqL7ASpvM/SCrSI4Liapjcl0TfcDqpTKpvNttEBC1m8XTKpQDDLnrZo2PL/YL9qqDFKMJ0nKJsqtDg8HAhUEJqmN7z/GdD/AV94k+bUfT3GyUyLcxinvSp68F1eP+136McdELYJaL9uHoXrkjZP68mrOW5mfdxMqa54kFa6sTAaqyPuanuRY2cYpr7zIa8AatPWGD1bgIs0lLmgeeU3uaGMYj2vO2xOQePQ0z8AABoaO2fMYvtUGRBjclytWIAPrt4uiUCFxyotJLuykx8J84SevwkG6wcQKQfCc9/xqlOWriJDY+ny0d4lv2qBwmFShCJo23N1P0xc9rhKgffcwpc8PgUbeZkR/wYZ5tZh3m5e2CC6wqk4kbwOdVdYM0fK2kfM+vfgNKoxf7XMQukIjbzOYVKHoPOe9vH463MuVyMr4dvNC99MVGnmbwaQKxRlulFZG07RhNk+opDZCl+ayyEv6XSQbpJgm0ZLVeUm/XQjPeetHXtRfmaAucGHH9tcFvmkD/o0/W7gYC5CQ9dsFkyoUx5EXB1Ro1815cZFmG/1ygWHdUBdvR5GX9N98j8jLTnosfI6wWfpva0dZbbgfTamYvjw+L+h+26bKfN7JbPtxsuPbQgbWbxf9ypt+KaPOrLKvl6P9trAcvSqYNRZiAKNKzns40XGSTcwh/XbBpApFJzlv1fm2NlAbZvtvE+/5vOnJnaYRKlYgA+u3i6JQIWm92lC1NObi+vszfZ228I28+HhE9I2V7IKN9NtFVDlv1dKYC+Sk7HXaQuu8zWBShcIZeatUG+qWxlzc/nylr8f4dvuSLXXHJwB7vIhv5FU4TKpQtJrz1i2NucB+2evlwUUi3mj533t4tN+vwaCRtxlyqg04oELbN21oWhpzgf2z1zVAQvZ7rhlrvnVe3AIU/+Ucb+b/iaed5bwl/be1B5/zZqWxtBNMnrbAnSC/XIzo6z+9LOjvAPShLIXI5C30mYFqw+zjHgcxbiED67eLolAhaSXnbas05gKz04qv7ZNnT2ab337PUKXOixMdKyc5t6Ht0lgZOJ78+jQMYhTvzWvDVnKrMsLmE8GGuoUMrN8uikKFpDzypgfnShvaLo25yN+6CfdkYM9hTC3RtzTy4gR9fI/Imz/ZBpsMQ3ucRt5c/ym9y4sDLKHsdk9dlcZcYM4vVgqzx8q4+vZ77ltlhG0230ULZGD9diGn2kAoy3kRlZkkXVO3JMdWavjmvJB3sdxFS1ZtIP12ITrntUXerktjXXF+eVyx8K02KBwmVSicdV4mb4jSWFegrJbvy1HkJf3Xdnl7cNWGUKWxLsAfO18v1hG2ZvQqL/thnmLOe5le9DAphkR+1A2Rl/VbkU/lnDd0aawLEG0/5dXI2wgxkfdwMMftfOS9/dlPaaxt8n3KR17Wf2272gPIeZssqJTGkbwaeRvBpAqFO+f9SBswR5aJMERskVcZFl4575BLY4w6kRf9Z/e17ZT0U48diyTE57xDLo0x6uS8GGGbL3fp81MCbm3HI6WNec75n4XEK+edTDdRgWFi3BsYZIMUpN9FzPAwhAq1BexYJMGkCoUz51UOfEbewLBjkYXgyKsc6GdizhBy3v5w5rzaPpBPGwwh2rbjkdPWyCse/LEOCxaLmIWMNpo9zo5FEmKqDYoyJDTyKo1gUoWC5rzFrT6uj9sex7VA/jkh0cirNIJJFQrNeZWGaORVBorouQ3a1rZvOzQaeZVGMKlC4ZHz5u+OqNtYt/zc+yA458WT8p3EHFNtx9dm596HolAhySKvOQi2RR0PHcTkaHTYTJLWdlxtlwf2bZ+RN/1SBp50eKcqMcPOvQ9iqg2MfOTVbbxbdu5ls9//B9aBQBwzgFbEAAAAAElFTkSuQmCC'