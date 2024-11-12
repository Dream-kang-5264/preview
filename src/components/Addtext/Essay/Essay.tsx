import React, { useState } from 'react'
import chatAI from '../../../../public/2.svg'
import styles from './index.less'
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
function Essay({ item }: any) {
  const [isSVG, setIsSVG] = useState(false)
  // console.log(item.content,'222')
  const getCorrectCapitalizationLanguageName = (language: string) => {
    if (!language)
      return 'Plain'

    if (language in capitalizationLanguageNameMap)
      return capitalizationLanguageNameMap[language]

    return language.charAt(0).toUpperCase() + language.substring(1)
  }
  return (
    <div className={styles.essay}>
      <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
      {/* <div className={styles.essay_content} dangerouslySetInnerHTML={{ __html: item.content }} /> */}
      <div className={styles.content}>
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
                        marginBottom: '5px'
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
          {item.content}
        </ReactMarkdown>
      </div>

    </div>
  )
}

export default Essay
