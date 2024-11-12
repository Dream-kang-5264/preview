import { baseUrl } from '@/utils/process'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { Button, Spin, Checkbox, message } from 'antd'
import { getSuggestion } from '@/api/Aitool'
import { fetchEventSource } from '@microsoft/fetch-event-source';

function Suggestion({ AiEditorHtml, isEventStream, AiEditorClear }: any) {
    let [SuggestionData, setSuggestionData] = useState<any>([]);
    let [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>([]); // 状态改为布尔数组
    let [messageData, setMessageData] = useState('')
    let [isclear, setIsClear] = useState(true)
    let [data, setData] = useState({ butDisable: false })
    useEffect(() => {
        getSuggestion({ text: AiEditorHtml }).then((res) => {
            let results = [];

            // 遍历原始数据，并组合成对象
            for (let i = 0; i < res.data.table_data.length; i += 2) {
                const suggestionObject = {
                    Suggestion: res.data.table_data[i],
                    explain: res.data.table_data[i + 1]
                };
                results.push(suggestionObject);
            }
            setSuggestionData(results);
            setSelectedCheckboxes(new Array(results.length).fill(false)); // 初始化选中状态数组
        }).catch((error) => {
            message.error(error)
        })
    }, [AiEditorHtml]);

    // 处理 Checkbox 状态变化
    const handleCheckboxChange = (index: number) => {
        setData((prev: any) => ({
            ...prev,
            butDisable: false
        }))
        const updatedCheckboxes = [...selectedCheckboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index]; // 切换选中状态
        setSelectedCheckboxes(updatedCheckboxes);
    };
    useEffect(() => {

        if (messageData) {
            isEventStream(messageData)
        }

    }, [messageData])

    // 获取选中的建议
    const handleSubmit = async () => {
        setData((prev: any) => ({
            ...prev,
            butDisable: true
        }))
        const ctrl = new AbortController(); //用于中断请求
      
        const selectedSuggestions = SuggestionData.filter((_, index) => selectedCheckboxes[index]);
        // console.log(selectedSuggestions); // 打印选中的建议，可以进行后续处理
        // 这里可以调用其他函数来处理选中的建议
        const result = selectedSuggestions.map((item: any) => {
            return `${item.Suggestion}${item.explain}`;
        }).join(''); // 用空字符串连接
        setIsClear(true)
        AiEditorClear(isclear)

        await fetchEventSource(`${baseUrl}/api/v1/garden/area/edit/stream/text`, {
            method: 'POST',
            openWhenHidden: true, //页面退至后台保持连接

            headers: {
                "Content-Type": 'text/event-stream',
                "token": localStorage.getItem('token') || '',
            },
            body: JSON.stringify({
                suggestion: result,
                text: AiEditorHtml
            }),
            signal: ctrl.signal,

            onmessage(msg) {
                if (msg.data) {
                    try {
                        // console.log(msg.data);
                        // src += msg.data
                        setMessageData(msg.data)
                        // isEventStream(msg.data)

                    } catch (err) {
                        console.log(err);
                    }
                }

            },

            onclose() {//正常结束的回调
                //在这里写一些GPT回答结束后的一些操作
                console.log('请求结束',);

            },
            onerror(err) {//连接出现异常回调
                // 取消请求
                message.error('请求内容错误，请重新尝试')
                console.log(err);
                ; // 发生错误，拒绝 Promise
                throw err
            },
        })
        // console.log(result);
    };

    return (
        <div className={styles.suggestion}>
            {
                SuggestionData.length > 0 ? (
                    <div>
                        {
                            SuggestionData.map((item: any, index: number) => {
                                return (
                                    <div
                                        className={styles.suggestion_list}
                                        style={{ border: selectedCheckboxes[index] ? '2px solid #1677FF' : '1px solid #ccc' }}
                                        key={index}
                                    >
                                        <div>{item.Suggestion}</div>
                                        <div>{item.explain}</div>
                                        <Checkbox
                                            checked={selectedCheckboxes[index]} // 控制选中状态
                                            onChange={() => handleCheckboxChange(index)}
                                        ></Checkbox>
                                    </div>
                                )
                            })
                        }
                        <Button
                            type='primary'
                            style={{ width: '100%', marginBottom: '10px' }}
                            onClick={handleSubmit} // 添加事件处理函数
                            disabled={data.butDisable}
                        >
                            根据建议修改文章
                        </Button>
                    </div>
                ) : (
                    <div className={styles.loading}> <Spin size='large' /></div>
                )
            }
        </div>
    )
}

export default Suggestion;
