
import React from 'react'
import { Flex, Progress } from 'antd';

import chatAI from '../../../../public/2.svg'

import { useAppDispatch } from '@/redux/storeIndex';
import { setComponentsType, setDecordId, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { getCreateRecord } from '@/api/outline';
function Index() {

  let dispatch = useAppDispatch()
  let handleAddRecord = async () => {

    let { data } = await getCreateRecord()
    dispatch(setDecordId(data.chatId))
    dispatch(setComponentsType([]))
    dispatch(sethistoryType([]))
    dispatch(setisAddHistory(false))
  }
  return (
    <div style={{ display: 'flex', marginTop: '10px' }}>
      <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
      <div style={{ marginLeft: '1rem' }}>
        <div style={{ background: '#F7F8FA', padding: '1rem', borderRadius: '1rem' }}>
          <p style={{fontSize:'1vw'}}>好的，后台正在努力帮您生成初稿&emsp;&ensp;<span style={{ color: '#999' }}>总共大约15分钟</span></p>
          <Progress percent={20} showInfo={false} strokeColor='#3570F8' size="small" />
        </div>
        <div style={{ padding: '.5rem 0', fontSize: '.8rem' }}>
          AI正在聚精会神写作，让我们换个地方继续聊天吧&emsp;
          <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleAddRecord}>新建对话</span>
        </div>
      </div>

    </div>
  )
}

export default Index
