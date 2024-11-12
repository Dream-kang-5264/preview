
"use client"
import { EditOutlined } from '@ant-design/icons'
import React from 'react'

import styles from './index.less'

import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import { setIndex, setLoginShow, } from '@/redux/module/homeStore';
import { getCreateRecord } from '@/api/outline'
import { setDecordId, setLongtitle, setComponentsType, sethistoryDecordId, sethistoryType, setoutlineLevel, setisAddHistory } from '@/redux/module/LongStore'
import { setthemeShow, setDefaulText } from "@/redux/module/homeStore";
import { message } from 'antd'
import { history } from 'umi';

import longImg from '../../../../../../public/icon/组 1 1.png'
import rewriteIcon from '../../../../../../public/home/Group 427319771.png'
import rewriteIcons from '../../../../../../public/home/Group 427319751.png'
import Addtext from '@/components/Addtext'
function Index({ setContent }: any) {
  const [messageApi, contextHolder] = message.useMessage();
  let dispatch = useAppDispatch()

  let leftData = {
    icon: <EditOutlined />,
    title: '长文写作',
    content: '一键生成万字长文'
  }

  let rightDatas = [
    {
      icon: <img src={rewriteIcon} alt='' width={40} height={40}></img>,
      title: '重构文辞',
      content: '重塑语言的魅力'
    },
    {
      icon: <img src={rewriteIcons} alt='' width={40} height={40}></img>,
      title: '范文仿写',
      content: '上传范文，轻松创作'
    },
  ]
  let rightData = [
    {
      icon: <EditOutlined />,
      title: '资料搜索',
      content: '亿级专业资料库'
    },
    {
      icon: <EditOutlined />,
      title: '全文校正',
      content: '文本就对纠错'
    },

  ]
  function RightDivs({ rightData }: any) {

    return (
      <div style={{ display: 'flex', width: '13vw', flexWrap: 'wrap', alignItems: 'stretch', flexDirection: 'column', gap: '1vw', lineHeight: '2vw', cursor: 'pointer' }} >
        {
          rightData?.map((item: any, index: number) => {
            return <div className={styles.right_div} key={index} style={{ background: '#fff', flex: 1, padding: ' 1vw', borderRadius: '1vw' }} >
              <div>{item.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '1vw' }}>{item.title}</div>
              <div>{item.content}</div>
            </div>


          })
        }
      </div>
    )
  }

  function RightDiv({ rightData }: any) {
    // 点击仿写或改写
    let handleOpen = async (index: number) => {
      dispatch(setisAddHistory(false))
      dispatch(setDefaulText(true))
      dispatch(setComponentsType([]))
      dispatch(setthemeShow(false))
      dispatch(sethistoryType([]))
      dispatch(setoutlineLevel('3'))
      dispatch(sethistoryDecordId(''))
      if (index === 0) {
        dispatch(setLongtitle(2))
      }
      if (index === 1) {
        dispatch(setLongtitle(3))
      }
      let { data } = await getCreateRecord()
      // console.log(data.chatId,'data.chatId');

      dispatch(setDecordId(data.chatId))
      history.push('/Addtext')
      // setContent(<Addtext></Addtext>)
      dispatch(setIndex(1))
      setTimeout(() => {
        dispatch(setDefaulText(false))
      }, 1000)
    }
    return (
      <div style={{ display: 'flex', width: '13vw', flexWrap: 'wrap', alignItems: 'stretch', flexDirection: 'column', gap: '1vw', lineHeight: '2vw', cursor: 'pointer', marginLeft: '2vh' }} >
        {
          rightData?.map((item: any, index: number) => {
            return <div className={styles.right_div} key={index} style={{ background: '#FAFBFF', flex: 1, padding: ' 1vw', borderRadius: '1vw', display: 'flex', justifyContent: 'space-between' }} onClick={() => handleOpen(index)}>

              <div>
                <div style={{ fontWeight: '700', fontSize: '1vw' }}>{item.title}</div>
                <div style={{ fontSize: '2vh' }}>{item.content}</div>
              </div>
              <div style={{ paddingTop: '3vw' }}>
                {item.icon}
              </div>
            </div>


          })
        }
      </div>
    )
  }
  // 点击长文写作
  let handleAdd = async () => {
    dispatch(setDefaulText(true))
    dispatch(setLongtitle(1))
    dispatch(setComponentsType([]))
    dispatch(sethistoryType([]))
    dispatch(setoutlineLevel('3'))
    dispatch(setthemeShow(false))
    dispatch(sethistoryDecordId(''))
    dispatch(setisAddHistory(false))
    const loginTime = Number(localStorage.getItem('loginTime'));
    const tokenTime = Number(localStorage.getItem('tokenTime'));
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenTime < currentTime - loginTime) {
      messageApi.open({
        type: 'error',
        content: '登录超时，请重新登录',
      });
      dispatch(setLoginShow(true));
      history.push('/login')
      return
    }

    let { data } = await getCreateRecord()
    dispatch(setDecordId(data.chatId))
    history.push('/Addtext')
    // setContent(<Addtext></Addtext>)
    dispatch(setIndex(1))
    setTimeout(() => {
      dispatch(setDefaulText(false))
    }, 1000)

  }
  return (
    <div style={{ width: '100%', display: 'flex', marginTop: '1rem', }}>
      <div onClick={handleAdd} style={{ width: '13vw', background: '#FAFBFF', borderRadius: '1rem', cursor: 'pointer', lineHeight: '2vw', padding: '1vw' }} className={styles.longText_}>
        <div style={{ fontSize: '1.5vw' }}>{leftData.icon}</div>
        <div style={{ fontWeight: '700', fontSize: '1vw' }}>{leftData.title}</div>
        <div style={{ fontSize: '1vw' }}>{leftData.content}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2vw' }}>
          <img width={100} height={100} src={longImg} alt="" style={{}} />
        </div>

      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', gap: '1vh' }}>
        {/* <RightPage rightPage={rightData} /> */}
        <RightDiv rightData={rightDatas}></RightDiv>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        <div> </div>  <div> </div>  <div> </div>  <div> </div>
        {/* <RightDivs rightData={rightData}></RightDivs>
        <RightDivs rightData={rightData}></RightDivs>
        <RightDivs rightData={rightData}></RightDivs> */}
      </div>
      {contextHolder}
    </div>
  )
}

export default Index
