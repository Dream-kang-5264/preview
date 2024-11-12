import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from './index.less'
import FullText from './FullText'
import Template from './Template'
import AiPicture from './AiPicture'
import GoldenSentence from './GoldenSentence'
import Material from './Material'
import { Button, Col, Row } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex'
import Multifunction from './Multifunction'
import AiMessage from './AiMessage'

function index({ AiEditorData, onhandleInsertion, templetTitle, templetChildren, isTemplateEdit, setAiEditorData, onInserContent, replaceContent, isThemeData, setGetSelectData, isMermaidBase64, isBase64Image, getSelectData, insertionAiEditor, AiEditorHtml, continueDisplace, continueInsertion, isEventStream, AiEditorClear, messageInsertEditor, onInsertion, AiEditorJson, onIsMarkdown, AiEditorText }: any) {
    let [content, setContent] = useState<any>(null)
    let [sceneTitle, setSceneTitle] = useState()
    let [sceneChildren, setSceneChildren] = useState()
    let [packupShow, setPackupShow] = useState(false)
    // let { toolTitle } = useAppSelector(state => state.firstDraftReducer)



    useLayoutEffect(() => {

        if (templetTitle && templetChildren) {
            setSceneTitle(templetTitle)
            setSceneChildren(templetChildren)
        }
    }, [templetChildren, templetTitle])
    useEffect(() => {
        // console.log(AiEditorHtml);
        switch (AiEditorData.currIndex) {
            case 1:
                setContent(<AiMessage messageInsertEditor={messageInsertEditor} ></AiMessage>)
                break;
            case 2:
                setContent(<FullText sceneTitle={sceneTitle} sceneChildren={sceneChildren} onInsertion={onInsertion} onhandleInsertion={onhandleInsertion} AiEditorJson={AiEditorJson} onIsMarkdown={onIsMarkdown} setAiEditorData={setAiEditorData} AiEditorText={AiEditorText}></FullText>)
                break;
            case 3:
                setContent(<Material AiEditorHtml={AiEditorHtml} onInserContent={onInserContent} replaceContent={replaceContent}></Material>)
                break;
            case 4:
                setContent(<Template setAiEditorData={setAiEditorData} setAitool={setContent} isSceneChildren={(e: any) => {
                    setSceneChildren(e)
                }} isScenetitle={(e: any) => {
                    setSceneTitle(e)
                }
                } isTemplateEdit={isTemplateEdit}></Template>)
                break;
            case 5:
                setContent(<GoldenSentence isThemeData={isThemeData}></GoldenSentence>)
                break;
            case 6:
                setContent(<Multifunction AiEditorHtml={AiEditorHtml} insertionAiEditor={insertionAiEditor} continueDisplace={continueDisplace} continueInsertion={continueInsertion} isEventStream={isEventStream} AiEditorClear={AiEditorClear} AiEditorJson={AiEditorJson}></Multifunction>)
                break;
            case 7:
                setContent(<AiPicture setGetSelectData={setGetSelectData} getSelectData={getSelectData} isMermaidBase64={isMermaidBase64} isBase64Image={isBase64Image}></AiPicture>)
                break;
            default:
                break;
        }


    }, [AiEditorData, sceneChildren, sceneTitle, templetTitle, templetChildren, AiEditorHtml])
    return (
        <div className={styles.AiEditorTools_body}>
            <Row className={styles.AiEditorTools_title} gutter={8} >
                <Col className={styles.AiEditorTools_title_left} span={24}>
                    {AiEditorData.currTitle}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {content}
                </Col>
            </Row>
            <div onMouseEnter={() => setPackupShow(true)} onMouseLeave={() => setPackupShow(false)}>

                {
                    packupShow ? <div className={styles.AiTool_packup} onClick={() => {
                        setAiEditorData((prve: any) => ({
                            ...prve,
                            AiEditorCol: 22,
                            toolCol: 0,
                            outlineTop: '15%',
                            timeCol: 8,
                            BtnCol: 4,
                            toolShow: false,

                        }))
                    }}>
                        <DoubleRightOutlined />
                    </div> :
                        <div className={styles.AiTool_packups} onClick={() => {
                        }}>
                        </div>
                }

            </div>
        </div>
    )
}

export default index



