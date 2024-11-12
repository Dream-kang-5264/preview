import { Button, Col, Row, Steps, Tabs, TabsProps, message } from 'antd'
import React, { ReactElement, useEffect, useState, useLayoutEffect, useRef } from 'react'
import styles from './index.less'
import Theme from './FullTextComponents/Theme'
import { getTemplateType4, getTempletChildren } from '@/api/Templet'
import { getFormatType, getTempletType } from '@/api/written'
import Outline from './FullTextComponents/Outline'
import Extract from './FullTextComponents/Extract'
import Written from './FullTextComponents/Written'
import { FontColorsOutlined, SyncOutlined } from '@ant-design/icons'
import { text } from 'express'
function FullText({ onInsertion, sceneTitle, sceneChildren, AiEditorJson, onIsMarkdown, setAiEditorData, AiEditorText }: any) {
    let [currTaps, setCurrTabs] = useState('1')
    let [isFalg, setIsFalg] = useState(false)
    let [currSteps, setCurrSteps] = useState(0)
    let [writtenType, setWrittenType] = useState<ReactElement<any, any>>()
    let [homesType, setHomesType] = useState<ReactElement<any, any>>()
    let thenrRef = useRef<any>()
    let [insertion, setInsertion] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    let [sendServer, setSendServer]: any = useState({ scene: '', article_number: '', style: '', material: '', optionsValue: '', optionChildrenValue: [], last: true, options: [], optionChildren: [], disdisabledBut: false, material_id: '', template_id: '', disdisabledLaststep: false, data: '', formType: '', Messagefroms: [], disabledLayoutBut: false, Writtenloading: false })
    // console.log(sceneTitle, sceneChildren);
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        getTemplateType4().then((res) => {
            setSendServer((prev: any) => ({
                ...prev,
                options: res.data.data,
                homeOptions: res.data.data.filter((item: any) => item.name === '通用'),
            }))

            let home = res.data.data.filter((item: any) => item.name === '通用')

            if (!sendServer.optionChildrenValue || sendServer.optionChildrenValue.length === 0) {
                getTempletChildren({ category_id: home[0].category_id }).then((result) => {
                    setSendServer((prev: any) => ({
                        ...prev,
                        optionChildren: result.data.records,
                        optionChildrenValue: result.data.records[0].title
                    }))
                    getTempletType({ template_id: result.data.records[0].id }).then((res) => {
                        setSendServer((prev: any) => ({
                            ...prev,
                            fields: res.data.fields,
                            scene: res.data.template_id
                        }))

                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }

        }).catch((error) => {
            message.error(error)
        })
        return () => {
            // setSendServer(null)
            // console.log('销毁');
            // localStorage.removeItem('')
        }
    }, [])
    useEffect(() => {
        if (isFalg) {
            switch (currSteps) {
                case 0:
                    setWrittenType(<Theme ref={thenrRef} sendServer={sendServer} setSendServer={setSendServer} sceneTitle={sceneTitle} sceneChildren={sceneChildren} currTaps={currTaps} handleChange={handleChange}></Theme>)
                    break;
                case 1:
                    setWrittenType(<Written isFalg={isFalg} onInsertion={onInsertion} onIsMarkdown={onIsMarkdown} setSendServer={setSendServer} sendServer={sendServer} AiEditorJson={AiEditorJson} setAiEditorData={setAiEditorData}></Written>)
                    break;

                default:
                    break;
            }


        }
        else {
            switch (currSteps) {
                case 0:
                    setHomesType(<Theme ref={thenrRef} sendServer={sendServer} setSendServer={setSendServer} sceneTitle={sceneTitle} sceneChildren={sceneChildren} handleChange={handleChange} currTaps={currTaps}></Theme>)
                    break;
                case 1:
                    setHomesType(<Outline sendServer={sendServer} setSendServer={setSendServer}></Outline>)
                    break;
                case 2:
                    setHomesType(<Extract sendServer={sendServer} setSendServer={setSendServer}></Extract>)
                    break;
                case 3:
                    setHomesType(<Written isFalg={isFalg} onInsertion={onInsertion} onIsMarkdown={onIsMarkdown} setSendServer={setSendServer} sendServer={sendServer} AiEditorJson={AiEditorJson}></Written>)
                    break;

                default:
                    break;
            }
        }
    }, [currSteps, sendServer, isFalg, sceneTitle, sceneChildren, setAiEditorData])
    let handleChange = (value: string, flag: boolean,) => {
        setCurrTabs(value)
        setIsFalg(flag)
    }
    let getHomes = () => {
        getTemplateType4().then((res) => {
            setSendServer((prev: any) => ({
                ...prev,
                options: res.data.data,
                homeOptions: res.data.data.filter((item: any) => item.name === '通用'),
            }))
            let home = res.data.data.filter((item: any) => item.name === '通用')
            getTempletChildren({ category_id: home[0].category_id }).then((result) => {
                setSendServer((prev: any) => ({
                    ...prev,
                    optionChildren: result.data.records,
                    optionChildrenValue: result.data.records[0].title
                }))
                getTempletType({ template_id: result.data.records[0].id }).then((res) => {

                    setSendServer((prev: any) => ({
                        ...prev,
                        fields: res.data.fields,
                        scene: res.data.template_id
                    }))

                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);

            });

        }).catch((error) => {
            message.error(error)
        })
    }
    const itemss: TabsProps['items'] = [
        {
            key: '1',
            label: '分步生成',
            children: <div className={styles.writtenTool_body_TabsA}>
                <Steps
                    className={styles.writtenTool_body_steps}
                    size="small"
                    current={currSteps}
                    progressDot
                    // onChange={handleStepsChange}
                    items={[
                        {
                            title: '主题',
                        },
                        {
                            title: '大纲',

                        },
                        {
                            title: '摘编',

                        },
                        {
                            title: '成文',

                        },
                    ]}
                />
                {
                    homesType
                }
            </div>,
        },
        {
            key: '2',
            label: '直接生成',
            children: <div className={styles.writtenTool_body_TabsA} ref={scrollRef}>
                <Steps
                    className={styles.writtenTool_body_steps}
                    size="small"
                    current={currSteps}
                    progressDot
                    // onChange={handleStepsChange}
                    items={[
                        {
                            title: '主题',
                        },

                        {
                            title: '成文',

                        },
                    ]}
                />
                {
                    writtenType
                }
            </div>,
        },

    ];
    const onChange = (key: any,) => {
        if (key === '1') {
            setIsFalg(false)
            setSendServer((prev: any) => ({
                ...prev,
                optionChildren: [],
                optionsValue: ['通用'],
                optionChildrenValue: [],
                article_number: '',
                style: '',
                material: '',
                sceneTitle: '',
                sceneTextarea: '',
                sceneDate: '',
                sceneSelect: '',
                disdisabledBut: false
            }))
            getHomes()
        }
        else {
            setIsFalg(true);
        }
        setCurrTabs(key)
        setCurrSteps(0)
    };
    // 下一步
    let handleNext = async () => {
        if (sendServer.optionsValue === '通用' && sendServer.optionChildrenValue <= 0) return messageApi.open({
            type: 'warning',
            content: '请选择写作场景',
        })
        if (!sendServer.scene) {
            setSendServer((prve: any) => ({
                ...prve,
                scene: sendServer.homeOptions[0].category_id

            }))
        }
        if (thenrRef.current) {
            // console.log(thenrRef.current);

            return thenrRef.current.validateFields().then((values: any) => {

                if (values.length !== sendServer.fields.length) {
                    values = { ...values, ...sendServer.messageValue }
                }
                // console.log(values, 'values222');
                function combineFieldsAndValues(fields: any, values: any) {
                    const combined: any = [];
                    // 遍历字段定义
                    fields.forEach((field: any) => {
                        const fieldName = field.field_name;
                        const fieldValue = values[field.field_order]; // 使用 field_order 作为键获取值

                        // 检查是否找到了对应的值
                        if (fieldValue !== undefined) {
                            combined.push({
                                field_name: fieldName,
                                value: fieldValue
                            });
                        }
                    });


                    return combined;
                }

                let arr = combineFieldsAndValues(sendServer.fields, values)
                // let arr = { ...combineFieldsAndValues(sendServer.fields, values), ...sendServer.messageValue }


                // return
                setSendServer((prev: any) => ({
                    ...prev,
                    disdisabledBut: true,
                    disabledLayoutBut: true,
                    last: false,
                    user_information: arr,
                    froms: values,
                    style: sendServer.style ? sendServer.style : '专业严谨',
                    article_number: sendServer.article_number ? sendServer.article_number : '500'
                }));
                setCurrSteps(prevSteps => prevSteps + 1);

            }).catch((errorInfo: any) => {

                message.warning('请输入必选项')
                // 如果验证失败，则阻止后续操作
                return;
            });

        }
        setSendServer((prev: any) => ({
            ...prev,
            last: false,
            disdisabledBut: true
        }));
        setCurrSteps(prevSteps => prevSteps + 1);


    }
    // 上一步
    let handleLast = () => {
        // console.log(sendServer, '上一步');

        setSendServer((prev: any) => ({
            ...prev,
            last: true,
            sceneDate: sendServer.time,
            disdisabledBut: false
        }));
        setCurrSteps(prevSteps => prevSteps - 1);
    }
    // 重新生成
    let handleAgain = () => {
        setCurrSteps(prevSteps => prevSteps - 1);
        setSendServer((prev: any) => ({
            ...prev,
            last: false,
            disdisabledBut: true
        }));
        setTimeout(() => {
            setCurrSteps(prevSteps => prevSteps + 1);
        },);


    }
    // 排版
    let handleLayout = () => {
        setSendServer((prev: any) => ({
            ...prev,
            last: false,
            disabledLayoutBut: true,
            Writtenloading: false,
            disdisabledBut: true
        }));
        setAiEditorData((prve: any) => ({
            ...prve,
            editorLoadingShow: true
        }))
        
        // console.log(AiEditorJson.content[0].content[0].text, '发给后端的数据');
        // console.log(AiEditorText);
        // return
        const processText = (text) => {
            // 使用正则表达式匹配所有换行符
            // 使用正则表达式匹配所有换行符
            return text
                .split('\n')
                .map((line) => line.trim() ? `<p>${line}</p>` : '')
                .join(''); // 将所有字符串连接成一个单一字符串
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(processText(AiEditorText), 'text/html');


        // 提取所有 <p> 标签内容，保留标签
        const paragraphs = Array.from(doc.querySelectorAll('p')).map((p, index) => ({
            content: p.outerHTML, // 使用 outerHTML 保留 <p> 标签
            lineNumber: index + 1 // 行号从 1 开始
        }));
        // console.log(processText(originalText));
        getFormatType({ text: JSON.stringify(paragraphs) }).then((res: any) => {

            if (res.data.status.code === 200) {

                const result = JSON.parse(`"${res.data.acqoie
                    }"`)
                console.log(result);
                function dataArray(result: any) {
                    let output: any = []
                    result.split('\n').forEach(line => {
                        // 提取行号和内容
                        const match = line.match(/<(\d+),(.+)>/);
                        if (match) {
                            const key = match[2].trim();
                            const lineNumber = match[1];
                            output.push({ lineNumber, key });
                        }
                    });
                    return output
                }
                dataArray(result).forEach(item => {
                    const targetParagraph = paragraphs.find(p => p.lineNumber === parseInt(item.lineNumber));
                    if (targetParagraph) {
                        if (item.key === "公文标题") {
                            // 应用公文标题的 HTML 格式
                            const newContent = `<p style="line-height: 150%; text-align: center"><span style="font-family:SimSun; font-size: 30px"><strong>${targetParagraph.content.replace(/<[^>]+>/g, '')}</strong></span> </p>`;
                            targetParagraph.content = newContent;
                        } else if (item.key === "主送机关") {
                            // 应用主送机关的 HTML 格式
                            const newContent = `<p style="line-height: 150%; text-indent: 2em" data-indent="1"><span style="font-family: FangSong; font-size: 22px"><strong>${targetParagraph.content.replace(/<[^>]+>/g, '')}</strong></span> </p>`;
                            targetParagraph.content = newContent;
                        }
                        else if (item.key === "一级标题") {
                            // 应用主送机关的 HTML 格式
                            const newContent = `<p style="line-height: 150%; text-indent: 2em" data-indent="1"><span style="font-family: SimHei; font-size: 22px">${targetParagraph.content.replace(/<[^>]+>/g, '')}</span></p>`;
                            targetParagraph.content = newContent;
                        }
                        else if (item.key === "二级标题") {
                            // 应用主送机关的 HTML 格式
                            const newContent = `<p style="line-height: 150%; text-indent: 2em" data-indent="1"><span style="font-family: KaiTi; font-size: 22px">${targetParagraph.content.replace(/<[^>]+>/g, '')}</span></p>`;
                            targetParagraph.content = newContent;
                        }
                        else if (item.key === "三级标题") {
                            // 应用主送机关的 HTML 格式
                            const newContent = `<p style="line-height: 150%; text-indent: 2em" data-indent="1"><span style="font-family: FangSong; font-size: 22px">${targetParagraph.content.replace(/<[^>]+>/g, '')}</span></p>`;
                            targetParagraph.content = newContent;
                        }
                        else if (item.key === "正文内容") {
                            // 应用主送机关的 HTML 格式  
                            const newContent = `<p style="line-height: 150%; text-indent: 2em" data-indent="1"><span style="font-family: FangSong; font-size: 22px">${targetParagraph.content.replace(/<[^>]+>/g, '')}</span></p>
                            `;
                            targetParagraph.content = newContent;
                        }
                        else if (item.key === "成文日期") {
                            // 应用主送机关的 HTML 格式   署名
                            const newContent = `<p style="text-align: right"><span style="font-family: FangSong; font-size: 22px">${targetParagraph.content.replace(/<[^>]+>/g, '')}</span></p>`;
                            targetParagraph.content = newContent;
                        }
                        else if (item.key === "署名") {
                            // 应用主送机关的 HTML 格式   署名
                            const newContent = `<p style="text-align: right"><span style="font-family: FangSong; font-size: 22px">${targetParagraph.content.replace(/<[^>]+>/g, '')}</span></p>`;
                            targetParagraph.content = newContent;
                        }
                    }
                });

                // 输出修改后的 paragraphs 数组
                // console.log(paragraphs);
                const contents = paragraphs.map(paragraph => paragraph.content);

                // 将所有 content 字段连接成一个字符串
                const fullContent = contents.join('');
                onInsertion(fullContent.replace(/\n/g, '').replace(/>\s+</g, '><'))
                // 输出拼接后的字符串
                // console.log(fullContent.replace(/\n/g, '').replace(/>\s+</g, '><'));
                // console.log(dataArray(result));
                setAiEditorData((prve: any) => ({
                    ...prve,
                    editorLoadingShow: false
                }))
                setSendServer((prev: any) => ({
                    ...prev,
                    disdisabledBut: false,
                }));
            }

        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end", });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [insertion, onInsertion])
    return (
        <div className={styles.AiEditorTools_FullText}>
            <Row>
                <Col span={24} className={styles.AiEditorTools_Tabs}>
                    <Tabs activeKey={currTaps} style={{ flex: '1', }} items={itemss} size='small' centered onChange={onChange} />
                </Col>
            </Row>

            <Row gutter={8} >
                {
                    currTaps === '2' ? (<Col span={24} className={styles.AiEditorTools_footer}>
                        {
                            currSteps >= 1 ? <Button disabled={sendServer.disdisabledLaststep} onClick={handleLast}>上一步</Button> : ''
                        }

                        {

                            currSteps === 3 || currSteps === 1 && isFalg ? <Button disabled={sendServer.disdisabledBut} className={styles.writtenTool_body_next_btn} onClick={handleAgain}><SyncOutlined />换一换</Button> :
                                <Button type="primary" disabled={sendServer.disdisabledBut} className={styles.writtenTool_body_next_btn} onClick={handleNext} >下一步</Button>

                        }

                        {
                            sendServer.optionsValue === '法定公文' && isFalg && currSteps === 1 ? <Button disabled={sendServer.disabledLayoutBut} type="primary" onClick={handleLayout}><FontColorsOutlined />排版</Button> : ''
                        }

                    </Col>)
                        :
                        (<Col span={24} className={styles.AiEditorTools_footer}>
                            {
                                currSteps >= 1 ? <Button disabled={sendServer.disdisabledLaststep} onClick={handleLast}>上一步</Button> : ''
                            }

                            {
                                // onClick={handleInsertion}
                                currSteps === 3 || currSteps === 1 && isFalg ? <Button disabled={sendServer.disdisabledBut} type="primary" className={styles.writtenTool_body_next_btn} >插入编辑器</Button> :
                                    <Button type="primary" disabled={sendServer.disdisabledBut} className={styles.writtenTool_body_next_btn} onClick={handleNext} >下一步</Button>

                            }

                            {
                                currSteps === 3 || currSteps === 1 && isFalg ? <Button className={styles.writtenTool_body_anew_btn} disabled={sendServer.disdisabledBut} type="primary" onClick={handleAgain}>重新生成</Button> : ''
                            }

                        </Col>)
                }


            </Row>
        </div>
    )
}

export default FullText
