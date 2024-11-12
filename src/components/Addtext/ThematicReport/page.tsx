import React from 'react'

import chatAI from '../../../../public/2.svg'
function Index() {
    return (
        <div style={{ display: 'flex', paddingTop: '10px' }}>
            <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
            <p style={{background:'#F7F8FA',marginLeft:'1rem',padding:'.7rem',borderRadius:'.7rem',fontSize:'1vw'}}>请输入您的文章主题，尽可能完整哦</p>
        </div>
    )
}

export default Index
