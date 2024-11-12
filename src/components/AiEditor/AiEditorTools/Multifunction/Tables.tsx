import React, { useEffect, useState } from 'react'
import styles from './index.less'
import TextArea from 'antd/es/input/TextArea'
import { Button, Spin, message } from 'antd'
import { useAppSelector } from '@/redux/storeIndex'
import { getSensitiveWords, getTableData } from '@/api/Aitool'
import marked from 'marked';

function Tables({ insertionAiEditor }: any) {
    let [tableData, setTableData] = useState({ textContent: '', TableShow: false, loadingShow: false, lookTable: '', createBut: true, insertionBtn: true })
    let { SelectData } = useAppSelector(state => state.firstDraftReducer)

    useEffect(() => {
        getSensitiveWords({ text: "购买毒品" }).then((res: any) => {
            // console.log(res.data.table_data);
            // setArr(marked(res.data.table_data))

        }).catch((error) => {
            message.error(error)
          })
    }, [])

    return (
        <div className={styles.tables}>
            {/* <div dangerouslySetInnerHTML={{ __html: arr }} /> */}
            <div className={styles.tables_content}>
                <div className={styles.tables_content_title}>
                    <div style={{ fontWeight: '400',marginBottom:'5px' }}>选中文字:</div>
                    <TextArea rows={5}
                        style={{ height: '120px' }}
                        onChange={(e) => {

                            setTableData((prve: any) => ({
                                ...prve,
                                textContent: e.target.value,
                                TableShow: false
                            }))
                        }} placeholder='请输入' value={tableData.textContent} />
                    <div className={styles.tables_content_title_but}>
                        <Button
                            size='small'
                            type="primary"
                            onClick={() => {
                                setTableData((prve: any) => ({
                                    ...prve,
                                    textContent: SelectData,
                                    createBut: false,
                                    TableShow: false,
                                    loadingShow: false,
                                }))

                            }}
                        >获取选中的文本</Button>
                    </div>

                </div>

                <Button style={{ width: '100%', marginTop: '10px' }}
                    disabled={tableData.createBut}
                    type='primary'
                    onClick={() => {
                        setTableData((prve: any) => ({
                            ...prve,
                            TableShow: true
                        }))
                        getTableData({ text: tableData.textContent }).then((res) => {
                            console.log(res.data);
                            setTableData((prve: any) => ({
                                ...prve,
                                loadingShow: true,
                                lookTable: res.data.table_data,
                                insertionBtn: false
                            }))
                        }).catch((error) => {
                            message.error(error)
                          })
                    }}
                >生成表格</Button>
                <div className={styles.tables_content_chart}>

                    {
                        tableData.TableShow ? <>
                            {
                                tableData.loadingShow ? <div className={styles.tables_content_chart_show} dangerouslySetInnerHTML={{ __html: tableData.lookTable }}>
                                </div> : <div className={styles.tables_content_chart_shows} >   <Spin /></div>
                            }
                        </> : <div className={styles.tables_content_chart_shows} >表格展示区</div>
                    }
                </div>
            </div>
            <div className={styles.tables_content_but}>
                <Button style={{ width: '100%',}}
                    disabled={tableData.insertionBtn}
                    type='primary'
                    onClick={() => {
                        insertionAiEditor(tableData.lookTable)
                    }}
                >插入编辑器</Button>
            </div>
        </div>
    )
}

export default Tables