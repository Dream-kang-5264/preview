// 'use client'
// import React, { useEffect, useState } from 'react'
// import styles from './index.less'


// import chatAI from '../../../../public/2.svg'
// function Index(props: any) {
//   let { AItext } = props

//   let [contentHtml, setContentHtml] = useState('')

//   let [contentText, setContentText] = useState('')
//   let [falg, setFalg] = useState(false)
//   // console.log(AItext)
//   function decodeUnicode(text: string): string {
//     return text
//       .replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
//         // 解码 Unicode
//         return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
//       })
//       .replace(/\\n/g, '\n'); // 将 \n 转换为换行符D
//   }
//   useEffect(() => {
//     // console.log(AItext.content);
//     if (AItext.content) {
//       if (AItext.content.includes('<H1>') || AItext.content.includes('<P>')) {
//         setContentHtml(AItext.content)
//         setFalg(true)
//       }
//       else {
//         const decodedContent = decodeUnicode(AItext.content);
//         console.log(decodedContent);
//         setContentText(decodedContent)
//         setFalg(false)

//       }

//     }
//   }, [AItext])


//   return (
//     <div className={styles.outline_div}>
//       <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
//       <div className={styles.outline_title}>

//         <div style={{ width: '100%', lineHeight: '1.7rem', fontSize: '2vh' }} className={styles.outline_content}>
//           {
//             falg ? <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div> : (
//               <div dangerouslySetInnerHTML={{ __html: contentText }}></div> // 渲染 contentText
//             )
//           }

//         </div>

//       </div>
//     </div>
//   )
// }

// export default Index
'use client';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

import chatAI from '../../../../public/2.svg';
import ReactMarkdown from 'react-markdown';
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import SVGBtn from '@/components/AiEditor/AiEditorTools/ConversationPage/SVGBtn';
import CopyBtn from '@/components/AiEditor/AiEditorTools/ConversationPage/CopyBtn';
import Flowchart from '@/components/AiEditor/AiEditorTools/ConversationPage/Flowchart';
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useAppSelector } from '@/redux/storeIndex';
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
function Index(props: any) {
  let { AItext } = props;
  let { Longtitle, } = useAppSelector(state => state.longReducer)
  let [contentHtml, setContentHtml] = useState('');
  let [contentText, setContentText] = useState('');
  let [flag, setFlag] = useState(false);
  // console.log(AItext,'AItext');



  useEffect(() => {

    if (AItext) {
      if (Longtitle === 3) {
        setContentHtml(AItext);
        setFlag(true);
        return
      } else {

        setContentText(AItext);
        setFlag(false);
      }
    }
  }, [AItext]);
  const [isSVG, setIsSVG] = useState(false)
  const getCorrectCapitalizationLanguageName = (language: string) => {
    if (!language)
      return 'Plain'

    if (language in capitalizationLanguageNameMap)
      return capitalizationLanguageNameMap[language]

    return language.charAt(0).toUpperCase() + language.substring(1)
  }
  return (
    <div className={styles.outline_div}>
      <img
        width={53}
        height={10}
        src={chatAI}
        alt=""
        style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }}
      />
      <div className={styles.outline_title}>
        <div style={{ width: '100%', }} className={styles.outline_content}>

          {flag ? (
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} className={styles.contentHtml}></div>
          ) : (
            // <div style={{ whiteSpace: 'pre-wrap' }}>{contentText}</div>
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

                            // borderColor: 'rgba(0, 0, 0, 0.5) !important',
                            backgroundColor: 'rgb(228 231 235)',
                            borderRadius: '10px',
                            marginBottom:'5px'
                            // background:'#F7F8FA'
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
                        {(language === 'mermaid')
                          ? (<Flowchart PrimitiveCode={String(children).replace(/\n$/, '')} />)
                          // ? (<>22</>)
                          : (<SyntaxHighlighter
                            {...props}
                            style={atelierHeathLight}
                            customStyle={{
                              paddingLeft: 12,
                              backgroundColor: '#fff',
                              borderRadius: '5px'
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
                p: (paragraph: any) => {
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
              {contentText}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default Index;
