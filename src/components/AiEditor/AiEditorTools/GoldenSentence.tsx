import { Avatar, Button, Checkbox, ConfigProvider, Drawer, Empty, Form, Input, List, Pagination, Radio, Skeleton, Spin, Tabs, TabsProps, Tooltip, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'
import TextArea from 'antd/es/input/TextArea';
import type { FormProps, RadioChangeEvent } from 'antd';
import { aiGoldenSentenceArticle, aiGoldenSentenceTheme, aiGoldenSentenceWriting } from '@/api/goldensentence';
import { EnterOutlined } from '@ant-design/icons';
import { getAllMaterial, getSearchClass, getSearchFilter } from '@/api/search';

import Send from '../../../../public/send.svg'
import Sends from '../../../../public/send2.svg'
const zhCN = require('antd/lib/locale/zh_CN').default;
function GoldenSentence({ isThemeData }: any) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    let [goldenSentence, setGoldenSentence] = useState<any>({ topic: '', reference: '', butKey: '1', exampleShow: false, quantity: '1', creation: '', exampleLoadding: true, content: '', article: '' })
    let [goldenSentenceTheme, setGoldenSentenceTheme] = useState({ themeShow: false, themeValue: '', content: "", themeLoadding: true, article: '' })
    let [goldenSentenceExtract, setGoldenSentenceExtract] = useState<any>({ extractShow: false, extractLoadding: true, content: '', article: '' })
    type FieldType = {
        example?: string;
        theme?: string;
        demand?: string;
        quantity?: string;
        section?: string;
        consult?: string;
        require: string
    };
    let handleTab = (key: string) => {
        setGoldenSentence((prve: any) => ({
            ...prve,
            butKey: key
        }))
    }
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setGoldenSentence((prve: any) => ({
            ...prve,
            exampleShow: true,
            froms: values
        }))
        aiGoldenSentenceWriting({ topic: values.theme, reference: values.example, creation: values.demand, quantity: values.quantity }).then((res) => {
            // console.log(JSON.parse(res.data.content));
            if (res.data.status.code === 200) {
                setGoldenSentence((prve: any) => ({
                    ...prve,
                    exampleLoadding: false,
                    content: JSON.parse(res.data.content),
                }))
            }
        }).catch((error) => {
            message.error(error)
        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    let handleQuantity = (e: RadioChangeEvent) => {

        setGoldenSentence((prve: any) => ({
            ...prve,
            quantity: e.target.value
        }))
    }
    // 主题生成
    let handleGetTheme = () => {
        setGoldenSentenceTheme((prve: any) => ({
            ...prve,
            themeShow: true
        }))
        aiGoldenSentenceTheme({ topic: goldenSentenceTheme.themeValue }).then((res) => {
            if (res.data.status.code === 200) {
                setGoldenSentenceTheme((prve: any) => ({
                    ...prve,
                    themeLoadding: false,
                    article: res.data.article,
                    content: res.data.content,

                }))
            }

        }).then((err) => {
            // console.log(err);

        }).catch((error) => {
            message.error(error)
        })


    }
    // 提炼的表单
    let onFinishExtract: FormProps<FieldType>['onFinish'] = (values) => {
        setGoldenSentenceExtract((prve: any) => ({
            ...prve,
            extractShow: true,
            froms: values
        }))
        aiGoldenSentenceArticle({ query: values.section, creation: values.require }).then((res) => {

            if (res.data.status.code === 200) {
                setGoldenSentenceExtract((prve: any) => ({
                    ...prve,
                    extractLoadding: false,
                    content: res.data.content,
                    article: res.data.article,
                }))
            }
        }).catch((err) => {

        })

    }
    const onFinishFailedExtract: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // 接受素材
    let getMaterial = (data: any) => {
        setOpen(false);
        console.log(data.content);
        setGoldenSentence((prve: any) => ({
            ...prve,
            reference: data.content
        }))
        form.setFieldsValue({ example: data.content });
        // console.log(goldenSentence);

    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <Button type={goldenSentence.butKey === '1' ? 'primary' : 'default'}>样例仿写</Button>,
            children: <div style={{ overflow: 'auto', overflowX: 'hidden' }}>
                <Drawer
                    placement="right"
                    closable={false}
                    onClose={() => { setOpen(false); }}
                    open={open}
                    getContainer={false}
                    style={{ height: '100%' }}
                >
                    <Material getMaterial={getMaterial}></Material>
                </Drawer>
                {
                    !goldenSentence.exampleShow ? < div className={styles.golden_sentence_example}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={goldenSentence.froms}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <div className={styles.golden_sentence_example_title}><span>创作主题</span><span></span></div>
                            <Form.Item<FieldType>
                                // label="Username"
                                name="theme"
                                wrapperCol={{ offset: 0, span: 24 }}
                                rules={[{ required: true, message: '请输入要仿写主题' }]}
                            >

                                <Input.TextArea style={{ height: 68, }} placeholder="请输入要仿写的主题，如：深入基层，重要举措等" />
                            </Form.Item>
                            <div className={styles.golden_sentence_example_title}><span>参考样例</span>
                                <span style={{ color: 'red', fontWeight: '400', fontSize: '2vh', cursor: 'pointer' }} onClick={() => {
                                    setOpen(true)
                                }}>＋选择参考样例</span></div>
                            <Form.Item<FieldType>

                                wrapperCol={{ offset: 0, span: 24 }}
                                name="example"
                                rules={[{ required: true, message: '请输入参考样例' }]}
                            >

                                <Input.TextArea style={{ height: 150, }} placeholder='1.万山磅礴必有主峰，龙衮九章但挚一领。
2.啃最硬的骨头，接最烫的山芋，善于抓住矛盾问题的“牛鼻子”，勇于化解利益纠纷的“卡脖子”，敢于突破推诿扯皮的“肠梗阻”，扑下身子，动真碰硬，主政一方的领头雁定能团结带领“关键少数”施展好全面深化改革的“关键一招”。' />
                            </Form.Item>

                            <div className={styles.golden_sentence_example_title}><span>创造要求</span><span></span></div>
                            <Form.Item<FieldType>
                                wrapperCol={{ offset: 0, span: 24 }}
                                name="demand"
                                rules={[{ required: true, message: '请输入创造要求！' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <div className={styles.golden_sentence_example_title}><span>创造数量</span><span></span></div>
                            <Form.Item<FieldType>
                                wrapperCol={{ offset: 0, span: 24 }}
                                name="quantity"
                            // rules={[{ required: true, message: '请输入创造数量!' }]}
                            >
                                <Radio.Group initialValues={goldenSentence.quantity} value={goldenSentence.quantity} className={styles.golden_sentence_example_quantity} buttonStyle="solid" onChange={handleQuantity}>
                                    <Radio.Button value="1">1组</Radio.Button>
                                    <Radio.Button value="2">2组</Radio.Button>
                                    <Radio.Button value="3">3组</Radio.Button>
                                    <Radio.Button value="4">4组</Radio.Button>
                                    <Radio.Button value="5">5组</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{ offset: 4, span: 16 }}
                            >
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit" onClick={() => {

                                    }}>
                                        开始生成
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                        : <>
                            {
                                !goldenSentence.exampleLoadding ? <div className={styles.golden_sentence_result}>

                                    <div style={{ flex: '1', overflow: 'hidden' }}>
                                        <div className={styles.golden_sentence_result_title}><span>创作内容</span><span></span></div>
                                        <List
                                            size="large"
                                            // header={<div>Header</div>}
                                            // footer={<div>Footer</div>}
                                            // bordered
                                            dataSource={goldenSentence.content.content}
                                            renderItem={(item: any) => <List.Item

                                                actions={[<Checkbox key='actions' onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setGoldenSentence((prve: any) => ({
                                                            ...prve,
                                                            article: [...goldenSentence.article, item.description]
                                                        }))
                                                    }
                                                    else if (!e.target.checked) {
                                                        setGoldenSentence((prve: any) => ({
                                                            ...prve,
                                                            article: goldenSentence.article.filter((items: any) => items !== item.description)
                                                        }))

                                                    }

                                                }}></Checkbox>]}
                                            >{item.description}</List.Item>}
                                        />
                                    </div>
                                    <div className={styles.golden_sentence_result_button}>

                                        <Button onClick={() => {
                                            setGoldenSentence((prve: any) => ({
                                                ...prve,
                                                exampleShow: false,
                                                exampleLoadding: true,
                                                article: ''
                                            }))
                                        }}>上一步</Button>
                                        <Button onClick={() => {

                                            isThemeData(goldenSentence.article.join(''))
                                        }} type="primary" >插入编辑器</Button>
                                    </div>
                                </div> : <div className={styles.golden_sentence_spin}>
                                    <Spin size="large" />
                                </div>
                            }
                        </>

                }
            </div>

        },
        {
            key: '2',
            label: <Button type={goldenSentence.butKey === '2' ? 'primary' : 'default'}>主题生成</Button>,
            children: <>
                {
                    !goldenSentenceTheme.themeShow ?
                        <div className={styles.golden_sentence_theme}>
                            <div className={styles.golden_sentence_theme_title}>
                                <div className={styles.golden_sentence_theme_title_item}>创作主题</div>
                                <Input.TextArea style={{ height: 150, }}
                                    onChange={(e) => {
                                        setGoldenSentenceTheme((prve: any) => ({
                                            ...prve,
                                            themeValue: e.target.value
                                        }))
                                    }}
                                    placeholder='1.万山磅礴必有主峰，龙衮九章但挚一领。
2.啃最硬的骨头，接最烫的山芋，善于抓住矛盾问题的“牛鼻子”，勇于化解利益纠纷的“卡脖子”，敢于突破推诿扯皮的“肠梗阻”，扑下身子，动真碰硬，主政一方的领头雁定能团结带领“关键少数”施展好全面深化改革的“关键一招”。' />
                            </div>
                            <div className={styles.golden_sentence_theme_next}>
                                <Button type="primary" disabled={goldenSentenceTheme.themeValue === ''} onClick={handleGetTheme}>开始生成</Button>
                            </div>
                        </div>
                        :

                        <div className={styles.golden_sentence_theme_result}>
                            {/* 主题内容 */}
                            {
                                goldenSentenceTheme.themeLoadding ?
                                    <div className={styles.golden_sentence_theme_result_loadding} >< Spin size="large" /></div> :
                                    <div className={styles.golden_sentence_theme_result_content}>

                                        <div className={styles.golden_sentence_theme_result_content_item} dangerouslySetInnerHTML={{ __html: goldenSentenceTheme.content }} >


                                        </div>

                                    </div>
                            }

                            <div className={styles.golden_sentence_result_button}>
                                <Button onClick={() => {
                                    setGoldenSentenceTheme((prve: any) => ({
                                        ...prve,
                                        themeShow: false,
                                        themeLoadding: true,
                                        themeValue: ''
                                    }))
                                }}>上一步</Button> <Button type="primary" onClick={() => {
                                    isThemeData(goldenSentenceTheme.article)
                                }} >插入编辑器</Button>
                            </div>
                        </div>



                }
            </>,
        },
        {
            key: '3',
            label: <Button type={goldenSentence.butKey === '3' ? 'primary' : 'default'}>段落提炼</Button>,
            children: <>
                {
                    !goldenSentenceExtract.extractShow ?
                        <div className={styles.golden_sentence_extract}>
                            <Form
                                name="basics"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                initialValues={goldenSentenceExtract.froms}
                                onFinish={onFinishExtract}
                                onFinishFailed={onFinishFailedExtract}
                                autoComplete="off"
                            >
                                <div className={styles.golden_sentence_extract_title}><span>文章段落</span><span></span></div>
                                <Form.Item<FieldType>
                                    // label="Username"
                                    wrapperCol={{ offset: 0, span: 24 }}
                                    name="section"
                                    rules={[{ required: true, message: '请输入文章段落!' }]}
                                >
                                    <Input.TextArea placeholder='请输入您要总结金句文章的段落' style={{ height: 180, }} />
                                </Form.Item>
                                {/* <div className={styles.golden_sentence_extract_title}><span>参考样例</span>
                                    <span style={{ color: 'red', fontWeight: '400', fontSize: '2vh', cursor: 'pointer' }}>＋选择参考样例</span></div> */}

                                <div className={styles.golden_sentence_extract_title}><span>提炼要求</span><span></span></div>
                                <Form.Item<FieldType>
                                    name="require"
                                    rules={[{ required: true, message: '请输入创造要求' }]}
                                    wrapperCol={{ offset: 0, span: 24 }}
                                >
                                    <Input.TextArea style={{ height: 50, }} placeholder='请输入创造要求' />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    wrapperCol={{ offset: 0, span: 24 }}
                                >
                                </Form.Item>
                                <Form.Item<FieldType>
                                    wrapperCol={{ offset: 0, span: 24 }}
                                >
                                </Form.Item>
                                <Form.Item<FieldType>
                                    wrapperCol={{ offset: 0, span: 24 }}
                                >
                                </Form.Item>


                                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                                    <div style={{ width: '100%', textAlign: 'center', }}>
                                        <Button type="primary" htmlType="submit" >
                                            开始生成
                                        </Button>
                                    </div>

                                </Form.Item>
                            </Form>

                        </div>
                        :

                        <>
                            {
                                goldenSentenceExtract.extractLoadding ? <div className={styles.golden_sentence_spin}>
                                    <Spin size="large" />
                                </div> : <div className={styles.golden_sentence_result}>

                                    <div style={{ flex: '1', height: '90%' }}>
                                        <div className={styles.golden_sentence_result_title}><span>提炼内容</span><span></span></div>
                                        <div className={styles.golden_sentence_result_content} dangerouslySetInnerHTML={{ __html: goldenSentenceExtract.content }}>

                                        </div>
                                    </div>
                                    <div className={styles.golden_sentence_result_button}>
                                        <Button onClick={() => {
                                            setGoldenSentenceExtract((prve: any) => ({
                                                ...prve,
                                                extractShow: false,
                                                extractLoadding: true
                                            }))
                                        }}>上一步</Button>
                                        <Button onClick={() => {
                                            isThemeData(goldenSentenceExtract.article)
                                        }} type="primary" >插入编辑器</Button>
                                    </div>
                                </div>
                            }
                        </>

                }
            </>,
        },
    ];

    return (
        <div className={styles.golden_sentence_body}>
            <Tabs
                onChange={handleTab}
                defaultActiveKey="1"
                centered
                items={items}
                animated
            />

        </div>
    )
}

export default GoldenSentence
// 素材组件
function Material({ getMaterial }: any) {
    const [messageApi, contextHolder] = message.useMessage();
    let [iconShow, setIconShow] = useState(-1)
    // 分类的数据
    const [classData, setClassData] = useState([])
    let [classIndex, setClassIndex] = useState(-1)
    // 类别的数据
    let [classLevel, setClassLevel] = useState([])
    let [classLevelIndex, setClassLevelIndex] = useState(-1)
    // 是否显示下一级
    let [classShow, setClassShow] = useState(false)
    // 内容区的数据
    let [classContext, setClassContext] = useState([])
    // 当前的id
    let [currId, setCurrId] = useState('')
    // 搜索框的值
    let [searchValue, setSearchValue] = useState('')
    // 总条数
    let [totality, setTotality] = useState(0)
    //当前页
    let [currPage, setCurrPage] = useState(1)
    // 每页多少条数据
    let [pageSizes, setPageSizes] = useState(30)
    // 默认当前页
    let [pages, setPages] = useState(1)
    // 显示空状态
    let [empty, setEmpty] = useState(false)
    const targetRef: any = useRef(null)
    useEffect(() => {
        getAllMaterial().then((res) => {
            if (res.data.status.code === 200) {
                setClassData(res.data.data);
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        })
        handleAll()
    }, [])
    // 切换类别
    let handleClassChildren = (item: any, index: number) => {
        setCurrId(item.category_id)
        setClassShow(true)
        setClassIndex(index)
        setClassLevelIndex(0)
        setPages(1)
        setCurrPage(1)
        setEmpty(false)
        getSearchClass({ category_id: item.category_id, limit: pageSizes, page: pages }).then((res) => {
            if (res.data.status.code === 200) {
                setClassLevel(res.data.data[0].children)
                setCurrId(res.data.data[0].children[0].CategoryID)
                getSearchFilter({ category_id: res.data.data[0].children[0].CategoryID, limit: pageSizes, page: pages }).then((res) => {
                    if (res.data.status.code === 200) {
                        setClassContext(res.data.records)
                        setTotality(res.data.total)

                    }
                }).catch((error) => {
                    message.error(error)
                })
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        })
    }
    // 切换分类
    let handleClassLevel = (item: any, index: number) => {
        setEmpty(false)
        setClassLevelIndex(index)

        setPages(1)
        setCurrPage(1)
        getSearchFilter({ category_id: item.CategoryID, limit: pageSizes, page: pages }).then((res) => {
            console.log(res);
            setCurrId(item.CategoryID)
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        })
    }
    // 全部
    let handleAll = () => {
        setEmpty(false)
        setClassIndex(-1)
        setPages(1)
        setCurrPage(1)
        setClassShow(false)
        getSearchFilter({ limit: pageSizes, page: pages, }).then((res) => {
            // console.log(res.data, '所有数据');
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }

        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        })
    }
    // 分页
    let handlePage = (page: any, pageSize: any) => {
        setPageSizes(pageSize)
        setCurrPage(page)
        // setCurrId('')
        getSearchFilter({ limit: pageSize, page: page, category_id: classIndex === -1 ? '' : currId, }).then((res) => {
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        })

    }
    // 键盘事件
    let handleKeyDown = (event: any) => {
        handleSearch()
    }
    // 点击搜索
    let handleSearch = () => {
        setPages(1)
        setEmpty(false)
        getSearchFilter({ search_title: searchValue, limit: pageSizes, page: pages }).then((res) => {
            console.log(res);
            if (res.data.status.code === 200) {
                setClassContext(res.data.records)
                setTotality(res.data.total)
                setSearchValue('')
                if (res.data.total === 0) {
                    setEmpty(true)
                    setTotality(0)
                }
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        })
    }
    // 点击素材
    let handleContext = (item: any) => {
        getMaterial(item)
    }
    return (
        <div className={styles.MaterialStyle}>
            <div className={styles.MaterialStyle_form}>
                <input type="text" placeholder='按关键词搜索素材' value={searchValue} onChange={(e) => {
                    setSearchValue(e.target.value)
                }} onKeyDown={handleKeyDown} />
                {
                    !searchValue ? <Tooltip placement="top" title={'请输入内容'}>
                        <img ref={targetRef} width={50} height={30} src={Send} alt='' style={{ width: '1.5vw', height: '1.5vw' }} />
                    </Tooltip> : <img width={50} height={30} src={Sends} alt='' style={{ width: '1.5vw', height: '1.5vw' }} onClick={handleSearch} />
                }
            </div>
            <div className={styles.MaterialStyle_type}>
                <div>类别：
                    <span onClick={handleAll} className={classIndex === -1 ? styles.search_class_list_item_active : styles.search_class_list_item}>全部</span>
                    {
                        classData.map((item: any, index) => {
                            return <span className={classIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassChildren(item, index) }}>{item.name}</span>
                        })
                    }
                </div>
                {
                    classShow ?
                        <div className={styles.search_class_level}>
                            分类：{
                                classLevel.map((item: any, index) => {
                                    return <span className={classLevelIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassLevel(item, index) }}>{item.name}</span>
                                })
                            }
                        </div> : ''
                }
                <div className={styles.MaterialStyle_content}>
                    {
                        !empty ? classContext.map((item: any, index: number) => {
                            return <div key={index} className={styles.search_content_item} onMouseEnter={() => {
                                setIconShow(index)
                            }} onMouseLeave={() => {
                                setIconShow(-1)
                            }}
                                onClick={() => { handleContext(item) }}
                            // onClick={() => { handleContent(item, index) }}
                            >
                                {/* <div className={styles.search_content_item_title}>{item.content}</div> */}
                                <div className={styles.search_content_item_text}>{item.content}</div>


                            </div>
                        }) : <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5vw 0' }}><Empty description={'暂无数据'} />
                        </div>
                    }
                </div>

            </div>
            <div className={styles.search_pagination}>
                <ConfigProvider locale={zhCN}>
                    <Pagination
                        align={'center'}
                        size="small"
                        total={totality}
                        showSizeChanger
                        // showQuickJumper
                        current={currPage}
                        pageSize={pageSizes}
                        defaultCurrent={pages}
                        // showTotal={(total) => `共 ${total} 条`}
                        onChange={handlePage}
                    />  </ConfigProvider></div>
        </div>
    )
}

