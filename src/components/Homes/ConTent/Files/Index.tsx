import { DeleteOutlined } from '@ant-design/icons'
import { Tooltip, message,Col } from 'antd'
import React, { useState } from 'react'
import fileImg from '../../../../../public/longText.png'
import styles from './index.less'

import { userFilesDelete } from '@/api/longText'
function Files({ item, getFileList }: any) {
    


    let [delShow, setDelShow] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    // 点击跳转长文页
    let hanldeLongText = () => {
        window.open(`/LongTexts/${item.attachmentId}`, '_blank');
    }
    return (

        <Col span={4} className={styles.file_list} onMouseEnter={() => setDelShow(true)} onMouseLeave={() => setDelShow(false)} onClick={hanldeLongText}>

            {delShow ? <Tooltip className={styles.file_dle} placement="top" title={'删除文件'}>
                <DeleteOutlined style={{ color: 'blue' }} onClick={(e) => {
                    e.stopPropagation()

                    userFilesDelete({ attachment_id: item.attachmentId }).then((res) => {
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
                }} />
            </Tooltip>
                : ''}
            <img className={styles.file_img} width={500} height={500} src={fileImg} alt="" />
            <div className={styles.file_title}>{item.title}</div>
            <span>{item.created_at}</span>
            {contextHolder}
        </Col>
    )
}

export default Files
