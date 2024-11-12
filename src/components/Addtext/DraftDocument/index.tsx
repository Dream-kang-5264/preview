import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import { setattachmentId } from '@/redux/module/LongStore';

import chatAI from '../../../../public/2.svg'
import webpImg from '../../../../public/webp.png'
import Downloads from '../../../../public/add/Frame2.png'
import rightOpen from '../../../../public/add/Frame(3).png'
function Index(props: any) {
    let dispatch = useAppDispatch()
    let { attachmentIds } = useAppSelector(state => state.longReducer)
    let { title, attachmentId } = props
    let [border, setBorder] = useState(true)
    // 点击跳转长文新页面
    let handleOpen = () => {

        //    return
        window.open(`/LongTexts/${attachmentId}`, '_blank')
    }
    return (
        <div style={{ display: 'flex', margin: '1rem 0 0 0rem', marginBottom: '10px', fontSize: '1vw' }}>
            <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8vw', height: '2.8vw', background: '#F7F8FA' }} />
            <div>
                <div style={{ padding: '.5rem', background: '#F7F8FA', marginLeft: '1rem', borderRadius: '1rem', width: '20vw' }}>
                    <div style={{ paddingLeft: '.5rem' }}>已为您生成初稿，请点击查看</div>
                    <div onMouseLeave={() => {
                        setBorder(!border)
                    }}
                        onMouseEnter={() => {
                            setBorder(!border)
                        }}
                        className="draft" style={{ border: border ? '1px solid #DEE3EC' : '1px solid blue', marginTop: '0', borderRadius: '1vh', padding: '.5rem', margin: '1vh 3vh 1vh 3vh', cursor: 'pointer', display: 'flex', alignItems: 'center', }}
                        onClick={handleOpen}
                    >


                        <img width={53} height={10} src={webpImg} alt="" style={{ borderRadius: '50%', width: '2vw', height: '2vw', background: '#fff', }} />
                        <div style={{ flex: '1', width: '10vw' }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginTop: '.3rem', marginLeft: '1vh'}} >{title}</div>
                            <div style={{ marginLeft: '.4rem', fontSize: '.8vw', color: '#999' }}>DOCX,60KB</div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <img src={Downloads} width={15} height={15} alt='' style={{ marginRight: '1vh' }}></img>
                            <img src={rightOpen} width={15} height={15} alt=''></img>
                        </div>
                    </div>




                </div>
                {/* <div style={{ marginLeft: '1.5rem', marginTop: '.5vw', fontSize: '.7vw' }}> <ExclamationCircleOutlined style={{ marginRight: '1vh' }} />本文档仅限个人使用，禁止商用</div> */}

            </div>
        </div>
    )
}

export default Index
