import React, { useEffect, useRef, useState } from 'react'
import AiECharts from './AiImage/AiECharts'
import styles from './index.less'
import MermaidChart from './AiImage/MermaidChart';
import { Button, Dropdown, Input, MenuProps, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppSelector } from '@/redux/storeIndex';
import { RecommendedFigure, getOptionData } from '@/api/aiImage';
import { DownOutlined } from '@ant-design/icons';


import {
    // faChartBar,
    // faChartLine,
    // faChartPie,
    // faProjectDiagram,
    // faTasks,
    // faNetworkWired,
} from '@fortawesome/free-solid-svg-icons';

const { TextArea } = Input;
function AiPicture({ isBase64Image, isMermaidBase64 }: any) {
    const chartContainer = useRef<any>(null);
    let { SelectData } = useAppSelector(state => state.firstDraftReducer)
    let [eCharts, setEcharts] = useState<any>(null)
    let [operationECharts, setOperationECharts] = useState<any>(null)

    let [aiImageData, setAiImageData] = useState<any>({ textData: '', eChartsOptions: '', butKey: '1', typeShow: false, butShow: false, RecommendedType: null, RecommendedIcon: '', eChartsShow: false, Base64Image: '', types: 'type1', MermaidBase64: '' })
    let [aiDisabled, setAiDisabled] = useState({ launchBut: false, createBut: true, insertionBtn: true, newBtn: true })
    let [operationData, setOperationData] = useState({ textData: '', textType: '请选择类型', eChartsShow: false })
    let [operationDisabled, setOperationDisabled] = useState({ launchBut: false, createBut: true, insertionBtn: true, newBtn: true })
    useEffect(() => {
        if (aiImageData.RecommendedType) {
            switch (aiImageData.RecommendedType) {
                // case '柱状图':
                //     return setAiImageData({ ...aiImageData, RecommendedIcon: <FontAwesomeIcon icon={faChartBar} size="2x" color="#00d1b2" /> })
                //     break;
                // case '折线图':
                //     return setAiImageData({ ...aiImageData, RecommendedIcon: < FontAwesomeIcon icon={faChartLine} size="2x" color="#00d1b2" /> })
                //     break;
                // case '饼图':
                //     return setAiImageData({ ...aiImageData, RecommendedIcon: < FontAwesomeIcon icon={faChartPie} size="2x" color="#00d1b2" /> })
                // case '思维导图':
                //     return <FontAwesomeIcon icon="fas fa-project-diagram" />
                //     break;
                // case '甘特图':
                //     return <FontAwesomeIcon icon={faTasks} size="2x" color="#00d1b2" />
                //     break;
                // case '流程图':
                //     return <FontAwesomeIcon icon={faNetworkWired} size="2x" color="#00d1b2" />
                default:
                    break;
            }
        }


    }, [aiImageData.RecommendedType])

    const items: any['items'] = [
        {
            label: <div onClick={() => {
                setOperationData((prve: any) => ({
                    ...prve,
                    textType: '柱状图'
                }))
                setOperationDisabled((prve: any) => ({
                    ...prve,
                    createBut: false
                }))
                setAiImageData((prve: any) => ({
                    ...prve,
                    types: 'type1'
                }))
            }}>柱状图</div>,
            key: '0',
            type: 'bar'
        },
        {
            label: <div onClick={() => {
                setOperationData((prve: any) => ({
                    ...prve,
                    textType: '折线图'
                }))
                setOperationDisabled((prve: any) => ({
                    ...prve,
                    createBut: false
                }))
                setAiImageData((prve: any) => ({
                    ...prve,
                    types: 'type1'
                }))
            }}>折线图</div>,
            key: '1',
            type: 'line'
        },
        {
            label: <div onClick={() => {
                setOperationData((prve: any) => ({
                    ...prve,
                    textType: '饼图'
                }))
                setOperationDisabled((prve: any) => ({
                    ...prve,
                    createBut: false
                }))
                setAiImageData((prve: any) => ({
                    ...prve,
                    types: 'type1'
                }))
            }}>饼图</div>,
            key: '2',
            type: 'pie'
        },
        // {
        //     label: <div onClick={() => {
        //         setOperationData((prve: any) => ({
        //             ...prve,
        //             textType: '柱状加折线图'
        //         }))
        //         setOperationDisabled((prve: any) => ({
        //             ...prve,
        //             createBut: false
        //         }))
        //         setAiImageData((prve: any) => ({
        //             ...prve,
        //             types: 'type1'
        //         }))
        //     }}>柱状加折线图</div>,
        //     key: '3',
        //     type: 'bar_line'
        // },
        {
            label: <div onClick={() => {
                setOperationData((prve: any) => ({
                    ...prve,
                    textType: '思维导图'
                }))
                setOperationDisabled((prve: any) => ({
                    ...prve,
                    createBut: false
                }))
                setAiImageData((prve: any) => ({
                    ...prve,
                    types: 'type2'
                }))
            }}>思维导图</div>,
            key: '4',
            type: 'mindmap'
        },
        {
            label: <div onClick={() => {
                setOperationData((prve: any) => ({
                    ...prve,
                    textType: '甘特图'
                }))
                setOperationDisabled((prve: any) => ({
                    ...prve,
                    createBut: false
                }))
                setAiImageData((prve: any) => ({
                    ...prve,
                    types: 'type2'
                }))
            }}>甘特图</div>,
            key: '5',
            type: 'gantt'
        },
        {
            label: <div onClick={() => {
                setOperationData((prve: any) => ({
                    ...prve,
                    textType: '流程图'
                }))
                setOperationDisabled((prve: any) => ({
                    ...prve,
                    createBut: false
                }))
                setAiImageData((prve: any) => ({
                    ...prve,
                    types: 'type2'
                }))
            }}>流程图</div>,
            key: '6',
            type: 'flow'
        },
    ];
    let isBase64Images = (data: any) => {
        // console.log(data);
        setAiImageData((prve: any) => ({
            ...prve,
            Base64Image: data
        }))
    }
    let isMermaidBase64s = (data: any) => [
        setAiImageData((prve: any) => ({
            ...prve,
            MermaidBase64: data
        }))
    ]
    const TabItem: TabsProps['items'] = [
        {
            key: '1',
            // label: <Button type={aiImageData.butKey === '1' ? 'primary' : 'default'}>推荐配图</Button>,
            label: '推荐配图',
            children: <div className={styles.ai_image_Recommended}>
                <div className={styles.ai_image_Recommended_title}>
                    <div style={{ fontWeight: '400', marginBottom: '5px' }}>选中文字:</div>
                    <TextArea rows={5}
                        style={{ height: '120px' }}
                        onChange={(e) => {
                            setAiImageData((prve: any) => ({
                                ...prve,
                                textData: e.target.value,
                                typeShow: false,
                                RecommendedType: '',
                                eChartsShow: false
                            }))
                            setAiDisabled((prve: any) => ({
                                ...prve,
                                launchBut: false,
                                insertionBtn: true,
                                newBtn: true
                            }))
                            setEcharts(null)
                        }} placeholder='请输入' value={aiImageData.textData} />
                    <div className={styles.ai_image_Recommended_title_but}>
                        <Button
                            size='small'
                            type="primary"
                            onClick={() => {
                                setAiImageData((prve: any) => ({
                                    ...prve,
                                    typeShow: false,
                                    RecommendedType: '',
                                    eChartsShow: false,
                                    textData: SelectData,
                                    butShow: true
                                }))
                                setAiDisabled((prve: any) => ({
                                    ...prve,
                                    launchBut: false,
                                    insertionBtn: true,
                                    newBtn: true
                                }))
                                setEcharts(null)
                            }}>获取选中的文本</Button>
                    </div>
                </div>


                {
                    aiImageData.typeShow ? <>
                        {
                            aiImageData.RecommendedType ? <div className={styles.ai_image_Recommended_type}>
                                {/* <div>{aiImageData.RecommendedIcon}</div> */}
                                <div style={{ fontSize: '1.2vw' }}>推荐的图表类型:{aiImageData.RecommendedType.length > 4 ? '异常' : aiImageData.RecommendedType}</div>
                            </div> : <div className={styles.ai_image_Recommended_type} >   <Spin /></div>
                        }
                    </> : <div></div>
                }

                <div className={styles.ai_image_Recommended_button}>
                    {
                        !aiImageData.typeShow ? <Button
                            type="primary"
                            className={styles.ai_image_Recommended_button_but}
                            disabled={aiDisabled.launchBut}
                            onClick={() => {
                                setAiDisabled((prve: any) => ({
                                    ...prve,
                                    createBut: false,
                                    insertionBtn: true
                                }))
                                setAiImageData({ ...aiImageData, typeShow: true })

                                RecommendedFigure({ text: aiImageData.textData }).then((res) => {

                                    setAiDisabled((prve: any) => ({
                                        ...prve,
                                        createBut: false,

                                    }))
                                    setAiImageData({ ...aiImageData, RecommendedType: res.data.type, typeShow: true, types: res.data.chart_type })
                                }).catch((err) => {
                                })
                            }}>发起推荐配图</Button> : ''
                    }

                    <Button type="primary"
                        className={styles.ai_image_Recommended_button_but}
                        disabled={aiDisabled.createBut}
                        onClick={() => {
                            setAiDisabled((prve: any) => ({
                                ...prve,
                                createBut: true,
                            }))
                            setAiImageData((prve: any) => ({
                                ...prve,
                                eChartsShow: true
                            }))
                            getOptionData({ text: aiImageData.textData, type: aiImageData.RecommendedType }).then((res) => {
                                setAiDisabled((prve: any) => ({
                                    ...prve,
                                    createBut: true,
                                    insertionBtn: false,
                                    newBtn: false,
                                }))
                                console.log(aiImageData.types);
                                if (aiImageData.types === 'type1') {
                                    setEcharts(<AiECharts isBase64Image={isBase64Images} eChartsOptions={res.data.chart_data} ></AiECharts>)
                                }
                                else if (aiImageData.types === 'type2') {
                                    console.log(res.data.chart_data);

                                    setEcharts(<MermaidChart isMermaidBase64={isMermaidBase64s} chart={res.data.chart_data} ></MermaidChart>)
                                }

                            }).catch((err) => {

                            })
                        }}>生成图表</Button>
                </div>
                <div className={styles.ai_image_Recommended_chart}>

                    {
                        aiImageData.eChartsShow ? <>
                            {
                                eCharts ? eCharts : <div className={styles.ai_image_Recommended_chart_show} >   <Spin /></div>
                            }
                        </> : <div className={styles.ai_image_Recommended_chart_show} >图表展示区</div>
                    }
                </div>
                <div className={styles.ai_image_Recommended_button}>
                    <Button
                        className={styles.ai_image_Recommended_button_but}
                        disabled={aiDisabled.insertionBtn}
                        onClick={() => {
                            if (aiImageData.types === 'type1') {
                                isBase64Image(aiImageData.Base64Image)
                            }
                            else if (aiImageData.types === 'type2') {
                                isMermaidBase64(aiImageData.MermaidBase64)
                            }

                            setAiImageData((prve: any) => ({
                                ...prve,
                                butShow: false
                            }))
                            setAiDisabled((prve: any) => ({
                                ...prve,
                                launchBut: false,

                            }))
                        }}
                    >插入到编辑器</Button>
                    <Button
                        style={{ marginBottom: '10px' }}
                        className={styles.ai_image_Recommended_button_but}
                        disabled={aiDisabled.newBtn}
                        onClick={() => {
                            setEcharts(null)
                            setAiDisabled((prve: any) => ({
                                ...prve,
                                createBut: true,
                                insertionBtn: true,
                                newBtn: true
                            }))
                            setAiImageData((prve: any) => ({
                                ...prve,
                                eChartsShow: true
                            }))
                            getOptionData({ text: aiImageData.textData, type: aiImageData.RecommendedType }).then((res) => {
                                setAiDisabled((prve: any) => ({
                                    ...prve,
                                    createBut: true,
                                    insertionBtn: false,
                                    newBtn: false
                                }))
                                setEcharts(<AiECharts isBase64Image={isBase64Images} eChartsOptions={res.data.chart_data} ></AiECharts>)
                            }).catch((err) => {

                            })
                        }}
                    >重新生成</Button>
                </div>
            </div>,
        },
        {
            key: '2',
            // label: <Button type={aiImageData.butKey === '2' ? 'primary' : 'default'}>手动选择</Button>,
            label: '手动选择',
            children: <div className={styles.ai_image_Recommended}>
                <div className={styles.ai_image_Recommended_title}>
                    <div style={{ fontWeight: '400', marginBottom: '5px' }}>选中文字:</div>
                    <TextArea rows={5}
                        style={{ height: '120px' }}
                        onChange={(e) => {

                            setOperationData((prve: any) => ({
                                ...prve,
                                textData: e.target.value,
                                eChartsShow: false
                            }))
                        }} placeholder='请输入' value={operationData.textData} />
                    <div className={styles.ai_image_Recommended_title_but}>
                        <Button
                            size='small'
                            type="primary"
                            onClick={() => {
                                setOperationDisabled((prve: any) => ({
                                    ...prve,
                                    createBut: true,
                                    insertionBtn: true
                                }))
                                setOperationData((prve: any) => ({
                                    ...prve,
                                    textData: SelectData,
                                    textType: '请选择类型',
                                    eChartsShow: false
                                }))

                            }}
                        >获取选中的文本</Button>
                    </div>

                </div>

                <div className={styles.ai_image_operation}>
                    <div>
                        <span style={{ fontWeight: '400' }}> 请选择配图类型: </span> <Dropdown menu={{ items }} trigger={['click']}>
                            <Button onClick={(e) => e.preventDefault()}>
                                {operationData.textType}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                    <div className={styles.ai_image_Recommended_button}>
                        <Button type="primary"
                            className={styles.ai_image_Recommended_button_but}
                            disabled={operationDisabled.createBut}
                            onClick={() => {
                                setOperationData((prve: any) => ({
                                    ...prve,
                                    eChartsShow: true
                                }))
                                setOperationDisabled((prve: any) => ({
                                    ...prve,
                                    createBut: true,
                                    insertionBtn: true
                                }))
                                setOperationECharts(null)
                                getOptionData({ text: operationData.textData, type: operationData.textType }).then((res) => {

                                    setOperationDisabled((prve: any) => ({
                                        ...prve,
                                        insertionBtn: false,
                                        createBut: false,
                                        newBtn: false
                                    }))
                                    if (aiImageData.types === 'type1') {
                                        setOperationECharts(<AiECharts isBase64Image={isBase64Images} eChartsOptions={res.data.chart_data} ></AiECharts>)
                                    }
                                    else if (aiImageData.types === 'type2') {
                                        // console.log(res.data.chart_data);
                                        // return
                                        setOperationECharts(<MermaidChart isMermaidBase64={isMermaidBase64} chart={res.data.chart_data} ></MermaidChart>)
                                    }
                                }).catch((err) => {

                                })
                            }}
                        >生成图表</Button>
                    </div>
                </div>
                <div className={styles.ai_image_Recommended_chart}>

                    {
                        operationData.eChartsShow ? <>
                            {
                                operationECharts ? operationECharts :

                                    <div className={styles.ai_image_Recommended_chart_show}>   <Spin /></div>
                            }
                        </> : <div className={styles.ai_image_Recommended_chart_show}>图表展示区</div>
                    }
                </div>
                <div className={styles.ai_image_Recommended_button}>
                    <Button
                        onClick={() => {
                            if (aiImageData.types === 'type1') {
                                isBase64Image(aiImageData.Base64Image)
                            }
                            else if (aiImageData.types === 'type2') {
                                isMermaidBase64(aiImageData.MermaidBase64)
                            }
                          
                            setAiImageData((prve: any) => ({
                                ...prve,
                                butShow: false
                            }))

                            setOperationDisabled((prve: any) => ({
                                ...prve,
                                launchBut: false,
                                insertionBtn: false,

                            }))

                        }}
                        className={styles.ai_image_Recommended_button_but}
                        disabled={operationDisabled.insertionBtn}
                       
                    >插入到编辑器</Button>

                    <Button
                        style={{ marginBottom: '10px' }}
                        className={styles.ai_image_Recommended_button_but}
                        disabled={operationDisabled.newBtn}
                    >重新生成</Button>
                </div>
            </div>,
        },

    ];
    const onChange = (key: string) => {
        console.log(key);
        setAiImageData((prve: any) => ({
            ...prve,
            butKey: key
        }))
    };

    return (
        <div className={styles.ai_image_body}>


            {/* 
            <div className={styles.ai_image_title}>选中编辑器中的文字，生成推荐的配图或手动选择配图类型。</div> */}
            <Tabs defaultActiveKey="1" items={TabItem} centered onChange={onChange} animated />




        </div>
    )
}

export default AiPicture



