import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { getSummary } from '@/api/Aitool/index.tsx'
import { Spin, message } from 'antd'
function ExtractAndCompile({ AiEditorHtml }: any) {
    let [SummaryData, setSummaryData] = useState<any>()
    useEffect(() => {
        getSummary({ text: AiEditorHtml }).then((res) => {
            // console.log(res)
            setSummaryData(res.data.table_data)
        }).catch((error) => {
            message.error(error)
          })
    }, [AiEditorHtml])
    return (
        <div className={styles.extractAndCompile}>

            {
                SummaryData ? SummaryData.map((item: any, index: number) => {
                    return <div className={styles.extractAndCompile_list}>
                        {item}
                    </div>
                }) : <div className={styles.loading}> <Spin size='large' /></div>
            }


        </div>
    )
}

export default ExtractAndCompile
