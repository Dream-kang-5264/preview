import { Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Button, message, Row, Spin } from 'antd';
import ReactMarkdown from 'react-markdown'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { StopOutlined, UploadOutlined } from '@ant-design/icons';
import { baseUrl } from '@/utils/process'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Flowchart from './ConversationPage/Flowchart';
import SVGBtn from './ConversationPage/SVGBtn';
import CopyBtn from './ConversationPage/CopyBtn';
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
const capitalizationLanguageNameMap: Record<string, string> = {
    sql: 'SQL',
    javascript: 'JavaScript',
    java: 'Java',
    typescript: 'TypeScript',
    vbscript: 'VBScript',
    css: 'CSS',
    html: 'HTML',
    xml: 'XML',
    php: 'PHP',
    python: 'Python',
    yaml: 'Yaml',
    mermaid: 'Mermaid',
    markdown: 'MarkDown',
    makefile: 'MakeFile',
  }
const AiMessage = ({ messageInsertEditor }: any) => {
    const [messageData, setMessageData] = useState({ input: '', isLoading: false, currFileId: '', conversation_id: '', });
    const [contentText, setContentTexts] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    let fileInputRef = useRef<HTMLInputElement>(null);
    const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([
        "如何进行文章结构优化？",
        "如何提高写作能力的效率？",
        "如何构建一个引人入胜的开头？",

        // "有哪些常见的写作错误？",

    ]);
    const CircleStop: React.FC<{ size: number }> = ({ size }) => {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    };
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [contentText, messageData.isLoading]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        const ctrl = new AbortController();
        setAbortController(ctrl); // 设置 AbortController
        if (messageData.input.trim() === '') return;

        setMessageData((prev) => ({
            ...prev,
            isLoading: true,
            input: '',
        }));

        const assistantId = Date.now().toString(); // 生成唯一标识符

        setContentTexts((prevContent) => [
            ...prevContent,
            { role: 'user', message: messageData.input, type: 'txt' },
            { role: 'assistant', message: '', id: assistantId } // 添加唯一标识符
        ]);
        let recommend_msg: string[] = []
        let src = '';
        let str = ''
        await fetchEventSource(`${baseUrl}/api/v1/admin/user/answers/editor`, {
            method: 'POST',
            openWhenHidden: true,
            headers: { "Content-Type": 'text/event-stream', "token": localStorage.getItem('token') || '' },
            body: JSON.stringify({
                text: messageData.input,
                conversation_id: messageData.conversation_id
            }),
            signal: ctrl.signal,
            onmessage(msg) {
                if (msg.data) {
                    console.log(msg.data,);
                  
                    try {

                        function removeConversationId(str) {
                            const prefix = 'conversation_id';
                            const suffix = 'conversation_id';

                            // 查找 prefix 和 suffix 的位置
                            const prefixIndex = str.indexOf(prefix);
                            const suffixIndex = str.lastIndexOf(suffix);

                            // 判断是否存在
                            if (prefixIndex !== -1 && suffixIndex !== -1 && suffixIndex > prefixIndex) {
                                // 提取去掉前后的部分
                                return str.slice(prefixIndex + prefix.length, suffixIndex);
                            }

                            // 如果没有找到，返回原始字符串
                            return str;
                        }
                        function removeRecommendmsg(str) {
                            const prefix = 'recommend_msg';
                            const suffix = 'recommend_msg';

                            // 查找 prefix 和 suffix 的位置
                            const prefixIndex = str.indexOf(prefix);
                            const suffixIndex = str.lastIndexOf(suffix);

                            // 判断是否存在
                            if (prefixIndex !== -1 && suffixIndex !== -1 && suffixIndex > prefixIndex) {
                                // 提取去掉前后的部分
                                return str.slice(prefixIndex + prefix.length, suffixIndex);
                            }

                            // 如果没有找到，返回原始字符串
                            return str;
                        }
                        // 包含@
                        if (msg.data.includes('conversation_id')) {
                            // console.log(removeConversationId(msg.data));
                            setMessageData((prev) => ({
                                ...prev,
                                conversation_id: removeConversationId(msg.data)
                            }));
                        }
                        else if (msg.data.includes('recommend_msg')) {

                            recommend_msg.push(removeRecommendmsg(msg.data))
                            // setMessageData((prevState: any) => ({
                            //     ...prevState,
                            //     recommend_msg: [...prevState.recommend_msg, removeRecommendmsg(msg.data)]
                            // }));
                            setRecommendedQuestions(recommend_msg)
                        }
                        else {
                            const result = JSON.parse(`"${msg.data}"`);
                            src += result;
                        }

                        setContentTexts((prevContent) => {
                            const updatedContent = prevContent.map(item => {
                                if (item.role === 'assistant' && item.id === assistantId) {
                                    return { ...item, message: src };
                                }
                                return item;
                            });
                            return updatedContent;
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
            },
            onclose() {
                console.log('请求结束');
                setMessageData((prev) => ({
                    ...prev,
                    isLoading: false,
                }));
                setAbortController(null); // 请求结束后重置 AbortController
            },
            onerror(err) {
                console.log(err);
                message.error('链接失败，请重试');
                setMessageData((prev) => ({
                    ...prev,
                    isLoading: false,
                }));
                throw err;
            },
        });
    };

    const handleStop = () => {
        if (abortController) {
            abortController.abort(); // 终止请求
            setMessageData((prev) => ({
                ...prev,
                isLoading: false
            }));
        }
    };

    const messageContent = contentText.map((item: any, index: number) => {
        switch (item.role) {
            case 'user':
                return <MyText text={item} key={index} />;
            case 'assistant':
                return <AiText text={item} key={index} messageData={messageData} messageInsertEditor={messageInsertEditor} />;
            default:
                return null;
        }
    });

    return (
        <div className={styles.ai_message_body}>
            <div className={styles.ai_message_content} ref={scrollRef}>
                <div className={styles.ai_message_acquiesce}>
                    <h5 style={{ fontWeight: '600' }}>您好，我是AI写作助理</h5>
                    <div style={{ lineHeight: '25px' }}>很高兴为您服务。写文案、思路拓展、资料整理、知识库查询，我统统在行，快来试一下吧</div>
                </div>
                <div className={styles.ai_message_acquiesce_list}>您可以自由提问或选择插件后进行提问:</div>
                <div className={styles.ai_message_acquiesce_list} style={{ color: '#3E77FA', cursor: 'pointer' }}>我要进行自由提问</div>
                <div className={styles.ai_message_acquiesce_list} style={{ color: '#3E77FA', cursor: 'pointer' }}>点击“选择插件”开始创作</div>
                {messageContent}
                {messageData.isLoading ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}><Spin size="small" /></div> : ''}
                {/* {messageData.isLoading ?   <Button size='small' style={{  top: scrollRef?.current?.scrollHeight ? `${scrollRef.current.scrollHeight - 30 }px` : '0px'}} className={styles.buttonStop}  onClick={handleStop}><StopOutlined />停止生成</Button>: ''} */}

            </div>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(file: any) => {
                setContentTexts((prevContent) => {
                    const updatedContent = prevContent.map(item => {
                        if (item.role === 'user' && item.id === messageData.currFileId) {
                            return { ...item, message: file.target.files[0], type: 'file' };
                        }
                        return item;
                    });
                    return updatedContent;
                });
            }} />
            <div style={{ height: '15vh', overflowY: 'auto' }}>
                <div className={styles.recommend_question}>
                    {recommendedQuestions.map((question: string, index: number) => (

                        <div
                            key={index}
                            onClick={() => {
                                setMessageData((prev) => ({
                                    ...prev,
                                    input: question
                                }));
                                // handleSend()
                            }}


                        >
                            <div className={styles.recommend_question_item}

                            >  {question}</div>

                        </div>
                    ))}

                </div>
            </div >

            <div className={styles.ai_message_button}>
                <Button style={{ background: '#1677FF', marginRight: '10px', color: '#fff' }} onClick={() => {
                    if (fileInputRef) {
                        fileInputRef.current?.click();
                    }
                    const assistantId = Date.now().toString(); // 生成唯一标识符
                    setMessageData((prev) => ({
                        ...prev,
                        currFileId: assistantId
                    }));
                    setContentTexts((prevContent) => [
                        ...prevContent,
                        { role: 'user', id: assistantId },
                    ]);
                }}>已选插件 <UploadOutlined /></Button>
                <Button onClick={() => {
                    setContentTexts([]);
                    setMessageData((prev) => ({
                        ...prev,
                        isLoading: false
                    }));
                    setRecommendedQuestions([
                        "如何进行文章结构优化？",
                        "如何提高写作能力的效率？",
                        "如何构建一个引人入胜的开头？",

                        // "有哪些常见的写作错误？",
                    ])
                }}>清空会话</Button>
            </div>
            <div className="relative">
                <textarea
                    value={messageData.input}
                    onChange={(e) => setMessageData((prev) => ({
                        ...prev,
                        input: e.target.value
                    }))}
                    onKeyPress={handleKeyPress}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入您的问题... (Shift + Enter 换行)"
                    rows={5}
                />

                {
                    messageData.isLoading ?
                        <Button
                            style={{ background: '#E53E3E' }}
                            onClick={handleStop}
                            className="absolute right-2 bottom-2 bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition duration-200 flex items-center justify-center"
                        // disabled={!messageData.isLoading}
                        >
                            <CircleStop size={20} />
                        </Button>
                        : <Button
                            style={{ background: '#1677FF' }}
                            onClick={handleSend}
                            className="absolute right-2 bottom-2 bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                            disabled={messageData.isLoading}
                        >
                            <Send size={20} />
                        </Button>
                }
            </div>
        </div >
    );
};

const MyText = ({ text, isEditing = false }: { text: { message: string, type: string }, isEditing?: boolean }) => {
    if (text.type === 'txt') {
        return (
            <div className={`${styles.user_message_container} ${isEditing ? styles.editing : ''}`}>
                <span className={styles.user_message}>
                    {text.message}
                </span>
            </div>
        );
    } else if (text.type === 'file') {
        return (
            <div className={styles.user_message_container}>
                <div className={styles.user_message_file}>
                    <img src="http://180.76.176.120/static/img/onlineWrite.72803902.png" alt="" style={{ width: '25px' }} />
                    <div>{text.message.name}</div>
                </div>
            </div>
        );
    }
};

const AiText = ({ text, messageData, messageInsertEditor, }: any) => {
    const [isSVG, setIsSVG] = useState(false)
    const getCorrectCapitalizationLanguageName = (language: string) => {
        if (!language)
          return 'Plain'
      
        if (language in capitalizationLanguageNameMap)
          return capitalizationLanguageNameMap[language]
      
        return language.charAt(0).toUpperCase() + language.substring(1)
      }
    return (
        <div className={styles.ai_message} >
            {/* style={{ whiteSpace: 'pre-wrap' }} */}
            <ReactMarkdown
                remarkPlugins={[[RemarkMath, { singleDollarTextMath: false }], RemarkGfm, RemarkBreaks]}
                rehypePlugins={[
                    RehypeKatex,
                ]}
                components={{
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match?.[1]
                        const languageShowName = getCorrectCapitalizationLanguageName(language || '')
                        return (!inline && match)
                            ? (
                                <div>
                                    <div
                                        className='flex justify-between h-8 items-center p-1 pl-3 border-b'
                                        style={{
                                            borderColor: 'rgba(0, 0, 0, 0.5)',
                                        }}
                                    >
                                        <div className='text-[13px] text-gray-500 font-normal'>{languageShowName}</div>
                                        <div style={{ display: 'flex' }}>
                                            {language === 'mermaid'
                                                && <SVGBtn
                                                    isSVG={isSVG}
                                                    setIsSVG={setIsSVG}
                                                />
                                                
                                            }
                                            <CopyBtn
                                                className='mr-1'
                                                value={String(children).replace(/\n$/, '')}
                                                isPlain
                                            />
                                        </div>
                                    </div>
                                    {(language === 'mermaid' )
                                        ? (<Flowchart PrimitiveCode={String(children).replace(/\n$/, '')} />)
                                        // ? (<>22</>)
                                        : (<SyntaxHighlighter
                                            {...props}
                                            style={atelierHeathLight}
                                            customStyle={{
                                                paddingLeft: 12,
                                                backgroundColor: '#fff',
                                            }}
                                            language={match[1]}
                                            showLineNumbers
                                            PreTag="div"
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>)}
                                </div>
                            )
                            : (
                                <code {...props} className={className}>
                                    {children}
                                </code>
                            )
                    },
                    img({ src, alt, ...props }) {
                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={src}
                                alt={alt}
                                width={250}
                                height={250}
                                className="max-w-full h-auto align-middle border-none rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out mt-2 mb-2"
                                {...props}
                            />
                        )
                    },
                    p: (paragraph) => {
                        const { node }: any = paragraph
                        if (node.children[0].tagName === 'img') {
                            const image = node.children[0]

                            return (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image.properties.src}
                                        width={250}
                                        height={250}
                                        className="max-w-full h-auto align-middle border-none rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out mt-2 mb-2"
                                        alt={image.properties.alt}
                                    />
                                    <p>{paragraph.children.slice(1)}</p>
                                </>
                            )
                        }
                        return <p>{paragraph.children}</p>
                    },
                }}
                // linkTarget='_blank'
            >
                {text.message}
            </ReactMarkdown>
            {/* {text.message} */}
            {!messageData.isLoading && (
                <div className={styles.insert_editor} onClick={() => messageInsertEditor(text.message)}>
                    插入编辑器
                </div>
            )}
        </div>
    );
};

export default AiMessage;

