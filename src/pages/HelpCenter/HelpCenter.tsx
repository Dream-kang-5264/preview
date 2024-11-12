import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { PageContainer } from '@ant-design/pro-components';
import ReactMarkdown from 'react-markdown';
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SVGBtn from '@/components/AiEditor/AiEditorTools/ConversationPage/SVGBtn';
import CopyBtn from '@/components/AiEditor/AiEditorTools/ConversationPage/CopyBtn';
import Flowchart from '@/components/AiEditor/AiEditorTools/ConversationPage/Flowchart';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import styles from './index.less'
import {describeData} from './describe'
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
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
const HelpCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['全部', '基础功能', 'AI助手', '模板使用', '账户设置', '写作技巧',];



  const filteredFaqs = describeData.filter(faq =>
    (selectedCategory === '全部' || faq.category === selectedCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  const [isSVG, setIsSVG] = useState(false)
  const getCorrectCapitalizationLanguageName = (language: string) => {
    if (!language)
      return 'Plain'

    if (language in capitalizationLanguageNameMap)
      return capitalizationLanguageNameMap[language]

    return language.charAt(0).toUpperCase() + language.substring(1)
  }
  return (
    <PageContainer
      header={{ title: '' }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <HelpCircle className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold">帮助中心</h1>
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-md mb-4">
            <input
              type="text"
              placeholder="搜索帮助..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full cursor-pointer ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden ">
              <div
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              >
                <span className="font-semibold text-left">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
              {expandedFaq === faq.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200" >
                  {/* <p className="text-gray-700 whitespace-pre-line" style={{ lineHeight: '20px' }}>{faq.answer}</p> */}
                  <div className={styles.markdown}>
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
                      {faq.answer}
                    </ReactMarkdown>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default HelpCenter;