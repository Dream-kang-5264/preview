
"use client";
import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from '@/utils/process'

import { useAppSelector, useAppDispatch } from "@/redux/storeIndex";
import { setComponentsType, setDecordId, setmessageOutlineId, setoutlineLoading, setoutlineRawdata, setaddOutlineid, settitleOutlineShow, setoutlineValue, sethistoryType } from '@/redux/module/LongStore'
import { SSEFetch } from '@/utils/sse'
import { setoutlineShow, setloadingShow } from '@/redux/module/LongStore'
import { fetchEventSource } from '@microsoft/fetch-event-source';
// 假设这是从某处（如API或静态数据）获取的数据  
import _ from 'lodash';

import { setthemeShow } from "@/redux/module/homeStore";
import { getCreateRecord, getTierOutline } from "@/api/outline";
import { Button, Tooltip, message } from "antd";

import Send from '../../../../public/home/Frame.png'
import { history } from "umi";
import { v4 as uuidv4 } from 'uuid';
function Index({ newId }: any) {
  interface ModuleType {
    type: string;
    content?: string | number;
    key: number;
  }

  let inputRef = useRef<HTMLInputElement>(null);
  let dispatch = useAppDispatch()
  let [LongValue, setLongValue] = useState("");
  let { themeShow } = useAppSelector((state) => state.homeReducer);
  const [stopShow, setstopShow] = useState(false);
  let { componentsType, isAddHistory, createDecordId, historyDecordId, historyType, outlineLevel, Longtitle, } = useAppSelector(state => state.longReducer)
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  // let [modulesType, setmodulesType] = useState<ModuleType[]>([...componentsType])
  let themeText = (
    <span style={{ borderRadius: ".2rem", marginLeft: '1rem' }}>
      帮我写一篇长文，主题是：
    </span>
  );
  let handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && LongValue) {
      handleLong()
    }
  }
  useEffect(() => {
    // console.log(MaterialId ,'Material');
    getCreateRecord().then((res) => {
      dispatch(setDecordId(res.data.chatId))
    }).catch((error) => {
      message.error(error)
    })
  }, [])
  let longInput = <input
    key='1'
    type="text"
    onChange={(e) => {
      setLongValue(e.target.value);

    }}
    onKeyDown={handleKeyDown}
    value={LongValue}
    ref={inputRef}
    style={{ flex: 1, paddingLeft: '1vw', fontSize: '1vw', height: '100%', background: 'none', outline: "none", border: 'none' }}
    placeholder="今天需要我做些什么？shift+enter换行"
  />
  let titleInput = <input
    key='2'
    type="text"
    onChange={(e) => {
      setLongValue(e.target.value);
    }}
    onKeyDown={handleKeyDown}
    value={LongValue}
    ref={inputRef}
    style={{ flex: 1, paddingLeft: '1vw', fontSize: '1vw', height: '100%', background: 'none', outline: "none", border: 'none' }}
    placeholder="请输入要生成的标题"
  />

  // 处理短文标题的方法
  function extractContent(data: any) {
    // 检查第一条数据是否包含 H1 标签
    const firstData = data[0].data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(firstData, 'text/html');
    const h1Element = doc.querySelector('H1');

    if (h1Element) {
      // 如果存在 H1 标签，提取其内容
      return h1Element.textContent;
    } else {
      // 如果不存在 H1 标签，提取整个数据的第一条数据剔除标签后内容的前15个字数
      const textContent = doc.body.textContent || doc.body.innerText;
      return textContent.slice(0, 15);
    }
  }

  // 点击发送
  let handleLong = async () => {
    const ctrl = new AbortController(); //用于中断请求
    setAbortController(ctrl); // 设置 AbortController

    dispatch(setthemeShow(false))


    if (!themeShow) setstopShow(true)

    // 获取用户输入的文本
    let newComponents = JSON.parse(JSON.stringify(componentsType))
    let myType = {
      type: 'myType',
      content: LongValue,
      key: Math.floor(Math.random() * 99999999) + 1,
    }
    newComponents.push(myType)
    dispatch(setComponentsType(newComponents))
    // 显示加载组件
    dispatch(setloadingShow(true))
    setLongValue('');
    // 短文
    if (Longtitle === 3) {

      if (!newId.template_id) {
        setstopShow(false)
        return message.warning('请上传仿写的范文文件')
      }
      // 显示加载组件
      let loadingComponents = JSON.parse(JSON.stringify(newComponents))
      // 开启loading效果
      let loadingType: ModuleType = {
        type: 'loadingType',
        key: Math.floor(Math.random() * 99999999) + 1,
      }
      newComponents.forEach((item: any, index: number) => {
        if (item.type === 'loadingType') {
          loadingComponents.splice(index, 1)
        }
      })
      loadingComponents.push(loadingType)
      dispatch(setComponentsType(loadingComponents))
      let attachmentId = uuidv4();
      let src = ''
      let crr: any = []
      let title: any = []
      await fetchEventSource(`${baseUrl}/api/v1/garden/area/general/writing/stream/template/text`, {
        method: 'POST',
        openWhenHidden: true, //页面退至后台保持连接

        headers: {
          "Content-Type": 'text/event-stream',
          "token": localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          topic: LongValue,
          conversation_id: createDecordId,
          attachment_id: attachmentId,
          template_id: newId.template_id,
          materials_id: newId.materials_id
        }),
        signal: ctrl.signal,
        onmessage(msg) {

          if (msg.data) {
            try {
              // console.log(msg.data)
              dispatch(setloadingShow(false))
              let addcomponentsType = JSON.parse(JSON.stringify(loadingComponents))
              // console.log(msg)
              title.push(msg)
              src += msg.data + '\n\n'
              let essayType = {
                type: 'essayType',
                content: {
                  content: src,
                  type: 'html',
                }
              }
              console.log(src);

              addcomponentsType.push(essayType)
              dispatch(setComponentsType(addcomponentsType))
              // dispatch(setAItext(src))
              crr = addcomponentsType
            } catch (err) {
              console.log(err);
            }
          }

        },

        onclose() {//正常结束的回调
          //在这里写一些GPT回答结束后的一些操作
          console.log('请求结束');
          dispatch(setoutlineLoading(false))
          setstopShow(false)
          let attachmentComponents = JSON.parse(JSON.stringify(crr))
          let newtitle = extractContent(title)?.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, '')
          let DraftType = {
            type: 'DraftType',
            content: {
              title: newtitle,
              attachmentId: attachmentId,
            },
            id: attachmentId,
            key: Math.floor(Math.random() * 99999999) + 1
          }
          attachmentComponents.push(DraftType)
          dispatch(setComponentsType(attachmentComponents))
        },
        onerror(err) {//连接出现异常回调
          // 取消请求
          message.error('请求内容错误，请重新尝试')
          console.log(err);
          ; // 发生错误，拒绝 Promise
          throw err
        },
      })
      return
    }
    // 判断是新增会话还是历史会话
    if (isAddHistory) {

      // 历史会话
      //文字回答
      let newComponents = JSON.parse(JSON.stringify(historyType))
      let myType = {
        type: 'user',
        content: LongValue,
        key: Math.floor(Math.random() * 99999999) + 1,
      }
      newComponents.push(myType)
      dispatch(sethistoryType(newComponents))
      // 显示加载组件
      let loadingComponents = JSON.parse(JSON.stringify(newComponents))
      // 开启loading效果
      let loadingType: ModuleType = {
        type: 'loadingType',
        key: Math.floor(Math.random() * 99999999) + 1,
      }
      newComponents.forEach((item: any, index: number) => {
        if (item.type === 'loadingType') {
          loadingComponents.splice(index, 1)
        }
      })
      loadingComponents.push(loadingType)
      dispatch(sethistoryType(loadingComponents))
      dispatch(setloadingShow(true))


      if (LongValue.includes('写短文')) {
        let attachmentId = uuidv4();
        let src = ''
        let crr: any = []
        let title: any = []
        await fetchEventSource(`${baseUrl}/api/v1/garden/area/general/writing/stream/text`, {
          method: 'POST',
          openWhenHidden: true, //页面退至后台保持连接

          headers: {
            "Content-Type": 'text/event-stream',
            "token": localStorage.getItem('token') || '',
          },
          body: JSON.stringify({
            user_input: LongValue,
            conversation_id: historyDecordId,
            attachment_id: attachmentId
          }),
          signal: ctrl.signal,
          onmessage(msg) {

            if (msg.data) {
              try {

                dispatch(setloadingShow(false))
                let addcomponentsType = JSON.parse(JSON.stringify(loadingComponents))
                // console.log(msg)
                title.push(msg)

                src += msg.data + '\n'
                console.log(src, '22222');
                let essayType = {
                  type: 'assistant',
                  content: {
                    content: src,
                    type: 'html',
                  },
                }

                addcomponentsType.push(essayType)
                dispatch(sethistoryType(addcomponentsType))
                // dispatch(setAItext(src))
                crr = addcomponentsType
              } catch (err) {
                console.log(err);
              }
            }

          },

          onclose() {//正常结束的回调
            //在这里写一些GPT回答结束后的一些操作
            console.log('请求结束');
            dispatch(setoutlineLoading(false))
            setstopShow(false)
            let attachmentComponents = JSON.parse(JSON.stringify(crr))
            let newtitle = extractContent(title)?.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, '')
            console.log(newtitle);

            let DraftType = {
              type: 'DraftType',
              content: {
                title: newtitle,
                attachmentId: attachmentId,
              },
              id: attachmentId,
              key: Math.floor(Math.random() * 99999999) + 1
            }

            attachmentComponents.push(DraftType)
            dispatch(sethistoryType(attachmentComponents))
          },
          onerror(err) {//连接出现异常回调
            // 取消请求
            message.error('请求内容错误，请重新尝试')
            console.log(err);
            ; // 发生错误，拒绝 Promise
            throw err
          },
        })
        return
      }
      let src: any = ''
      await fetchEventSource(`${baseUrl}/api/v1/admin/user/answers`, {
        method: 'POST',
        openWhenHidden: true, //页面退至后台保持连接
        headers: { "Content-Type": 'text/event-stream', "token": localStorage.getItem('token') || '', },
        body: JSON.stringify({
          text: LongValue,
          conversation_id: historyDecordId,
          order_id: 1
        }),
        signal: ctrl.signal,
        onmessage(msg) {
          if (msg.data) {
            try {
              dispatch(setloadingShow(false))
              const result = JSON.parse(`"${msg.data}"`);
              src += result;
              // src += msg.data
              console.log(src);

              dispatch(setoutlineShow(true))
              let thesisComponents = JSON.parse(JSON.stringify(loadingComponents))
              let thesisType = {
                type: 'assistant',
                content: {
                  content: src,
                  type: 'Unicode',
                },
                key: Math.floor(Math.random() * 99999999) + 1,
              }
              thesisComponents.push(thesisType)
              dispatch(sethistoryType(thesisComponents))
              // dispatch(setAItext(src))

            } catch (err) {
              console.log(err);
            }
          }

        },

        onclose() {//正常结束的回调
          //在这里写一些GPT回答结束后的一些操作
          console.log('请求结束');
          dispatch(setoutlineLoading(false))
          setstopShow(false)
        },
        onerror(err) {//连接出现异常回调
          // 取消请求
          console.log(err);
          ; // 发生错误，拒绝 Promise
          throw err
        },
      })
    }
    // 新增会话
    else {


      // 显示加载组件
      let loadingComponents = JSON.parse(JSON.stringify(newComponents))
      let loadingType: ModuleType = {
        type: 'loadingType',
        key: Math.floor(Math.random() * 99999999) + 1,
      }
      loadingComponents.forEach((item: any, index: number) => {
        if (item.type === 'loadingType') {
          loadingComponents.splice(index, 1)
        }
      })
      loadingComponents.push(loadingType)
      dispatch(setComponentsType(loadingComponents))
      if (LongValue.includes('写短文')) {
        // console.log(LongValue);

        // 显示加载组件
        // let loadingComponents = JSON.parse(JSON.stringify(newComponents))
        // let loadingType: ModuleType = {
        //   type: 'loadingType',
        //   key: Math.floor(Math.random() * 99999999) + 1,
        // }
        // loadingComponents.forEach((item: any, index: number) => {
        //   if (item.type === 'loadingType') {
        //     loadingComponents.splice(index, 1)
        //   }
        // })
        // loadingComponents.push(loadingType)
        // dispatch(setComponentsType(loadingComponents))
        let attachmentId = uuidv4();
        let src = ''
        let crr: any = []
        let title: any = []
        await fetchEventSource(`${baseUrl}/api/v1/garden/area/general/writing/stream/text`, {
          method: 'POST',
          openWhenHidden: true, //页面退至后台保持连接

          headers: {
            "Content-Type": 'text/event-stream',
            "token": localStorage.getItem('token') || '',
          },
          body: JSON.stringify({
            user_input: LongValue,
            conversation_id: createDecordId,
            attachment_id: attachmentId
          }),
          signal: ctrl.signal,

          onmessage(msg) {


            if (msg.data) {


              try {
                dispatch(setloadingShow(false))
                let addcomponentsType = JSON.parse(JSON.stringify(loadingComponents))
                // console.log(msg.data)
                title.push(msg)


                // console.log(title)
                src += msg.data + '\n'
                console.log(src, '!!!');
                let essayType = {
                  type: 'essayType',
                  content: {
                    content: src,
                    type: 'html',
                  },
                }
                addcomponentsType.push(essayType)
                dispatch(setComponentsType(addcomponentsType))
                // dispatch(setAItext(src))
                crr = addcomponentsType
              } catch (err) {
                console.log(err);
              }
            }

          },

          onclose() {//正常结束的回调
            //在这里写一些GPT回答结束后的一些操作
            console.log('请求结束');
            dispatch(setoutlineLoading(false))
            setstopShow(false)
            let attachmentComponents = JSON.parse(JSON.stringify(crr))



            let newtitle = extractContent(title)?.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, '')
            // console.log(newtitle, 'newTitle');

            let DraftType = {
              type: 'DraftType',
              content: {
                title: newtitle,
                attachmentId: attachmentId,
              },
              id: attachmentId,
              key: Math.floor(Math.random() * 99999999) + 1
            }

            attachmentComponents.push(DraftType)
            dispatch(setComponentsType(attachmentComponents))
          },
          onerror(err) {//连接出现异常回调
            // 取消请求
            message.error('请求内容错误，请重新尝试')
            console.log(err);
            ; // 发生错误，拒绝 Promise
            throw err
          },
        })
        return
      }
      else if (!themeShow) {
        let loadingComponents = JSON.parse(JSON.stringify(newComponents))
        // 开启loading效果
        let loadingType: ModuleType = {
          type: 'loadingType',
          key: Math.floor(Math.random() * 99999999) + 1,
        }
        loadingComponents.forEach((item: any, index: number) => {
          if (item.type === 'loadingType') {
            loadingComponents.splice(index, 1)
          }
        })
        loadingComponents.push(loadingType)
        dispatch(setComponentsType(loadingComponents))
        let src = ''
        await fetchEventSource(`${baseUrl}/api/v1/admin/user/answers`, {
          method: 'POST',
          openWhenHidden: true, //页面退至后台保持连接

          headers: {
            "Content-Type": 'text/event-stream',
            "token": localStorage.getItem('token') || '',
          },
          body: JSON.stringify({
            text: LongValue,
            conversation_id: createDecordId,
            order_id: 1
          }),
          signal: ctrl.signal,

          onmessage(msg) {


            if (msg.data) {
              try {
                dispatch(setloadingShow(false))
                // console.log(msg.data);
                const result = JSON.parse(`"${msg.data}"`);
                src += result;
                // src += msg.data
                // console.log(src);
                dispatch(setoutlineShow(true))
                let thesisComponents = JSON.parse(JSON.stringify(loadingComponents))
                let thesisType = {
                  type: 'longType',
                  content: {
                    content: src,
                    type: 'Unicode',
                  },
                  key: Math.floor(Math.random() * 99999999) + 1,
                }
                thesisComponents.push(thesisType)
                dispatch(setComponentsType(thesisComponents))
                // dispatch(setAItext(src))

              } catch (err) {
                console.log(err);
              }
            }

          },

          onclose() {//正常结束的回调
            //在这里写一些GPT回答结束后的一些操作
            console.log('请求结束');
            setstopShow(false)
            dispatch(setoutlineLoading(false))
          },
          onerror(err) {//连接出现异常回调
            // 取消请求
            message.error('请求内容错误，请重新尝试')
            console.log(err);
            ; // 发生错误，拒绝 Promise
            throw err
          },
        })

      }
      else {
        // 换个大纲需要的字段
        dispatch(setoutlineValue(LongValue))

        let loadingComponents = JSON.parse(JSON.stringify(newComponents))
        // 开启loading效果
        let loadingType: ModuleType = {
          type: 'loadingType',
          content: Math.floor(Math.random() * 99999999) + 1,
          key: Math.floor(Math.random() * 99999999) + 1,
        }
        loadingComponents.forEach((item: any, index: number) => {
          if (item.type === 'loadingType') {
            loadingComponents.splice(index, 1)
          }
        })
        loadingComponents.push(loadingType)
        dispatch(setComponentsType(loadingComponents))
        // 生成大纲
        getTierOutline({ topic: LongValue, conversation_id: createDecordId, level: outlineLevel }).then((res) => {

          if (res.data.status.code === 200) {
            dispatch(setloadingShow(false))
            dispatch(setaddOutlineid(res.data.messageId))
            dispatch(settitleOutlineShow(true))
            let outlineComponents = JSON.parse(JSON.stringify(loadingComponents))
            let outlineType = {
              type: 'outlineType',
              content: res.data.article_outline,
              key: Math.floor(Math.random() * 99999999) + 1
            }
            outlineComponents.push(outlineType)
            dispatch(setComponentsType(outlineComponents))
          }
        }).catch((error) => {
          message.error(error)
        })




        // 流式大纲
        return

      }
    }



  };
  const CircleStop: React.FC<{ size: number }> = ({ size }) => {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  };
  return (
    <div
      style={{
        background: "#fff",
        width: "90%",
        position: "absolute",
        // paddingBottom:'20px',
        bottom: '0px',
        right: '5%',
        height: '75px'
        // marginTop:'1vw',
        // height:'10vh'
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          height: "3rem",
          // paddingLeft: "1rem",
          border: "1px solid #336FFD",
          borderRadius: "10px",
        }}
      >
        {themeShow ? themeText : ""}{" "}
        {themeShow ? titleInput : longInput}
        {/* <div
          style={{
            // display: "flex",
            // justifyContent: "space-evenly",
            fontSize: "1.2vw",
          }}
        > */}
        {
          stopShow ? <div style={{ background: '#E53E3E', border: 'none', height: '60%', marginRight: '1vh', display: 'flex', alignItems: 'center', width: '4%', borderRadius: '1vh', justifyContent: 'center', color: '#fff' }} onClick={() => {
            if (abortController) {
              abortController.abort(); // 终止请求
              setstopShow(false)
            }
          }}

          >
            <CircleStop size={20} />
          </div> : <>
            {
              !LongValue ?
                <Tooltip placement="top" title={'请输入内容'}>
                  <div style={{ background: '#D6E2FF', border: 'none', height: '60%', marginRight: '1vh', display: 'flex', alignItems: 'center', width: '4%', borderRadius: '1vh', justifyContent: 'center' }}>    <img width={20} height={20} src={Send} alt='' /></div>
                </Tooltip> :
                <div style={{ background: '#3370FF', border: 'none', height: '60%', marginRight: '1vh', display: 'flex', alignItems: 'center', width: '4%', borderRadius: '1vh', justifyContent: 'center' }}>    <img width={20} height={20} src={Send} alt='' onClick={handleLong} /></div>
            }
          </>
        }


        {/* </div> */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1vh', }}>
        <Button
          type="primary"
          style={{ background: '#1677FF', color: '#fff' }}
          size="small"
          onClick={() => {
            if (!isAddHistory) {
              history.push('/')
            } else {
              history.push('/history')
            }

          }}>返回</Button>
        <span style={{ fontSize: '2vh', color: '#999', flex: 1, display: 'flex', justifyContent: 'space-evenly' }}> 内容由AI生成，仅供参考，请遵守《智笔用户协议》、《智笔个人信息保护规则》</span>
        {/* <Button type="primary">返回</Button> */}
      </div>

    </div>
  );
}

export default Index;

