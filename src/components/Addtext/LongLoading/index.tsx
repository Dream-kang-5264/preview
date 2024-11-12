import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';

import chatAI from '../../../../public/2.svg'


// export default App;
function index({ content }: any) {
  return (
    <Space style={{ marginTop: '10px' }}>

      <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
      <Spin indicator={<LoadingOutlined spin style={{ marginLeft: '1rem' }} />} />
      {/* {content} */}
    </Space>
  )
}
export default index