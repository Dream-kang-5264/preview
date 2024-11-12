

import React, { useContext, useEffect, useRef, useState } from 'react';
import LongWriting from '@/components/Addtext/LongWriting/page';
import LongSearch from '@/components/Addtext/LongSearch/page';
// // 引入论文助手的组件
import ThesisAssistant from '@/components/Addtext/ThesisAssistant/page';
// // 引入文章主题的组件
import ThematicReport from '@/components/Addtext/ThematicReport/page';
// 引入长文
import Outline from '@/components/Addtext/Content'
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
// 引入loading组件
import LongLoading from '@/components/Addtext/LongLoading/index';
// import { MyContext } from '@/pages/home';
// 引入大纲文件
import TitleOutline from '@/components/Addtext/TitleOutline/index'
// 引入进度条模块
import LongProgress from '@/components/Addtext/LongProgress'
// 用户输入的文本
import MyText from '@/components/Addtext/MyText/index'
// 引入初稿文档
import DraftDocument from '@/components/Addtext/DraftDocument'
import { setmessageOutlineId } from '@/redux/module/LongStore';
import Essay from './Essay/Essay';
function Page({ setContent, setMenuKey }: any) {
  let dispatch = useAppDispatch()
  // 获取长文组件的数量
  let { ThesisCount, ThematiCount } = useAppSelector(state => state.homeReducer)
  let { outlineLoading, loadingShow, progressShow, titleOutline, componentsType, } = useAppSelector(state => state.longReducer)
  let ContentRef = useRef<HTMLDivElement>(null)
  let { historyType, isAddHistory, longTextLength, historyDecordId }: any = useAppSelector(state => state.longReducer)

  let [MaterialId, setMaterialId] = useState('')
  let [newId, setNewId] = useState({ template_id: '', materials_id: '' })
  let [docxData, setDocxData] = useState({ attachmentId: '', title: '', docxShow: true, materialLoadding: false, materialSize: '', modelEssayLoadding: false, currupload: 1, modelEssaySize: '', modelEssayShow: true, modelEssaytitle: '' })
  let [pageContent, setPageContent] = useState<any>()
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let addRecord = componentsType.map((item: any, index: number) => {

      switch (item.type) {

        case 'myType':
          return <MyText MyText={item.content} key={item.key} />
        case 'thesisType':
          return <ThesisAssistant key={item.key} />
        case 'themeType':
          return <ThematicReport key={item.key} />
        case 'longType':
          // return
          return <Outline AItext={item.content.content} key={index} />
        case 'loadingType':
          // {loadingShow ? <LongLoading /> : ''}
          return <div key={item.key}>{loadingShow ? <LongLoading content={item.content} /> : ''}</div>
        case 'outlineType':
          return <TitleOutline titleOutline={item.content} key={item.key} />
        case 'ProgressType':
          // 进度条的进度没做活
          return <div key={index}>{progressShow ? <LongProgress /> : ''}</div>
        case 'essayType':
          // console.log(item);
          // 进度条的进度没做活
          return <Essay key={item.key} item={item.content} />
        case 'DraftType':
          return <DraftDocument key={item.key} title={item.content.title
          } attachmentId={item.content.attachmentId
          } />
        default:
      }
    })


    // 历史会话的列表
    let historyList = historyType?.map((item: any, index: number) => {
      // console.log(item.content);
      switch (item.type) {
        case 'user':
          return <MyText MyText={item.content} key={index} />
        case 'assistant':

          if (item.content.type === 'outline') {
            dispatch(setmessageOutlineId(item.content.messageId))
            return <TitleOutline titleOutline={item.content} key={index} />
          }
          if (item.content.type === 'compose') {
            return <DraftDocument key={index} title={item.content.content
            } attachmentId={item.content.attachmentId
            } />
          }
          if (item.content.type === 'text') {

            function isEncodedUnicode(str) {
              // 检查字符串是否包含 \u 后跟四个十六进制数字的模式
              const regex = /\\u[0-9a-fA-F]{4}/;
              return regex.test(str);
            }
            if (item.content.content[0] === '<') {
              return <Essay key={item.key} item={item.content} />
            }
            else if (isEncodedUnicode(item.content.content)) {
              function decodeUnicode(str) {
                return str.replace(/\\u([0-9a-fA-F]{4})/g, function (match, group1) {
                  return String.fromCharCode(parseInt(group1, 16));
                });
              }
              // console.log(decodeUnicode(item.content.content).replace(/\\n/g, '\n'));
              return <Outline AItext={decodeUnicode(item.content.content).replace(/\\n/g, '\n').replace(/\\/g, '')} key={index} />
            }
            else {
              return <Outline AItext={item.content.content} key={index} />

            }

          }
          if (item.content.type === 'Unicode') {
            return <Outline AItext={item.content.content} key={index} />
          }
          if (item.content.type === 'html') {
            return <Essay key={item.key} item={item.content} />
          }
          break;
        case 'loadingType':
          return <div key={index} >{loadingShow ? <LongLoading content={item.content} /> : ''}</div>

        case 'DraftType':

          return <DraftDocument key={index} title={item.content.title} attachmentId={item.content.attachmentId
          } />
          break;
        case 'ProgressType':
          // 进度条的进度没做活
          return <div key={index}>{progressShow ? <LongProgress /> : ''}</div>

        case 'essayType':
          // 进度条的进度没做活
          return <Essay key={item.key} item={item.content} />
        default: break;
      }

    })
    if (isAddHistory) {
      setPageContent(historyList)
    }
    else {
      setPageContent(addRecord)
    }
    // console.log(historyType);

  }, [componentsType, historyType])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end", });

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [componentsType, loadingShow, progressShow, historyType, pageContent, isAddHistory, dispatch]);



  let handleisMaterialId = (id: any) => {

    setNewId((prev: any) => ({
      ...prev,
      template_id: id.template_id,
      materials_id: id.materials_id
    }))
  }
  return (
    <div style={{ width: '100%', position: 'relative', height: '83vh' }} >
      <div style={{ marginBottom: '0px', overflow: 'auto', maxHeight: "72vh", height: '72vh', paddingBottom: '10px' }} ref={scrollRef} >
        {
          !isAddHistory ? <LongWriting isMaterialId={handleisMaterialId} /> : ''
        }

        {
          // 判断是新增会话，还是历史会话
          // isAddHistory ? historyList : addRecord
          pageContent
        }

      </div>
      <LongSearch newId={newId} />

    </div>
  );
}

export default Page;

