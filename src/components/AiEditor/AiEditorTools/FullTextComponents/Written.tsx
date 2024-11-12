import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'
import { getFormatType, getWrittenContext, userStepLongtext } from '@/api/written'
import { Result, Spin, message } from 'antd'
import { fetchEventSource } from '@microsoft/fetch-event-source';
// import ReactMarkdown from 'react-markdown';
import { SmileOutlined } from '@ant-design/icons';
import { RefreshCw } from 'lucide-react';
// import { data } from 'autoprefixer';
import { baseUrl } from '@/utils/process'
function Written({ onInsertion, sendServer, setSendServer, isFalg, onIsMarkdown, setAiEditorData }: any) {
    let [writtenContext, setWrittenContext] = useState<any>()
    // let [Writtenloading, setLoadingShow] = useState(true)
    let [srcString, setSrcString] = useState(``)
    const scrollRef = useRef<HTMLDivElement>(null);
    let [markdownText, setMarkdownText] = useState('\n')

    let fullText = ''
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [srcString]);
    useEffect(() => {
        if (!sendServer.last) {
            if (!isFalg) {
                getWrittenContext(sendServer).then((res) => {
                    if (res.data.status.code === 200) {
                        setWrittenContext(res.data.content)
                        // 传递数据插入文章
                        setSendServer((prve: any) => ({
                            ...prve,
                            writtenContext: res.data.content,
                            article: res.data.article,
                            disdisabledBut: false,
                            Writtenloading: false,
                        }))
                        onInsertion(res.data.article)
                    }
                }).catch((error) => {
                    console.log(error);

                })
            } else {
                EventStream()
            }
        }
        else {

            setSendServer((prve: any) => ({
                ...prve,
                Writtenloading: false,
            }))
            setWrittenContext(sendServer.writtenContext)
        }


        return () => {
        }
    }, [])

    let handleLayout = (data) => {
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
        console.log(data);

        const processText = (text) => {
            // 使用正则表达式匹配所有换行符
            // 使用正则表达式匹配所有换行符
            return text
                .split('\n')
                .map((line) => line.trim() ? `<p>${line}</p>` : '')
                .join(''); // 将所有字符串连接成一个单一字符串
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(processText(data), 'text/html');

        // 提取所有 <p> 标签内容，保留标签
        const paragraphs = Array.from(doc.querySelectorAll('p')).map((p, index) => ({
            content: p.outerHTML, // 使用 outerHTML 保留 <p> 标签
            lineNumber: index + 1 // 行号从 1 开始
        }));
        // console.log(processText(originalText));
        console.log(paragraphs, '带标签的数组');
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
    // 流式输出的方法
    let EventStream = async () => {
        const ctrl = new AbortController(); //用于中断请求
        let buffer = ''
        await fetchEventSource(`${baseUrl}/api/v1/garden/area/ai_written_single_step`, {
            method: 'POST',
            openWhenHidden: true, //页面退至后台保持连接
            headers: {
                "Content-Type": 'text/event-stream',
                "token": localStorage.getItem('token') || '',
            },
            body: JSON.stringify({
                ...sendServer
            }),
            signal: ctrl.signal,
            onmessage(msg) {
                if (msg.data) {
                    try {
                        // const result = JSON.parse(`"${msg.data}"`);

                        buffer += JSON.parse(`"${msg.data}"`)
                        // console.log(buffer);
                        // if (sendServer.optionsValue === '法定公文') {
                        //     // console.log('法定公文');
                        //     setLoadingShow(false)
                        //     buffer += msg.data; // 累积接收到的数据
                        //     // 使用正则表达式匹配完整的 <p>...</p> 标签对
                        //     const pTagRegex = /<p[\s\S]*?<\/p>/gi;
                        //     let match;

                        //     while ((match = pTagRegex.exec(buffer)) !== null) {

                        //         let completeP = match[0];
                        //         const cleanedText = completeP
                        //             .replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16))) // Unicode 转码
                        //             .replace(/\\(["'])/g, '$1')
                        //             .replace(/\\"/g, '"')  // 将转义的引号转换为正常引号
                        //             .replace(/\s{2,}/g, '')  // 去除多余的空格
                        //             .replace(/\\n/g, '')  // 去除换行符
                        //         function replaceBackslashes(inputString) {
                        //             // 使用 String.prototype.replace() 方法替换反斜杠
                        //             return inputString.replace(/\\/g, '"');
                        //         }
                        //         fullText += replaceBackslashes(cleanedText);
                        //         // console.log(replaceBackslashes(cleanedText), 'completeP');
                        //         setSrcString(fullText); // 更新组件中的文本
                        //         buffer = buffer.replace(match[0], ''); // 将已处理的部分从缓冲区移除

                        //     }
                        //     return
                        // }
                        // setSrcString((prev: any) => {
                        //     return prev + msg.data + '\n'
                        // })
                        if (sendServer.optionsValue !== '法定公文') {

                            return setMarkdownText((prev: any) => {
                                return prev + msg.data + '\n'
                            })
                        }
                        // console.log(JSON.parse(`"${msg.data}"`));
                        setSendServer((prve: any) => ({
                            ...prve,
                            Writtenloading: false,
                        }))
                        setSrcString((prev: any) => {
                            return prev + JSON.parse(`"${msg.data}"`)
                        })

                    } catch (err) {
                        console.log(err);
                    }
                }
            },
            onclose() {//正常结束的回调
                //在这里写一些GPT回答结束后的一些操作
                console.log('请求结束',);
                handleLayout(buffer)

                // setStreamLoading(false)
                setSendServer((prve: any) => ({
                    ...prve,
                    disdisabledBut: false,
                    disabledLayoutBut: false
                }))
                // handleLayout()
            },
            onerror(err) {//连接出现异常回调
                // 取消请求
                message.error('请求内容错误，请重新尝试')
                console.log(err);

                throw err
            },
        })
    }
    useEffect(() => {
        onInsertion(srcString)
        // onIsMarkdown(markdownText)
    }, [srcString,]);

    useEffect(() => {

        onIsMarkdown(markdownText)
    }, [markdownText]);
    return (
        <div className={styles.written_body} ref={scrollRef}>
            <div className={styles.written_title}>生成正文：</div>
            {
                sendServer.Writtenloading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>  <Spin size="large" /></div> : <>
                    {

                        <Result
                            icon={sendServer.disdisabledBut ? <RefreshCw className="h-200 w-200 text-blue-600 animate-spin" style={{ width: '100%', textAlign: 'center' }} /> : <SmileOutlined />}
                            // status="success"
                            title={sendServer.disdisabledBut ? '正在生成中' : "已生成完成"}
                            subTitle={sendServer.disdisabledBut ? '正在输出到编辑器，请稍等！' : ''}
                        // extra={<Button type="primary">Next</Button>}
                        />
                    }
                </>
            }
        </div>
    )
}

export default Written

