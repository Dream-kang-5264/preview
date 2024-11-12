
import React, { ReactElement, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css"
import styles from './AiEditor.less'
import { useParams } from 'umi';
import { baseUrl } from '@/utils/process'
import { getAnnexDetails } from '@/api/outline';
import { useAppDispatch, useAppSelector } from '@/redux/storeIndex'
import { setSelectDatas } from "@/redux/module/firstDraftStore";
import { getFormatType } from '@/api/written';
import { Result, Spin } from 'antd';
import { RefreshCw } from 'lucide-react';
let App = forwardRef((props: any, ref: any) => {
    let { sendAiEditor, AiEditorData, setAiEditorData } = props
    // function App({ AiEditorValue, toolShow }: any) {
    const { id } = useParams<{ id: string }>();
    // console.log(AiEditorValue);
    //定义 ref
    let dispatch = useAppDispatch()
    const divRef = useRef<HTMLDivElement>(null);
    const aiEditorRef = useRef<AiEditor | null>(null);
    let [AiEditorValue, setAiEditorValue] = useState<any>('')
    let [aiHtml, setAiHtml] = useState('')
    let [changeShow, setChangeShow] = useState(false)
    let [aiText, setAitext] = useState('')
    let [aiJson, setAiJson] = useState('')
    // let [loadingShow, setLoadingShow] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('templetsEdit') && localStorage.getItem('tool') === '1') {
            let arr = JSON.parse(localStorage.getItem('templetsEdit') || '')
            setAiEditorValue(arr.content_html)
        }
        else {
            getAnnexDetails({ attachment_id: id }).then((res) => {
                if (res.data.status.code === 200) {
                    // deliveryValue(res.data.data[0].content);
                    setAiEditorValue(res.data.data[0].content);
                }
            }).catch(err => {
                console.error("Failed to fetch data:", err);
                // 这里可以设置默认值或者处理错误情况
                setAiEditorValue("");
            });
        }

    }, [])

    //初始化 AiEditor
    useEffect(() => {

        if (divRef.current) {
            const aiEditor = new AiEditor({
                element: divRef.current,
                placeholder: "点击输入内容...",
                content: AiEditorValue,
                toolbarKeys: ["undo", "redo", "brush", "eraser",
                    "|", "heading", "font-family", "font-size",
                    "|", "bold", "italic", "underline", "strike", "link", "code", "subscript", "superscript", "hr", "todo", "emoji",
                    "|", "highlight", "font-color",
                    "|", "align", "line-height",
                    "|", "bullet-list", "ordered-list", "indent-decrease", "indent-increase", "break",
                    "|", "image", "video", "attachment", "quote", "code-block", "table",
                    "|", "source-code", "printer", "fullscreen",
                    {
                        icon: `<svg t="1730347286558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5402" width="200" height="200"><path d="M689.846524 385.375068l134.785799-134.787846-49.223075-49.223075L640.623449 336.149946 689.846524 385.375068zM896.490931 229.835595c0 8.280594-2.759857 15.180747-8.27957 20.700461l-638.800941 635.473149c-5.520737 5.520737-12.420891 8.280594-20.700461 8.280594-8.280594 0-15.180747-2.759857-20.701484-8.280594l-70.618361-71.51273c-5.520737-5.520737-8.280594-12.420891-8.280594-20.700461 0-8.280594 2.759857-15.180747 8.280594-20.701484l638.800941-635.472126c5.520737-5.520737 12.420891-8.280594 20.700461-8.280594 8.27957 0 15.180747 2.759857 20.700461 8.280594l70.620407 71.51273C893.731074 214.654848 896.490931 221.555002 896.490931 229.835595L896.490931 229.835595zM262.581394 174.423565l45.081755 13.801331-45.081755 13.801331-13.801331 45.081755-13.801331-45.081755-45.082778-13.801331 45.082778-13.801331 13.801331-45.081755L262.581394 174.423565 262.581394 174.423565zM423.587368 248.945839l90.164532 27.601638-90.164532 27.601638L395.986753 394.313647l-27.601638-90.164532-90.164532-27.601638 90.164532-27.601638 27.601638-90.164532L423.587368 248.945839 423.587368 248.945839zM851.408153 498.199693l45.081755 13.800307-45.081755 13.801331-13.801331 45.081755-13.802354-45.081755-45.081755-13.801331 45.081755-13.801331 13.802354-45.081755L851.408153 498.199693 851.408153 498.199693zM556.995797 174.423565l45.081755 13.801331-45.081755 13.801331-13.801331 45.081755-13.801331-45.081755-45.081755-13.801331 45.081755-13.801331 13.801331-45.081755L556.995797 174.423565 556.995797 174.423565z" fill="#272536" p-id="5403"></path></svg>`,
                        html: `<div><svg t="1730347286558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5402" width="200" height="200"> <path d="M689.846524 385.375068l134.785799-134.787846-49.223075-49.223075L640.623449 336.149946 689.846524 385.375068zM896.490931 229.835595c0 8.280594-2.759857 15.180747-8.27957 20.700461l-638.800941 635.473149c-5.520737 5.520737-12.420891 8.280594-20.700461 8.280594-8.280594 0-15.180747-2.759857-20.701484-8.280594l-70.618361-71.51273c-5.520737-5.520737-8.280594-12.420891-8.280594-20.700461 0-8.280594 2.759857-15.180747 8.280594-20.701484l638.800941-635.472126c5.520737-5.520737 12.420891-8.280594 20.700461-8.280594 8.27957 0 15.180747 2.759857 20.700461 8.280594l70.620407 71.51273C893.731074 214.654848 896.490931 221.555002 896.490931 229.835595L896.490931 229.835595zM262.581394 174.423565l45.081755 13.801331-45.081755 13.801331-13.801331 45.081755-13.801331-45.081755-45.082778-13.801331 45.082778-13.801331 13.801331-45.081755L262.581394 174.423565 262.581394 174.423565zM423.587368 248.945839l90.164532 27.601638-90.164532 27.601638L395.986753 394.313647l-27.601638-90.164532-90.164532-27.601638 90.164532-27.601638 27.601638-90.164532L423.587368 248.945839 423.587368 248.945839zM851.408153 498.199693l45.081755 13.800307-45.081755 13.801331-13.801331 45.081755-13.802354-45.081755-45.081755-13.801331 45.081755-13.801331 13.802354-45.081755L851.408153 498.199693 851.408153 498.199693zM556.995797 174.423565l45.081755 13.801331-45.081755 13.801331-13.801331 45.081755-13.801331-45.081755-45.081755-13.801331 45.081755-13.801331 13.801331-45.081755L556.995797 174.423565 556.995797 174.423565z" fill="#272536" p-id="5403"></path> </svg>排版</div>`,
                        onClick: (event, editor) => {
                            //Click Event
                            console.log(event, editor);
                            handleClick()
                        },
                        tip: "排版",
                    },
                ],
                onChange: (editor) => {
                    sendAiEditor(editor)
                    // setAiEditorValue(editor.getHtml())
                    setAiHtml(editor.getHtml())
                    setAiJson(editor.getJson())
                    setAitext(editor.getText())


                    setChangeShow(true)
                },
                onFocus: (editor) => {
                    sendAiEditor(editor)

                },
                onCreated: (editor) => {
                    setAiJson(editor.getJson())
                    setAitext(editor.getText())
                    sendAiEditor(editor)
                    // editor.focusStart()
                    const editorArea: any = document.querySelector('.aie-container');
                    editorArea.style.background = '#fff'
                    const secondElement: any = editorArea?.children[1];
                    secondElement.style.display = 'flex'
                    secondElement.style.background = '#fff'
                    // secondElement.style.overflow = 'hidden'

                    // 创建左侧
                    const newElement = document.createElement('div');
                    newElement.innerHTML = `<div></div>`;
                    newElement.style.width = '10%';

                    newElement.style.background = '#fff'
                    newElement.style.overflow = 'hidden'
                    // newElement.style.paddingLeft = '10%'

                    newElement.classList.add('leftOutlie');
                    newElement.classList.add(styles.leftOutlie);
                    let conrentDiv: any = document.querySelector('.ProseMirror')
                    conrentDiv.style.flex = '1'
                    // conrentDiv.style.width = "100%"
                    conrentDiv.style.paddingLeft = "10%"
                    secondElement.style.overflow = 'hidden'
                    secondElement?.insertBefore(newElement, conrentDiv);

                    //     // 创建右侧区域
                    // const prependElement = document.createElement('div');
                    // prependElement.classList.add(styles.rightMenu);
                    // prependElement.style.width = '0'
                    // prependElement.style.background = '#fff'
                    // prependElement.classList.add('right');
                    // secondElement.appendChild(prependElement);

                    let contextDiv: any = document.querySelector('.ProseMirror')
                    contextDiv.style.flex = '1'
                    contextDiv.style.paddingRight = '5%'
                    // contextDiv.style.paddingLeft = '5%'
                    // contextDiv.style.height = '98%'

                    let footer: any = document.querySelector('aie-footer')
                    footer.style.display = 'none';


                },
                // textSelectionBubbleMenu: {
                //     enable: true,
                //     items: ["ai", "Bold", "Italic", {
                //         id: "visit",
                //         title: "visit-link",
                //         icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z\"></path></svg>",
                //         onClick: (editor) => {
                //             console.log(editor);

                //             // window.open("https://aieditor.dev", "_blank")
                //         }
                //     }],
                // },
                ai: {
                    models: {
                        custom: {
                            url: `${baseUrl}/api/v1/garden/area/triple/writing`,
                            headers: () => {
                                return {
                                    "token": localStorage.getItem('token'),
                                    "Content-Type": 'text/event-stream'
                                }
                            },
                            //    请求体
                            wrapPayload: (message: string) => {
                                let grtLastNember = (text: string) => {
                                    const reg = text.match(/\d+/g)
                                    if (reg && reg.length > 0) {
                                        return parseInt(reg[reg.length - 1], 10)
                                    }
                                    return null
                                }

                                let number = grtLastNember(message)
                                return JSON.stringify({ text: aiEditor.getSelectedText(), type: number })
                            },
                            parseMessage: (message: string) => {
                                // console.log(message);


                                return {
                                    role: "assistant",
                                    content: message,
                                    // index: number,
                                    // //0 代表首个文本结果；1 代表中间文本结果；2 代表最后一个文本结果。
                                    status: 0 | 1 | 2,
                                }
                            },
                            // protocol: "sse" | "websocket"
                        },

                    },
                    // 泡泡菜单
                    bubblePanelMenus: [
                        {
                            prompt: `1`,
                            icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_3751_100715)">
                                <path d="M3.5 5.5L16.5 5.5" stroke="#333333" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.5 16L12 16" stroke="#333333" stroke-width="1.4" stroke-linecap="round"/>
                                <path d="M3.5 12.5L16.5 12.5" stroke="#333333" stroke-width="1.4" stroke-linecap="round"/>
                                <path d="M3.5 9L16.5 9" stroke="#333333" stroke-width="1.4" stroke-linecap="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_3751_100715">
                                <rect width="20" height="20" fill="white"/>
                                </clipPath>
                                </defs>
                                </svg>`,
                            title: '扩写',

                        },
                        {
                            prompt: `2`,
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 18.9997H20V13.9997H22V19.9997C22 20.552 21.5523 20.9997 21 20.9997H3C2.44772 20.9997 2 20.552 2 19.9997V13.9997H4V18.9997ZM16.1716 6.9997L12.2218 3.04996L13.636 1.63574L20 7.9997L13.636 14.3637L12.2218 12.9495L16.1716 8.9997H5V6.9997H16.1716Z"></path></svg>`,
                            title: '续写',

                        },
                        {
                            prompt: `3`,
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15 5.25C16.7949 5.25 18.25 3.79493 18.25 2H19.75C19.75 3.79493 21.2051 5.25 23 5.25V6.75C21.2051 6.75 19.75 8.20507 19.75 10H18.25C18.25 8.20507 16.7949 6.75 15 6.75V5.25ZM4 7C4 5.89543 4.89543 5 6 5H13V3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V12H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z"></path></svg>`,
                            title: '润色',
                        },
                        // {
                        //     prompt: `4`,
                        //     icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //         <g clip-path="url(#clip0_3751_100715)">
                        //         <path d="M3.5 5.5L16.5 5.5" stroke="#333333" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                        //         <path d="M3.5 16L12 16" stroke="#333333" stroke-width="1.4" stroke-linecap="round"/>
                        //         <path d="M3.5 12.5L16.5 12.5" stroke="#333333" stroke-width="1.4" stroke-linecap="round"/>
                        //         <path d="M3.5 9L16.5 9" stroke="#333333" stroke-width="1.4" stroke-linecap="round"/>
                        //         </g>
                        //         <defs>
                        //         <clipPath id="clip0_3751_100715">
                        //         <rect width="20" height="20" fill="white"/>
                        //         </clipPath>
                        //         </defs>
                        //         </svg>`,
                        //     title: '缩写',
                        // },
                    ],

                    // AI工具
                    // menus: [
                    //     {
                    //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 18.9997H20V13.9997H22V19.9997C22 20.552 21.5523 20.9997 21 20.9997H3C2.44772 20.9997 2 20.552 2 19.9997V13.9997H4V18.9997ZM16.1716 6.9997L12.2218 3.04996L13.636 1.63574L20 7.9997L13.636 14.3637L12.2218 12.9495L16.1716 8.9997H5V6.9997H16.1716Z"></path></svg>`,
                    //         name: `<div>续写</div>`,
                    //         prompt: "请帮我继续扩展一些这段话的内容",
                    //         text: "focusBefore",
                    //         model: "auto",
                    //     },
                    //     {
                    //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15 5.25C16.7949 5.25 18.25 3.79493 18.25 2H19.75C19.75 3.79493 21.2051 5.25 23 5.25V6.75C21.2051 6.75 19.75 8.20507 19.75 10H18.25C18.25 8.20507 16.7949 6.75 15 6.75V5.25ZM4 7C4 5.89543 4.89543 5 6 5H13V3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V12H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z"></path></svg>`,
                    //         name: "AI 优化",
                    //         prompt: "请帮我优化一下这段文字的内容，并返回结果",
                    //         text: "selected",
                    //         model: "auto",
                    //     },
                    // ]

                },
            })

            sendAiEditor(aiEditor)
            aiEditorRef.current = aiEditor;

            const handleSelectionChange = () => {
                const selection: any = window.getSelection();
                if (selection.toString()) {
                    // let arr = selection.toString()
                    setTimeout(() => {
                        dispatch(setSelectDatas(selection.toString()))
                    }, 1000)

                }
            };
            // 添加监听器
            document.addEventListener('selectionchange', handleSelectionChange);
            return () => {
                aiEditor.destroy();
            }


        }



    }, [AiEditorValue])
    useEffect(() => {

        if (AiEditorData.toolShow) {
            let contextDiv: any = document.querySelector('.ProseMirror')

            if (contextDiv) {
                contextDiv.style.paddingLeft = '15%'
            }
        }
        else {
            let contextDiv: any = document.querySelector('.ProseMirror')
            if (contextDiv) {
                contextDiv.style.paddingLeft = '10%'
            }

        }
    }, [AiEditorData.toolShow])
    let handleClick = () => {
        // console.log(aiEditorRef.current?.getText());
        setAiEditorData((prve: any) => ({
            ...prve,
            editorLoadingShow: true
        }))
        let originalText = aiEditorRef.current?.getText();
        // console.log(AiEditorJson.content[0].content[0].text, '发给后端的数据');

        const processText = (text) => {
            // 使用正则表达式匹配所有换行符
            // 使用正则表达式匹配所有换行符
            return text
                .split('\n')
                .map((line) => line.trim() ? `<p>${line}</p>` : '')
                .join(''); // 将所有字符串连接成一个单一字符串
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(processText(originalText), 'text/html');


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
                aiEditorRef.current?.clear()
                aiEditorRef.current?.focus().insert(fullContent.replace(/\n/g, '').replace(/>\s+</g, '><'))
                setAiEditorData((prve: any) => ({
                    ...prve,
                    editorLoadingShow: false
                }))
                // 输出拼接后的字符串
                // console.log(fullContent.replace(/\n/g, '').replace(/>\s+</g, '><'));
                // console.log(dataArray(result));
                // setSendServer((prev: any) => ({
                //     ...prev,
                //     disdisabledBut: false,
                // }));
            }

        }).catch((err) => {
            console.log(err);
        })
    }

    useImperativeHandle(ref, () => ({
        // 插入内容
        insertContent: (text: string) => {
            aiEditorRef.current?.insertMarkdown(text)
            aiEditorRef.current?.focus()
        },
        // 替换内容
        replaceContent: (text: string) => {
            aiEditorRef.current?.clear()
            aiEditorRef.current?.focus().insertMarkdown(text)
            aiEditorRef.current?.focus()
        },
        handleInsertion: (text: string) => {

            aiEditorRef.current?.focus().insertMarkdown(text)
            aiEditorRef.current?.focus()
        },
        handleMessageInsertion: (text: string) => {
            // console.log(text,'handleMessageInsertion');

            aiEditorRef.current?.focus().insertMarkdown(text)
            aiEditorRef.current?.focus()
        },
        handleClear: () => {
            aiEditorRef.current?.clear()
        },
        handleisEventStream: (text: string) => {

            aiEditorRef.current?.focus().insertMarkdown(text)
            aiEditorRef.current?.focusEnd()
            // aiEditorRef.current?.scrollTop = aiEditorRef.current?.scrollHeight;
        },
        // 普通成文的Markdown格式
        handleisMarkdown: (text: string) => {
            aiEditorRef.current?.clear()
            aiEditorRef.current?.focus().insertMarkdown(text)
            aiEditorRef.current?.focusEnd()
        },
        // 成文插入编辑器
        handleWrittenInsertion: (text: string) => {
            aiEditorRef.current?.clear()
            aiEditorRef.current?.focus().insert(text)
            aiEditorRef.current?.focusEnd()
        },
        // 传递数据
        sendData() {
            if (changeShow) {
                return aiHtml
            }
            else {
                return AiEditorValue
            }
        },
        senJsondData() {
            return aiJson
            if (changeShow) {

            }
            else {
                return AiEditorValue
            }
        },
        sendText() {
            return aiText
        }


    }));

    return (
        <div style={{ position: 'relative' }}>
            <div ref={divRef} style={{ height: "calc(100vh - 12vh)" }} />

            {
                AiEditorData.editorLoadingShow ?

                    <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', zIndex: '222', top: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>


                        <Result
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', justifyContent: 'center', flexDirection: 'column' }}
                            icon={<RefreshCw className="text-blue-800 animate-spin" style={{ width: '50px', height: '50px', textAlign: 'center' }} />}
                            // status="success"
                            title={<div style={{ fontSize: '30px', color: '#000' }}>正在生成中...</div>}
                            subTitle={<div style={{ fontSize: '30px', color: '#000' }}>正在修改格式，请稍等！</div>}

                        />
                    </div> : ''
            }

        </div>
    )
})
export default App



