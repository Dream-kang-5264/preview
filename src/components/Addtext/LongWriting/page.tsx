import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import { setThesisCount, setThematiCount } from '@/redux/module/homeStore'

import { setComponentsType, setgetLongtext, setprogressShow, setUploadMaterialId } from '@/redux/module/LongStore'

import chatAI from '../../../../public/2.svg'

import Hat from '../../../../public/add/Frame.png'
import longImg from '../../../../public/webp.png'
import { CloseOutlined, CopyOutlined, FolderAddOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Spin, Upload, UploadProps, message } from 'antd';
import _ from 'lodash';
import styles from './index.less'
import { setFilesImitate, setFilesUpdate } from '@/api/longText';
import { uploadModelEssay } from '@/api/outline';
function Index({ isMaterialId }: any) {
    let dispatch = useAppDispatch()
    let { ThesisCount, ThematiCount } = useAppSelector(state => state.homeReducer)
    let { componentsType, Longtitle, createDecordId, getLongtext } = useAppSelector(state => state.longReducer)
    let components = JSON.parse(JSON.stringify(componentsType))
    let [title, setTitle] = useState('')
    let [describe, setDescribe] = useState('')
    let UpdateFile = useRef<HTMLInputElement>(null)
    // let [docxShow, setDocxShow] = useState(true)
    let [docxData, setDocxData] = useState({ template_id: '', title: '', docxShow: true, materialLoadding: false, materialSize: '', modelEssayLoadding: false, currupload: 1, modelEssaySize: '', modelEssayShow: true, modelEssaytitle: '', materials_id: '' })
    // let [MaterialId, setMaterialId] = useState('')
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        // console.log(Longtitle, '333333');
        switch (Longtitle) {
            case 0:
                setTitle('')
                setDescribe('Hello，我可以帮你看文件，也能陪你聊天、创作，让我们开始吧！')
                break;
            case 1:
                setTitle('长文写作')
                setDescribe('终于等到你喽！智笔可以帮你写一篇万字长文，你可以选择以下方式开启智能创作旅程～')
                break;
            case 2:
                setTitle('重构文辞')
                setDescribe('让智笔帮助您以全新的方式重写您的文本！选择智能创作，开启创意革新之旅！')
                break;
            case 3:
                setTitle('范文仿写')
                setDescribe('利用智笔的智能仿写功能，轻松生成与您上传的文本风格相似的全新内容。')
                break;
            default:
                break;
        }

    }, [Longtitle])
    useEffect(() => {
        // console.log(MaterialId);
        isMaterialId(docxData)
    }, [docxData])
    // 选择上传的文件
    let handleFile = (e: any) => {

        let progressId: any = _.cloneDeep(getLongtext)
        progressId.push(createDecordId)
        let file = e.target.files[0];
        if (e.target.files.length > 0) {
            // return
            if (docxData.currupload === 1) {
                setDocxData((prev: any) => ({
                    ...prev,
                    materialLoadding: true,
                    materialSize: (file.size / 1024).toFixed(2) + 'KB'
                }))
            }
            else if (docxData.currupload === 2) {
                setDocxData((prev: any) => ({
                    ...prev,
                    modelEssayLoadding: true,
                    modelEssaySize: (file.size / 1024).toFixed(2) + 'KB'
                }))
            }
            if (file) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (event: any) {
                    // 获取文件扩展名
                    let extension = file.name.split('.').pop().toLowerCase();
                    // 允许的文件类型数组
                    let allowedExtensions = ['docx', 'doc', 'word', 'md', 'txt'];
                    // 检查文件类型是否在允许的数组中
                    if (allowedExtensions.includes(extension)) {

                        // 文件类型符合要求，可以继续处理
                        // // 开启loading
                        // let loadingTypeCopy: any = _.cloneDeep(componentsType); // 克隆数组，避免直接修改原始数组
                        // // 使用 map 方法遍历数组并修改
                        // loadingTypeCopy.forEach((item: any, index: any) => {
                        //     if (item.type === 'ProgressType') {
                        //         loadingTypeCopy.splice(index, 1); // 删除 ProgressType 类型的元素
                        //     }
                        // })
                        // loadingTypeCopy.push({
                        //     type: 'ProgressType',
                        //     key: Math.floor(Math.random() * 99999999) + 1,
                        // });
                        // // 更新状态或进行其他操作

                        // dispatch(setgetLongtext(progressId))
                        // dispatch(setprogressShow(true));
                        // dispatch(setComponentsType(loadingTypeCopy));

                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('token', localStorage.getItem('token'));
                        formData.append('conversation_id', createDecordId)
                        // 判断用户选择的类型 改写还是仿写
                        if (Longtitle === 2) {

                            // 开启loading
                            let loadingTypeCopy: any = _.cloneDeep(componentsType); // 克隆数组，避免直接修改原始数组
                            // 使用 map 方法遍历数组并修改
                            loadingTypeCopy.forEach((item: any, index: any) => {
                                if (item.type === 'ProgressType') {
                                    loadingTypeCopy.splice(index, 1); // 删除 ProgressType 类型的元素
                                }
                            })
                            loadingTypeCopy.push({
                                type: 'ProgressType',
                                key: Math.floor(Math.random() * 99999999) + 1,
                            });
                            // 更新状态或进行其他操作
                            dispatch(setgetLongtext(progressId))
                            dispatch(setprogressShow(true));
                            dispatch(setComponentsType(loadingTypeCopy));
                            setFilesUpdate(formData).then((res) => {
                                // 获取成功后关闭loading
                                if (res.data.status.code === 200) {
                                    dispatch(setprogressShow(false));
                                    let delLoadingTypeCopy = _.cloneDeep(loadingTypeCopy)
                                    delLoadingTypeCopy.forEach((item: any, index: any) => {
                                        if (item.type === 'ProgressType') {
                                            delLoadingTypeCopy.splice(index, 1)
                                        }
                                    })
                                    // 渲染附件组件
                                    delLoadingTypeCopy.push({
                                        type: 'DraftType',
                                        key: Math.floor(Math.random() * 99999999) + 1,
                                        content: res.data
                                    })
                                    dispatch(setComponentsType(delLoadingTypeCopy))
                                    // 删除当前会话的id
                                    let progressIds: any = _.cloneDeep(getLongtext)
                                    progressIds.forEach((item: any, index: any) => {
                                        if (item === createDecordId) {
                                            progressIds.splice(index, 1)
                                        }
                                    })
                                    dispatch(setgetLongtext(progressIds))
                                }
                            }).catch((error) => {
                                message.error(error)
                            })
                        }
                        else if (Longtitle === 3) {
                            uploadModelEssay(formData).then((res) => {
                                // 获取成功后关闭loading
                                if (res.data.status.code === 200) {
                                    if (docxData.currupload === 1) {
                                        setDocxData((prev: any) => ({
                                            ...prev,
                                            template_id: res.data.attachmentId,
                                            title: res.data.title,
                                            docxShow: false,
                                            materialLoadding: false
                                        }))
                                        // setMaterialId(res.data.attachmentId)
                                    }
                                    else if (docxData.currupload === 2) {
                                        console.log(res, 'res');

                                        setDocxData((prev: any) => ({
                                            ...prev,
                                            materials_id: res.data.attachmentId,
                                            modelEssaytitle: res.data.title,
                                            modelEssayShow: false,
                                            modelEssayLoadding: false
                                        }))
                                        // setMaterialId(res.data.attachmentId)
                                    }




                                    // let delLoadingTypeCopy = _.cloneDeep(loadingTypeCopy)
                                    // delLoadingTypeCopy.forEach((item: any, index: any) => {
                                    //     if (item.type === 'ProgressType') {
                                    //         delLoadingTypeCopy.splice(index, 1)
                                    //     }
                                    // })

                                    // // // 渲染附件组件
                                    // delLoadingTypeCopy.push({
                                    //     type: 'DraftType',
                                    //     key: Math.floor(Math.random() * 99999999) + 1,
                                    //     content: res.data
                                    // })
                                    // dispatch(setComponentsType(delLoadingTypeCopy))


                                    // 删除当前会话的id
                                    // let progressIds: any = _.cloneDeep(getLongtext)
                                    // progressIds.forEach((item: any, index: any) => {
                                    //     if (item === createDecordId) {
                                    //         progressIds.splice(index, 1)
                                    //     }
                                    // })
                                    // dispatch(setgetLongtext(progressIds))
                                }
                            }).catch((error) => {
                                message.error(error)
                            })
                        }
                        // 在这里可以处理文件上传或其他操作
                    } else {
                        // 文件类型不符合要求，给出提示或进行其他处理
                        messageApi.open({
                            type: 'error',
                            content: '请上传 .docx, .doc,.txt, .word 或 .md 类型的文件',
                        });
                        setDocxData((prev: any) => ({
                            ...prev,
                            materialLoadding: false,
                            modelEssayLoadding: false
                        }))

                    }
                };
            }
        }
        else {
            message.warning('没有选择文件')
        }

    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
            <div style={{ background: '#F7F8FA', borderRadius: '10px', fontSize: '14px', padding: '10px', marginLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '1.2vw', fontWeight: '600' }}>{title}</div>
                <div style={{ marginTop: '10px' }}>{describe}</div>
                <input type="file" style={{ display: 'none' }} ref={UpdateFile} onChange={(e) => handleFile(e)} />
                <div className={styles.Imitative_writing} style={{ display: 'flex', marginTop: '.5rem', cursor: 'pointer', justifyContent: Longtitle === 1 ? 'space-around ' : ' space-between' }}>
                    {/* 选择文件 */}
                    {contextHolder}

                    {
                        Longtitle !== 0 ? <>

                            {
                                Longtitle === 1 ? <>
                                    {/* 左边 */}
                                    <div onClick={() => {
                                        components.forEach((item: any, index: number) => {
                                            if (item.type === 'thesisType') {
                                                components.splice(index, 1)
                                            }
                                        })
                                        let thesisType = {
                                            type: 'thesisType',
                                            key: Math.floor(Math.random() * 99999999) + 1,
                                        }
                                        components.push(thesisType)
                                        dispatch(setComponentsType(components))
                                        dispatch(setThesisCount(ThesisCount + 1),)


                                    }} style={{ display: 'flex', background: '#fff', width: '48%', alignItems: 'center', borderRadius: '1vh', fontSize: '1vw', padding: '1vw 0', justifyContent: 'space-around', border: '1px solid #ccc' }}>

                                        <img width={30} height={30} src={Hat} alt=' ' style={{ fontSize: '1vw' }} ></img>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span> 长文助手</span>
                                            <span style={{ color: '#999', fontSize: '.9vw' }}>背靠专业学术库，分分钟3w字</span>
                                        </div>
                                        <RightOutlined />


                                    </div>


                                    {/* 右边 */}
                                    <div onClick={() => {
                                        dispatch(setThematiCount(ThematiCount + 1))
                                    }} style={{ display: 'flex', width: '48%', alignItems: 'center', borderRadius: '1vh', fontSize: '1vw', padding: '1vw 0', justifyContent: 'space-around' }}>

                                    </div>
                                </>
                                    :
                                    <>
                                        {
                                            docxData.docxShow ?
                                                <div style={{ marginRight: '10px' }}>
                                                    {
                                                        Longtitle === 2 ? <div
                                                            style={{ display: 'flex', background: '#fff', width: '240px', alignItems: 'center', borderRadius: '10px', fontSize: '1vw', justifyContent: 'space-around', padding: '20px 0', border: '1px solid #ccc', }}
                                                            onClick={() => {

                                                                UpdateFile.current?.click()

                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', }}><CopyOutlined />上传素材
                                                            </div>
                                                            <div> <FolderAddOutlined style={{ fontSize: '20px' }} /></div>


                                                        </div> : <>
                                                            {
                                                                !docxData.materialLoadding ? <div
                                                                    style={{ display: 'flex', background: '#fff', width: '240px', alignItems: 'center', borderRadius: '10px', fontSize: '1vw', justifyContent: 'space-around', padding: '20px 0', border: '1px solid #ccc' }}
                                                                    onClick={() => {

                                                                        UpdateFile.current?.click()
                                                                        setDocxData((prev: any) => ({
                                                                            ...prev,
                                                                            currupload: 1
                                                                        }))
                                                                    }}
                                                                >
                                                                    <div style={{ display: 'flex', alignItems: 'center', }}><CopyOutlined />上传范文
                                                                    </div>
                                                                    <div> <FolderAddOutlined style={{ fontSize: '20px' }} /></div>


                                                                </div> : <div style={{ display: 'flex', background: '#fff', width: '240px', alignItems: 'center', borderRadius: '10px', fontSize: '1vw', justifyContent: 'space-around', padding: '20px 0', border: '1px solid #ccc' }}>
                                                                    <Spin size="default" />
                                                                </div>
                                                            }

                                                        </>
                                                    }

                                                </div>
                                                :
                                                <div className={styles.docx_content} style={{ marginRight: '10px' }}>
                                                    <div className={styles.docx_content_img}><img src={longImg} alt="" /></div>
                                                    <div className={styles.docx_content_text}>
                                                        <div className={styles.docx_content_text_title}> {docxData.title}</div>
                                                        <div className={styles.docx_content_text_size}>{docxData.materialSize}</div>
                                                    </div>
                                                    <div className={styles.docx_content_close} onClick={(e) => {


                                                        e.preventDefault();
                                                        setDocxData((prev: any) => ({
                                                            ...prev,
                                                            materialLoadding: false,
                                                            docxShow: true,
                                                            template_id: ''
                                                        }))
                                                    }}>
                                                        <CloseOutlined />
                                                    </div>
                                                </div>
                                        }
                                        {
                                            Longtitle !== 2 ?
                                                <div className={styles.upload_ModelEssay}>
                                                    {
                                                        docxData.modelEssayShow ? <div >
                                                            {
                                                                !docxData.modelEssayLoadding ? <div className={styles.upload_ModelEssay_text} onClick={() => {
                                                                    UpdateFile.current?.click()
                                                                    setDocxData((prev: any) => ({
                                                                        ...prev,
                                                                        currupload: 2
                                                                    }))
                                                                }}>

                                                                    <div style={{ display: 'flex', alignItems: 'center', }}><CopyOutlined />上传素材
                                                                    </div>
                                                                    <div> <FolderAddOutlined style={{ fontSize: '20px' }} /></div>

                                                                </div> : <>
                                                                    <div className={styles.upload_ModelEssay_spin}>
                                                                        <Spin size="default" />
                                                                    </div>
                                                                </>
                                                            }

                                                        </div> :
                                                            <div className={styles.docx_content}>
                                                                <div className={styles.docx_content_img}><img src={longImg} alt="" /></div>
                                                                <div className={styles.docx_content_text}>
                                                                    <div className={styles.docx_content_text_title}> {docxData.modelEssaytitle}</div>
                                                                    <div className={styles.docx_content_text_size}>{docxData.modelEssaySize}</div>
                                                                </div>
                                                                <div className={styles.docx_content_close} onClick={(e) => {

                                                                    e.preventDefault();
                                                                    setDocxData((prev: any) => ({
                                                                        ...prev,
                                                                        modelEssayLoadding: false,
                                                                        modelEssayShow: true,
                                                                        materials_id: ''

                                                                    }))
                                                                }}>
                                                                    <CloseOutlined />
                                                                </div>
                                                            </div>
                                                    }

                                                </div> : ''
                                        }

                                    </>

                            }

                        </> : <></>
                    }

                </div>

            </div>

        </div>
    )
}

export default Index
