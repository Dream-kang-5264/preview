// import { getTempletChildren, getTempletData } from '@/api/Templet';
// import { getTempletType } from '@/api/written';
// import { getAllMaterial, getAllUploadMaterial, getSearchClass, getSearchFilter } from '@/api/search';
// import { CloseOutlined, DownOutlined, FolderOpenOutlined } from '@ant-design/icons'
// import { Button, Cascader, CascaderProps, Col, DatePicker, DatePickerProps, Drawer, Dropdown, Form, FormProps, Input, MenuProps, Radio, RadioChangeEvent, Row, message, Pagination, Tooltip, ConfigProvider, Empty, Table, TableColumnsType, Select, Tabs, Modal, Space } from 'antd'
// import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react'
// import styles from './index.less'
// import TextArea from 'antd/es/input/TextArea';
// import Send from '../../../../../public/send.svg'
// import Sends from '../../../../../public/send2.svg'
// import { TableRowSelection } from 'antd/es/table/interface';
// import UserMaterials from './UserMaterial'
// import UserMaterial from './UserMaterial';
// import ModelEssay from './ModelEssay';
// import TabPane from 'antd/es/tabs/TabPane';
// const zhCN = require('antd/lib/locale/zh_CN').default;
// interface DataType {
//     key: React.Key;
//     name: string;
//     address: string;
//     uploadTime: string;
//     type?: string;
//     size?: number | string; // 文件大小
//     url?: string;
//     text_content?: string;
//     title?: string;
// }
// interface Option {
//     value: string;
//     label: string;
//     children?: Option[];
//     id?: string
// }
// type FieldType = {
//     sceneTitle?: string;
//     sceneTextarea?: string;
//     sceneDate?: string;
//     sceneSelect?: any;
// }
// let Theme = forwardRef((props: any, ref: any) => {
//     let { sendServer, setSendServer, sceneTitle, sceneChildren, handleChange, currTaps } = props
//     const [form] = Form.useForm();
//     const [messageApi, contextHolder] = message.useMessage();
//     const [open, setOpen] = useState(false);
//     // 选则素材
//     let [userMaterialModalOpen, setUserMaterialModalOpen] = useState(false);
//     let [userSelectId, setUserSelectId] = useState([]);
//     let [selectMaterial, setSelectMaterial] = useState(false);
//     // 选则范文
//     let [modelEssayOpen, setModelEssayOpen] = useState(false)
//     let [modelEssayId, setModelEssayId] = useState([])
//     let [selectModelEssay, setSelectModelEssay] = useState(false)
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [tempLargeTexts, setTempLargeTexts] = useState({});
//     let [largeTextFields, setLargeTextFields] = useState([])
//     const [formData, setFormData] = useState({});

//     useEffect(() => {
//         if (!sendServer) {
//             getTempletData().then((res) => {
//                 setSendServer((prev: any) => ({
//                     ...prev,
//                     options: res.data.data,
//                     homeOptions: res.data.data.filter((item: any) => item.name === '通用'),

//                 }))
//                 let home = res.data.data.filter((item: any) => item.name === '通用')

//                 getTempletType({ template_id: home[0].category_id }).then((res) => {
//                     setSendServer((prev: any) => ({
//                         ...prev,
//                         fields: res.data.fields,
//                     }))

//                 }).catch((error) => {

//                 })
//             }).catch((error) => {

//             })

//         }

//         if (sceneTitle && sceneChildren) {
//             getTempletChildren({ category_id: sceneTitle.category_id }).then((res) => {
//                 setSendServer((prev: any) => ({
//                     ...prev,
//                     optionChildren: res.data.records.filter((item: any) => item.applicable_types !== 4),
//                 }));

//                 getTempletType({ template_id: sceneChildren.id }).then((res) => {
//                     // console.log(sceneChildren, 'optionChildrenValue');
//                     setSendServer((prev: any) => ({
//                         ...prev,
//                         optionsValue: sceneTitle.name,
//                         optionChildrenValue: sceneChildren.title,
//                         fields: res.data.fields,
//                         scene: sceneChildren.id
//                     }));
//                     if (res.data.type === 1) {
//                         setTimeout(() => {
//                             handleChange('2', true,)
//                         }, 200)
//                     }
//                     else if (res.data.type === 2) {
//                         // setTimeout(() => {
//                         handleChange('1', false,)
//                         // }, 200)
//                     }
//                     else if (res.data.type === 3) {
//                         handleChange('1', false,)
//                     }
//                 }).catch((error) => {

//                 })

//             }).catch((error) => {

//             })



//         }


//         return () => {
//             // console.log('unmount');

//         }

//     }, [])
//     useEffect(() => {
//         if (sendServer?.fields) {

//             setLargeTextFields(sendServer?.fields.filter(field => field.field_type === 'large_text'))
//         }
//     }, [sendServer])
//     const items: MenuProps['items'] = sendServer.optionChildren?.map((item: any, index: number) => {
//         return {
//             key: index,
//             type: item.type,
//             value: item.title,
//             label: <div onClick={() => { onChangeChildren(item) }}>{item.title}</div>,
//             id: item.id
//         };
//     }) || []

//     const options: Option[] = sendServer.options?.map((item: any, index: number) => {
//         return {
//             key: index,
//             value: item.name,
//             label: item.name,
//             id: item.category_id,
//             type: item.type,
//         };
//     }) || []; // 如果 themeData.options 为 undefined，则返回一个空数组

//     const menu = {
//         items: sendServer.options.map((item: any, index: any) => ({
//             key: index,
//             value: item.name,
//             label: <div onClick={() => { onChangeScene(item) }}>{item.name}</div>,
//             id: item.category_id,
//             type: item.type,
//         })),
//     };

//     const onChangeScene: CascaderProps<Option>['onChange'] = (item: any,) => {
//         // console.log( item);

//         getTempletChildren({ category_id: item.category_id }).then((res) => {
//             setSendServer((prev: any) => ({
//                 ...prev,
//                 optionsValue: item.name,
//                 optionChildren: res.data.records.filter((item: any) => item.applicable_types !== 4),
//                 scene: item.category_id,
//                 optionChildrenValue: ''
//             }))
//             getTempletType({ template_id: item.id }).then((res) => {
//                 setSendServer((prev: any) => ({
//                     ...prev,
//                     fields: res.data.fields,
//                 }))

//             }).catch((error) => {

//             })
//         }).catch((error) => {

//         })

//     };
//     let onChangeChildren = (item: any) => {

//         setSendServer((prev: any) => ({
//             ...prev,
//             optionChildrenValue: item.title,
//             scene: item.id,
//         }))
//         getTempletType({ template_id: item.id }).then((res) => {
//             setSendServer((prev: any) => ({
//                 ...prev,
//                 fields: res.data.fields,
//             }))
//             if (res.data.type === 1) {
//                 // setTimeout(() => {
//                 handleChange('2', true,)
//                 // }, 200)
//             }
//             else if (res.data.type === 2) {
//                 // setTimeout(() => {
//                 handleChange('1', false,)
//                 // }, 200)
//             }
//             else if (res.data.type === 3) {
//                 handleChange('1', false,)
//             }
//         }).catch((error) => {

//         })

//     }
//     const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

//         console.log('Success:', values);

//     };
//     const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//         message.warning('请输入必填项')
//         console.log('Failed:', errorInfo);
//     };
//     // 日期选择器
//     const onChange: DatePickerProps['onChange'] = (date, dateString) => {
//         console.log(date, dateString);

//         setSendServer((prev: any) => ({
//             ...prev,
//             time: date,
//             timeString: dateString
//         }));

//     };
//     // 接受素材
//     let getMaterial = (data: any) => {
//         setOpen(false);
//         setSelectMaterial(true)
//         setSendServer((prev: any) => ({
//             ...prev,
//             material: data.content
//         }))
//     }

//     //   类型选择
//     const handleType: CascaderProps<Option>['onChange'] = (value: any, item: any,) => {
//         // console.log(value, 'value');
//     };
//     const placementChange = (e: RadioChangeEvent) => {
//         setSendServer((prev: any) => ({
//             ...prev,
//             article_number: e.target.value
//         }));
//     };
//     // 选择风格
//     let styleChange = (e: RadioChangeEvent) => {
//         // SetstyleData(e.target.value);
//         setSendServer((prev: any) => ({
//             ...prev,
//             style: e.target.value
//         }));

//     };
//     // 表单验证
//     useImperativeHandle(ref, () => ({
//         validateFields: () => form.validateFields(),
//     }));
//     // 选择素材
//     const showDrawer = (event: any) => {
//         event.preventDefault();
//         if (currTaps === '1') {
//             setOpen(true);
//         }
//         else if (currTaps === '2') {
//             setUserMaterialModalOpen(true);
//         }

//     };

//     // 素材组件
//     function Material({ getMaterial }: any) {
//         let [iconShow, setIconShow] = useState(-1)
//         // 分类的数据
//         const [classData, setClassData] = useState([])
//         let [classIndex, setClassIndex] = useState(-1)
//         // 类别的数据
//         let [classLevel, setClassLevel] = useState([])
//         let [classLevelIndex, setClassLevelIndex] = useState(-1)
//         // 是否显示下一级
//         let [classShow, setClassShow] = useState(false)
//         // 内容区的数据
//         let [classContext, setClassContext] = useState([])
//         // 当前的id
//         let [currId, setCurrId] = useState('')
//         // 搜索框的值
//         let [searchValue, setSearchValue] = useState('')
//         // 总条数
//         let [totality, setTotality] = useState(0)
//         //当前页
//         let [currPage, setCurrPage] = useState(1)
//         // 每页多少条数据
//         let [pageSizes, setPageSizes] = useState(30)
//         // 默认当前页
//         let [pages, setPages] = useState(1)
//         // 显示空状态
//         let [empty, setEmpty] = useState(false)
//         const targetRef: any = useRef(null)
//         useEffect(() => {
//             getAllMaterial().then((res) => {
//                 if (res.data.status.code === 200) {
//                     setClassData(res.data.data);
//                 }
//             }).catch((error) => {
//                 messageApi.open({
//                     type: 'error',
//                     content: error.response.data.message,
//                 });
//             })
//             handleAll()
//         }, [])
//         // 切换类别
//         let handleClassChildren = (item: any, index: number) => {
//             setCurrId(item.category_id)
//             setClassShow(true)
//             setClassIndex(index)
//             setClassLevelIndex(0)
//             setPages(1)
//             setCurrPage(1)
//             setEmpty(false)
//             getSearchClass({ category_id: item.category_id, limit: pageSizes, page: pages }).then((res) => {
//                 if (res.data.status.code === 200) {
//                     setClassLevel(res.data.data[0].children)
//                     setCurrId(res.data.data[0].children[0].CategoryID)
//                     getSearchFilter({ category_id: res.data.data[0].children[0].CategoryID, limit: pageSizes, page: pages }).then((res) => {
//                         if (res.data.status.code === 200) {
//                             setClassContext(res.data.records)
//                             setTotality(res.data.total)

//                         }
//                     })
//                 }
//             }).catch((error) => {
//                 messageApi.open({
//                     type: 'error',
//                     content: error.response.data.message,
//                 });
//             })
//         }
//         // 切换分类
//         let handleClassLevel = (item: any, index: number) => {
//             setEmpty(false)
//             setClassLevelIndex(index)

//             setPages(1)
//             setCurrPage(1)
//             getSearchFilter({ category_id: item.CategoryID, limit: pageSizes, page: pages }).then((res) => {
//                 // console.log(res);
//                 setCurrId(item.CategoryID)
//                 if (res.data.status.code === 200) {
//                     setClassContext(res.data.records)
//                     setTotality(res.data.total)
//                 }
//             }).catch((error) => {
//                 messageApi.open({
//                     type: 'error',
//                     content: error.response.data.message,
//                 });
//             })
//         }
//         // 全部
//         let handleAll = () => {
//             setEmpty(false)
//             setClassIndex(-1)
//             setPages(1)
//             setCurrPage(1)
//             setClassShow(false)
//             getSearchFilter({ limit: pageSizes, page: pages, }).then((res) => {
//                 // console.log(res.data, '所有数据');
//                 if (res.data.status.code === 200) {
//                     setClassContext(res.data.records)
//                     setTotality(res.data.total)
//                 }

//             }).catch((error) => {
//                 messageApi.open({
//                     type: 'error',
//                     content: error.response.data.message,
//                 });
//             })
//         }
//         // 分页
//         let handlePage = (page: any, pageSize: any) => {
//             setPageSizes(pageSize)
//             setCurrPage(page)
//             // setCurrId('')
//             getSearchFilter({ limit: pageSize, page: page, category_id: classIndex === -1 ? '' : currId, }).then((res) => {
//                 if (res.data.status.code === 200) {
//                     setClassContext(res.data.records)
//                     setTotality(res.data.total)
//                 }
//             }).catch((error) => {
//                 messageApi.open({
//                     type: 'error',
//                     content: error.response.data.message,
//                 });
//             })

//         }
//         // 键盘事件
//         let handleKeyDown = (event: any) => {
//             handleSearch()
//         }
//         // 点击搜索
//         let handleSearch = () => {
//             setPages(1)
//             setEmpty(false)
//             getSearchFilter({ search_title: searchValue, limit: pageSizes, page: pages }).then((res) => {
//                 // console.log(res);
//                 if (res.data.status.code === 200) {
//                     setClassContext(res.data.records)
//                     setTotality(res.data.total)
//                     setSearchValue('')
//                     if (res.data.total === 0) {
//                         setEmpty(true)
//                         setTotality(0)
//                     }
//                 }
//             }).catch((error) => {
//                 messageApi.open({
//                     type: 'error',
//                     content: error.response.data.message,
//                 });
//             })
//         }
//         // 点击素材
//         let handleContext = (item: any) => {
//             getMaterial(item)
//         }
//         return (
//             <div className={styles.MaterialStyle}>
//                 <div className={styles.MaterialStyle_form}>
//                     <input type="text" placeholder='按关键词搜索素材' value={searchValue} onChange={(e) => {
//                         setSearchValue(e.target.value)
//                     }} onKeyDown={handleKeyDown} />
//                     {
//                         !searchValue ? <Tooltip placement="top" title={'请输入内容'}>
//                             <img ref={targetRef} width={50} height={30} src={Send} alt='' style={{ width: '1.5vw', height: '1.5vw' }} />
//                         </Tooltip> : <img width={50} height={30} src={Sends} alt='' style={{ width: '1.5vw', height: '1.5vw' }} onClick={handleSearch} />
//                     }
//                 </div>
//                 <div className={styles.MaterialStyle_type}>
//                     <div>类别：
//                         <span onClick={handleAll} className={classIndex === -1 ? styles.search_class_list_item_active : styles.search_class_list_item}>全部</span>
//                         {
//                             classData.map((item: any, index) => {
//                                 return <span className={classIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassChildren(item, index) }}>{item.name}</span>
//                             })
//                         }
//                     </div>
//                     {
//                         classShow ?
//                             <div className={styles.search_class_level}>
//                                 分类：{
//                                     classLevel.map((item: any, index) => {
//                                         return <span className={classLevelIndex === index ? styles.search_class_list_item_active : styles.search_class_list_item} key={index} onClick={() => { handleClassLevel(item, index) }}>{item.name}</span>
//                                     })
//                                 }
//                             </div> : ''
//                     }
//                     <div className={styles.MaterialStyle_content}>
//                         {
//                             !empty ? classContext.map((item: any, index: number) => {
//                                 return <div key={index} className={styles.search_content_item} onMouseEnter={() => {
//                                     setIconShow(index)
//                                 }} onMouseLeave={() => {
//                                     setIconShow(-1)
//                                 }}
//                                     onClick={() => { handleContext(item) }}
//                                 // onClick={() => { handleContent(item, index) }}
//                                 >
//                                     {/* <div className={styles.search_content_item_title}>{item.content}</div> */}
//                                     <div className={styles.search_content_item_text}>{item.content}</div>


//                                 </div>
//                             }) : <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5vw 0' }}><Empty description={'暂无数据'} />
//                             </div>
//                         }
//                     </div>

//                 </div>
//                 <div className={styles.search_pagination}>
//                     <ConfigProvider locale={zhCN}>
//                         <Pagination
//                             align={'center'}
//                             size="small"
//                             total={totality}
//                             showSizeChanger
//                             // showQuickJumper
//                             current={currPage}
//                             pageSize={pageSizes}
//                             defaultCurrent={pages}
//                             // showTotal={(total) => `共 ${total} 条`}
//                             onChange={handlePage}
//                         />  </ConfigProvider></div>
//             </div>
//         )
//     }
//     // 个人素材
//     // 选中的id
//     let handleSendSelectId = (data: any) => {
//         // console.log(data);
//         setUserSelectId(data)
//     }
//     let handleSendSelectIds = (data: any) => {
//         setModelEssayId(data)
//     }
//     // 删除选中的素材
//     let handleDelMaterial = (item: any) => {
//         let arr = userSelectId.filter((i: any) => {
//             return i.key !== item.key
//         })
//         setUserSelectId(arr)
//         setSendServer((prev: any) => ({
//             ...prev,
//             material_id: prev.material_id.filter((i: any) => { return i !== item.key }),
//         }));
//         message.success('删除成功')
//     }
//     // 删除选中的范文
//     let handleDelModelEssay = (item: any) => {
//         let arr = modelEssayId.filter((i: any) => {
//             return i.key !== item.key
//         })
//         setSendServer((prev: any) => ({
//             ...prev,
//             material_id: prev.material_id.filter((i: any) => { return i !== item.key }),
//         }));
//         setModelEssayId(arr)
//         message.success('删除成功')
//     }

//     // 个人素材弹窗的确定按钮
//     let handleOk = () => {
//         setUserMaterialModalOpen(false);
//         setSelectMaterial(true)
//     }
//     // 个人素材弹窗的取消按钮
//     let handleCancel = () => {
//         setUserMaterialModalOpen(false);
//         setSelectMaterial(true)
//     }
//     let handleOks = () => {
//         setModelEssayOpen(false)
//         setSelectModelEssay(true)
//     }
//     let handleCancels = () => {
//         setModelEssayOpen(false)
//         setSelectModelEssay(true)
//     }
//     // 选则范文
//     let showModelEssay = () => {
//         setModelEssayOpen(true)
//     }
//     const showModal = () => {
//         const initialTempTexts: any = {};
//         largeTextFields.forEach((field: any) => {
//             initialTempTexts[field.field_name] = formData[field.field_name] || '';
//         });
//         setTempLargeTexts(initialTempTexts);
//         setIsModalVisible(true);
//     };
//     // console.log(tempLargeTexts, '@@@@');
//     const handleTempTextChange = (fieldName, value) => {

//         setTempLargeTexts(prevTexts => ({
//             ...prevTexts,
//             [fieldName]: value
//         }));

//     };
//     // 补充内容
//     let handleContentOk = () => {
//         // 检查必填项是否为空

//         setFormData(prevData => ({
//             ...prevData,
//             ...tempLargeTexts
//         }));
//         // console.log(formData);

//         setIsModalVisible(false);
//     }
//     let handleContentCancel = () => {
//         setIsModalVisible(false);
//     }
//     const validateTabsContent = (_, value, callback) => {
//         // console.log(tempLargeTexts);
//         if (Object.values(tempLargeTexts).every(text => text.trim() === '')) {
//             callback('请输入要素信息');
//         } else {
//             callback();
//         }
//     };

//     return (
//         <div className={styles.theme}>
//             <Row>
//                 <Col span={24} style={{ marginBottom: '5px', paddingTop: '10px' }}>写作场景</Col>
//             </Row>
//             <Row >
//                 <Col span={12}>


//                     <Dropdown menu={menu} trigger={['click']} >
//                         <Button style={{ fontSize: '14px' }}>
//                             {sendServer.optionsValue ? sendServer.optionsValue : sendServer.homeOptions ? sendServer.homeOptions[0].name : sendServer.optionsValue} <DownOutlined style={{ marginLeft: '1vw' }} />
//                         </Button>
//                     </Dropdown>


//                 </Col>
//                 <Col span={0}></Col>
//                 <Col span={12}>
//                     <Dropdown menu={{ items }} trigger={['click']} >
//                         <Button style={{ fontSize: '14px' }}>
//                             {sendServer.optionChildrenValue ? sendServer.optionChildrenValue : '请选择'} <DownOutlined style={{ marginLeft: '1vw' }} />
//                         </Button>
//                     </Dropdown>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24}>

//                     <Form
//                         form={form}
//                         name="basic"
//                         labelCol={{ span: 2 }}
//                         wrapperCol={{ span: 24 }}
//                         style={{ maxWidth: 600, }}
//                         initialValues={sendServer.froms}
//                         onFinish={onFinish}
//                         onFinishFailed={onFinishFailed}
//                         autoComplete="off"

//                     >

//                         {
//                             sendServer.fields?.map((item: any, index: number) => {
//                                 switch (item.field_type) {
//                                     case 'text':
//                                         return <div key={index}>
//                                             <div style={{ marginTop: '20px', paddingBottom: '5px', }}>{item.field_name}</div>
//                                             <Form.Item<FieldType>
//                                                 label=""
//                                                 name={item.field_order}
//                                                 rules={[{ required: item.is_required, message: `请输入${item.field_name}` }]}
//                                             >
//                                                 <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder={`请输入${item.field_name}`} />
//                                             </Form.Item>
//                                         </div>
//                                         break;
//                                     case 'textarea':
//                                         return <div key={index}>
//                                             <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
//                                             <Form.Item<FieldType>
//                                                 label=""
//                                                 name={item.field_order}
//                                                 rules={[{ required: item.is_required, message: `请输入${item.field_name}` }]}
//                                             >
//                                                 <TextArea placeholder={`请输入${item.field_name}`} />
//                                             </Form.Item>
//                                         </div>
//                                         break;
//                                     case 'date':

//                                         return <div key={index}>
//                                             <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
//                                             <Form.Item<FieldType>
//                                                 // label="Username"
//                                                 name={item.field_order}
//                                                 style={{ maxWidth: 200 }}
//                                                 rules={[{ required: item.is_required, message: `请选择${item.field_name}` }]}
//                                             >


//                                                 <DatePicker onChange={onChange} />

//                                             </Form.Item>
//                                         </div>
//                                         break;
//                                     case 'select':
//                                         // let optionsType = {
//                                         //     items: item.options.map((items: any, index: any) => ({
//                                         //         key: index,
//                                         //         value: items,
//                                         //         label: <div onClick={() => {
//                                         //             setSendServer((prev: any) => ({
//                                         //                 ...prev,
//                                         //                 formType: items
//                                         //             }))
//                                         //         }}>{items}</div>,

//                                         //     })),

//                                         // }
//                                         const optionsType: any = item.options?.map((item: any, index: number) => {
//                                             return {
//                                                 key: index,
//                                                 value: item,
//                                                 label: item,
//                                                 id: item.id
//                                             };
//                                         })

//                                         return <div key={index}>
//                                             <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
//                                             <Form.Item<FieldType>
//                                                 // label="Username"
//                                                 name={item.field_order}
//                                                 style={{ maxWidth: 150 }}
//                                                 rules={[{ required: item.is_required, message: `请选择${item.field_name}` }]}
//                                             >


//                                                 <Select options={optionsType} placeholder="请选择" style={{ width: '100%' }} />

//                                             </Form.Item>
//                                         </div>
//                                         break;
//                                     default:
//                                         break;


//                                 }

//                             })

//                         }

//                         {largeTextFields.length > 0 && (
//                             <>
//                                 <div style={{ marginBottom: '5px' }}>要素信息</div>
//                                 {/* <Form.Item
//                                     // label="补充内容"
//                                     style={{ maxWidth: 200 }}
//                                     rules={[{ message: `请输入要素信息` }]}
//                                 >
//                                     <Button
//                                         onClick={showModal}
//                                     >
//                                         {Object.values(tempLargeTexts).some(text => text.length > 0)
//                                             ? "点击查看或编辑补充内容"
//                                             : "点击添加要素信息"}
//                                     </Button>
//                                     <Modal
//                                         title="要素信息"
//                                         visible={isModalVisible}
//                                         onOk={handleContentOk}
//                                         onCancel={handleContentCancel}
//                                         width={800}
//                                         bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
//                                     >
//                                         <Tabs defaultActiveKey={largeTextFields[0]?.field_name}>
//                                             {largeTextFields.map((field: any) => (
//                                                 <TabPane tab={field.field_name} key={field.field_name}>
//                                                     <Form.Item
//                                                         name={field.field_order}
//                                                         rules={[{ required: field.is_required, message: `请输入${field.field_name}` }]}
//                                                     >
//                                                         <TextArea
//                                                             rows={10}
//                                                             // value={tempLargeTexts[field.field_name]}
//                                                             onChange={(e) => handleTempTextChange(field.field_name, e.target.value)}
//                                                             placeholder={`请输入${field.field_name}`}
//                                                         />
//                                                     </Form.Item>
//                                                 </TabPane>
//                                             ))}
//                                         </Tabs>
//                                     </Modal>
//                                 </Form.Item> */}

//                                 <Form.Item
//                                     name="elementInfo"
//                                     rules={[
//                                         { validator: validateTabsContent }
//                                     ]}
//                                     // rules={[{ required: true, message: '请输入要素信息' }]}
//                                     style={{ maxWidth: 200 }}
//                                 >
//                                     <Button onClick={showModal}>
//                                         {Object.values(tempLargeTexts).some(text => text.length > 0)
//                                             ? "点击查看或编辑补充内容"
//                                             : "点击添加要素信息"}
//                                     </Button>
//                                     <Modal
//                                         title="要素信息"
//                                         visible={isModalVisible}
//                                         onOk={handleContentOk}
//                                         onCancel={handleContentCancel}
//                                         width={800}
//                                         bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
//                                     >
//                                         <Tabs defaultActiveKey={largeTextFields[0]?.field_name}>
//                                             {largeTextFields.map((field: any) => (
//                                                 <TabPane tab={field.field_name} key={field.field_name}>
//                                                     <Form.Item
//                                                         name={field.field_order}
//                                                         rules={[{ required: field.is_required, message: `请输入${field.field_name}` }]}
//                                                     >
//                                                         <TextArea
//                                                             rows={10}
//                                                             value={tempLargeTexts[field.field_name] || ''}
//                                                             onChange={(e) => handleTempTextChange(field.field_name, e.target.value)}
//                                                             placeholder={`请输入${field.field_name}`}
//                                                         />
//                                                     </Form.Item>
//                                                 </TabPane>
//                                             ))}
//                                         </Tabs>
//                                     </Modal>
//                                 </Form.Item>
//                             </>
//                         )}
//                     </Form>


//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24} style={{ marginBottom: '5px' }}>
//                     文章字数
//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24}>
//                     <Radio.Group value={sendServer.article_number} onChange={placementChange} className={styles.writtenTool_body_Numberof}>
//                         <Radio.Button value="500">500字</Radio.Button>
//                         <Radio.Button value="1000">1000字</Radio.Button>
//                         <Radio.Button value="3000">3000字</Radio.Button>
//                         <Radio.Button value="5000">5000字</Radio.Button>
//                         <Radio.Button value="8000">8000字</Radio.Button>
//                     </Radio.Group>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24} style={{ paddingTop: '20px', marginBottom: '5px' }}>
//                     风格选择
//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24}>
//                     <Radio.Group value={sendServer.style} onChange={styleChange} className={styles.writtenTool_body_Numberof}>
//                         <Radio.Button value="专业严谨">专业严谨</Radio.Button>
//                         <Radio.Button value="轻松幽默">轻松幽默</Radio.Button>
//                         <Radio.Button value="通俗平实">通俗平实</Radio.Button>
//                         <Radio.Button value="文采绚丽">文采绚丽</Radio.Button>
//                     </Radio.Group>

//                 </Col>
//             </Row>

//             {
//                 sendServer.optionsValue === '法定公文' ? '' : <>

//                     <div style={{ paddingTop: '20px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
//                         <div>引用素材</div>
//                         {
//                             selectMaterial ? <div style={{ color: '#1677FF', cursor: 'pointer' }}
//                                 onClick={() => {
//                                     if (currTaps === '1') {
//                                         setOpen(true);
//                                     }
//                                     else if (currTaps === '2') {
//                                         setUserMaterialModalOpen(true);
//                                     }
//                                 }}
//                             ><FolderOpenOutlined />选择更多</div> : ''
//                         }

//                     </div>


//                     {
//                         !selectMaterial || userSelectId.length < 0 ? <div className={styles.writtenTool_body_Material} onClick={showDrawer}>
//                             <FolderOpenOutlined style={{ marginRight: '10px' }} /> 选择素材
//                         </div> : <>

//                             {
//                                 currTaps === '1' ? <div className={styles.textMaterial}>{sendServer.material}</div> :
//                                     <div>
//                                         {
//                                             selectMaterial ? userSelectId.map((item: any, index: number) => {
//                                                 return <div key={item.key} className={styles.meterial_list_item}>
//                                                     <div className={styles.meterial_list_item_img}>
//                                                         <img src={item.url} alt='' />
//                                                     </div>
//                                                     <div className={styles.meterial_list_item_text}>
//                                                         <div className={styles.meterial_list_item_text_title}>{item.title}</div>
//                                                         <div className={styles.meterial_list_item_text_size}>{item.size}</div>
//                                                     </div>
//                                                     <div className={styles.meterial_list_item_text_del} onClick={() => { handleDelMaterial(item) }}>
//                                                         <CloseOutlined />
//                                                     </div>
//                                                 </div>
//                                             }) : ''
//                                         }
//                                     </div>
//                             }

//                         </>
//                     }
//                     <div style={{ paddingTop: '20px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
//                         <div>引用范文</div>
//                         {
//                             selectModelEssay ? <div style={{ color: '#1677FF', cursor: 'pointer' }}
//                                 onClick={() => {
//                                     setModelEssayOpen(true)
//                                 }}
//                             ><FolderOpenOutlined />选择更多</div> : ''
//                         }

//                     </div>
//                     {
//                         !selectModelEssay ? <div className={styles.writtenTool_body_Material} onClick={showModelEssay}>
//                             <FolderOpenOutlined style={{ marginRight: '10px' }} /> 选择范文
//                         </div> : <>

//                             {
//                                 currTaps === '1' ? <div className={styles.ModelEssay}>
//                                     {
//                                         selectModelEssay ? modelEssayId.map((item: any, index: number) => {
//                                             return <div key={item.key} className={styles.meterial_list_item}>
//                                                 <div className={styles.meterial_list_item_img}>
//                                                     <img src={item.url} alt='' />
//                                                 </div>
//                                                 <div className={styles.meterial_list_item_text}>
//                                                     <div className={styles.meterial_list_item_text_title}>{item.title}</div>
//                                                     <div className={styles.meterial_list_item_text_size}>{item.size}</div>
//                                                 </div>
//                                                 <div className={styles.meterial_list_item_text_del} onClick={() => { handleDelModelEssay(item) }}>
//                                                     <CloseOutlined />
//                                                 </div>
//                                             </div>
//                                         }) : ''
//                                     }
//                                 </div> :
//                                     <div>
//                                         {
//                                             selectModelEssay ? modelEssayId.map((item: any, index: number) => {
//                                                 return <div key={item.key} className={styles.meterial_list_item}>
//                                                     <div className={styles.meterial_list_item_img}>
//                                                         <img src={item.url} alt='' />
//                                                     </div>
//                                                     <div className={styles.meterial_list_item_text}>
//                                                         <div className={styles.meterial_list_item_text_title}>{item.title}</div>
//                                                         <div className={styles.meterial_list_item_text_size}>{item.size}</div>
//                                                     </div>
//                                                     <div className={styles.meterial_list_item_text_del} onClick={() => { handleDelModelEssay(item) }}>
//                                                         <CloseOutlined />
//                                                     </div>
//                                                 </div>
//                                             }) : ''
//                                         }
//                                     </div>
//                             }
//                         </>
//                     }
//                 </>
//             }
//             {contextHolder}
//             <Drawer
//                 rootStyle={{ width: '80%', position: 'absolute', right: '0' }}
//                 placement="right"
//                 closable={false}
//                 onClose={() => { setOpen(false) }}
//                 open={open}
//                 getContainer={false}
//             >
//                 <Material getMaterial={getMaterial} ></Material>
//             </Drawer>
//             {/* 个人素材列表 */}
//             <Modal title="选择素材" open={userMaterialModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} >
//                 <UserMaterials sendSelectId={handleSendSelectId} setSendServer={setSendServer} />
//             </Modal>
//             <Modal title="选择范文" open={modelEssayOpen} onOk={handleOks} onCancel={handleCancels} width={1000} >
//                 <ModelEssay sendSelectIds={handleSendSelectIds} setSendServer={setSendServer} />
//             </Modal>
//         </div >
//     )
// }
// )
// Theme.displayName = 'Theme'
// export default Theme



import { getTempletChildren, getTempletData } from '@/api/Templet';
import { getTempletType } from '@/api/written';
import { getAllMaterial, getAllUploadMaterial, getSearchClass, getSearchFilter } from '@/api/search';
import { CloseOutlined, DownOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Button, Cascader, CascaderProps, Col, DatePicker, DatePickerProps, Drawer, Dropdown, Form, FormProps, Input, MenuProps, Radio, RadioChangeEvent, Row, message, Pagination, Tooltip, ConfigProvider, Empty, Table, TableColumnsType, Select, Tabs, Modal, Space } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react'
import styles from './index.less'
import TextArea from 'antd/es/input/TextArea';
import Send from '../../../../../public/send.svg'
import Sends from '../../../../../public/send2.svg'
import { TableRowSelection } from 'antd/es/table/interface';
import UserMaterials from './UserMaterial'
import UserMaterial from './UserMaterial';
import ModelEssay from './ModelEssay';
import TabPane from 'antd/es/tabs/TabPane';
const zhCN = require('antd/lib/locale/zh_CN').default;
interface DataType {
    key: React.Key;
    name: string;
    address: string;
    uploadTime: string;
    type?: string;
    size?: number | string; // 文件大小
    url?: string;
    text_content?: string;
    title?: string;
}
interface Option {
    value: string;
    label: string;
    children?: Option[];
    id?: string
}
type FieldType = {
    sceneTitle?: string;
    sceneTextarea?: string;
    sceneDate?: string;
    sceneSelect?: any;
}
let Theme = forwardRef((props: any, ref: any) => {
    let { sendServer, setSendServer, sceneTitle, sceneChildren, handleChange, currTaps } = props
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    // 选则素材
    let [userMaterialModalOpen, setUserMaterialModalOpen] = useState(false);
    let [userSelectId, setUserSelectId] = useState([]);
    let [selectMaterial, setSelectMaterial] = useState(false);
    // 选则范文
    let [modelEssayOpen, setModelEssayOpen] = useState(false)
    let [modelEssayId, setModelEssayId] = useState([])
    let [selectModelEssay, setSelectModelEssay] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempLargeTexts, setTempLargeTexts] = useState<{ [key: string]: string }>({});
    let [largeTextFields, setLargeTextFields] = useState([])


    useEffect(() => {
        if (!sendServer) {
            getTempletData().then((res) => {
                setSendServer((prev: any) => ({
                    ...prev,
                    options: res.data.data,
                    homeOptions: res.data.data.filter((item: any) => item.name === '通用'),

                }))
                let home = res.data.data.filter((item: any) => item.name === '通用')

                getTempletType({ template_id: home[0].category_id }).then((res) => {
                    setSendServer((prev: any) => ({
                        ...prev,
                        fields: res.data.fields,
                    }))

                }).catch((error) => {

                })
            }).catch((error) => {

            })

        }

        if (sceneTitle && sceneChildren) {
            getTempletChildren({ category_id: sceneTitle.category_id }).then((res) => {
                setSendServer((prev: any) => ({
                    ...prev,
                    optionChildren: res.data.records.filter((item: any) => item.applicable_types !== 4),
                }));

                getTempletType({ template_id: sceneChildren.id }).then((res) => {
                    // console.log(sceneChildren, 'optionChildrenValue');
                    setSendServer((prev: any) => ({
                        ...prev,
                        optionsValue: sceneTitle.name,
                        optionChildrenValue: sceneChildren.title,
                        fields: res.data.fields,
                        scene: sceneChildren.id
                    }));
                    if (res.data.type === 1) {
                        setTimeout(() => {
                            handleChange('2', true,)
                        }, 200)
                    }
                    else if (res.data.type === 2) {
                        // setTimeout(() => {
                        handleChange('1', false,)
                        // }, 200)
                    }
                    else if (res.data.type === 3) {
                        handleChange('1', false,)
                    }
                }).catch((error) => {

                })

            }).catch((error) => {

            })



        }
        if (sendServer.messageValue) {
            setTempLargeTexts((prev) => {
                // 创建一个新的对象，继承 prev 的所有属性
                const newState = { ...prev };

                // 遍历 messageValue 的所有键值对
                Object.keys(sendServer.messageValue).forEach(key => {
                    // 将每个键值对添加到 newState 中
                    newState[key] = sendServer.messageValue[key];
                });
                // console.log(newState);
                return newState;
            });
        }

        return () => {
            // console.log('unmount');

        }

    }, [])
    useEffect(() => {
        if (sendServer?.fields) {
            setLargeTextFields(sendServer?.fields.filter(field => field.field_type === 'large_text'))
        }
        // console.log(sendServer,'sendServer');

    }, [sendServer])
    const items: MenuProps['items'] = sendServer.optionChildren?.map((item: any, index: number) => {
        return {
            key: index,
            type: item.type,
            value: item.title,
            label: <div onClick={() => { onChangeChildren(item) }}>{item.title}</div>,
            id: item.id
        };
    }) || []

    const options: Option[] = sendServer.options?.map((item: any, index: number) => {
        return {
            key: index,
            value: item.name,
            label: item.name,
            id: item.category_id,
            type: item.type,
        };
    }) || []; // 如果 themeData.options 为 undefined，则返回一个空数组

    const menu = {
        items: sendServer.options.map((item: any, index: any) => ({
            key: index,
            value: item.name,
            label: <div onClick={() => { onChangeScene(item) }}>{item.name}</div>,
            id: item.category_id,
            type: item.type,
        })),
    };

    const onChangeScene: CascaderProps<Option>['onChange'] = (item: any,) => {
        // console.log( item);

        getTempletChildren({ category_id: item.category_id }).then((res) => {
            setSendServer((prev: any) => ({
                ...prev,
                optionsValue: item.name,
                optionChildren: res.data.records.filter((item: any) => item.applicable_types !== 4),
                scene: item.category_id,
                optionChildrenValue: ''
            }))
            getTempletType({ template_id: item.id }).then((res) => {
                setSendServer((prev: any) => ({
                    ...prev,
                    fields: res.data.fields,
                }))

            }).catch((error) => {

            })
        }).catch((error) => {

        })

    };
    let onChangeChildren = (item: any) => {

        setSendServer((prev: any) => ({
            ...prev,
            optionChildrenValue: item.title,
            scene: item.id,
        }))
        getTempletType({ template_id: item.id }).then((res) => {
            setSendServer((prev: any) => ({
                ...prev,
                fields: res.data.fields,
            }))
            if (res.data.type === 1) {
                // setTimeout(() => {
                handleChange('2', true,)
                // }, 200)
            }
            else if (res.data.type === 2) {
                // setTimeout(() => {
                handleChange('1', false,)
                // }, 200)
            }
            else if (res.data.type === 3) {
                handleChange('1', false,)
            }
        }).catch((error) => {

        })

    }
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

        console.log('Success:', values);

    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        message.warning('请输入必填项')
        console.log('Failed:', errorInfo);
    };
    // 日期选择器
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setSendServer((prev: any) => ({
            ...prev,
            time: date,
            timeString: dateString
        }));

    };
    // 接受素材
    let getMaterial = (data: any) => {
        setOpen(false);
        setSelectMaterial(true)
        setSendServer((prev: any) => ({
            ...prev,
            material: data.content
        }))
    }

    //   类型选择
    const handleType: CascaderProps<Option>['onChange'] = (value: any, item: any,) => {
        // console.log(value, 'value');
    };
    const placementChange = (e: RadioChangeEvent) => {
        setSendServer((prev: any) => ({
            ...prev,
            article_number: e.target.value
        }));
    };
    // 选择风格
    let styleChange = (e: RadioChangeEvent) => {
        // SetstyleData(e.target.value);
        setSendServer((prev: any) => ({
            ...prev,
            style: e.target.value
        }));

    };
    // 表单验证
    useImperativeHandle(ref, () => ({
        validateFields: () => form.validateFields(),
    }));
    // 选择素材
    const showDrawer = (event: any) => {
        event.preventDefault();
        if (currTaps === '1') {
            setOpen(true);
        }
        else if (currTaps === '2') {
            setUserMaterialModalOpen(true);
        }

    };

    // 素材组件
    function Material({ getMaterial }: any) {
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
                // console.log(res);
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
                // console.log(res);
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
    // 个人素材
    // 选中的id
    let handleSendSelectId = (data: any) => {
        // console.log(data);
        setUserSelectId(data)
    }
    let handleSendSelectIds = (data: any) => {
        setModelEssayId(data)
    }
    // 删除选中的素材
    let handleDelMaterial = (item: any) => {
        let arr = userSelectId.filter((i: any) => {
            return i.key !== item.key
        })
        setUserSelectId(arr)
        setSendServer((prev: any) => ({
            ...prev,
            material_id: prev.material_id.filter((i: any) => { return i !== item.key }),
        }));
        message.success('删除成功')
    }
    // 删除选中的范文
    let handleDelModelEssay = (item: any) => {
        let arr = modelEssayId.filter((i: any) => {
            return i.key !== item.key
        })
        setSendServer((prev: any) => ({
            ...prev,
            material_id: prev.material_id.filter((i: any) => { return i !== item.key }),
        }));
        setModelEssayId(arr)
        message.success('删除成功')
    }

    // 个人素材弹窗的确定按钮
    let handleOk = () => {
        setUserMaterialModalOpen(false);
        setSelectMaterial(true)
    }
    // 个人素材弹窗的取消按钮
    let handleCancel = () => {
        setUserMaterialModalOpen(false);
        setSelectMaterial(true)
    }
    let handleOks = () => {
        setModelEssayOpen(false)
        setSelectModelEssay(true)
    }
    let handleCancels = () => {
        setModelEssayOpen(false)
        setSelectModelEssay(true)
    }
    // 选则范文
    let showModelEssay = () => {
        setModelEssayOpen(true)
    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 补充内容
    let handleContentOk = () => {
        setSendServer((prev: any) => ({
            ...prev,
            messageValue: tempLargeTexts
        }))
        // form.setFieldsValue({ elementInfo: tempLargeTexts });
        setIsModalVisible(false);
    }
    let handleContentCancel = () => {
        setIsModalVisible(false);
    }

    const validateTabsContent = async (_, value, callback) => {
        console.log(sendServer);
   

        if (Object.keys(tempLargeTexts).length > 1) {
            // console.log(tempLargeTexts, '222')
            function areValuesNotEmpty(obj) {
                // 使用 Object.values() 获取对象的所有值
                return Object.values(obj).every(value => {
                    // 检查值是否不为空
                    return value !== undefined && value !== null && value !== '';
                });
            }
            const result = areValuesNotEmpty(tempLargeTexts);
            if (result) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('请填写所有要素信息'));
        }
        else {
            return Promise.reject(new Error('请填写所有要素信息'));
        }



    };

    let messageTab = largeTextFields.map((item: any, index: number) => ({
        key: item.field_order,
        label: item.field_name,
        children: <Form.Item
            name={item.field_order}
            noStyle // 隐藏默认样式，因为我们已经在 Tabs 里显示了
        >
            <TextArea
                rows={10}
                placeholder={`请输入${item.field_name}`}
                onChange={(e) => {
                    setTempLargeTexts((prev) => ({
                        ...prev,
                        [item.field_order]: e.target.value
                    }));
                }}
                value={tempLargeTexts[item.field_order]} // 绑定值
            />
        </Form.Item>
    }));

    return (
        <div className={styles.theme}>
            <Row>
                <Col span={24} style={{ marginBottom: '5px', paddingTop: '10px' }}>写作场景</Col>
            </Row>
            <Row >
                <Col span={12}>


                    <Dropdown menu={menu} trigger={['click']} >
                        <Button style={{ fontSize: '14px' }}>
                            {sendServer.optionsValue ? sendServer.optionsValue : sendServer.homeOptions ? sendServer.homeOptions[0].name : sendServer.optionsValue} <DownOutlined style={{ marginLeft: '1vw' }} />
                        </Button>
                    </Dropdown>


                </Col>
                <Col span={0}></Col>
                <Col span={12}>
                    <Dropdown menu={{ items }} trigger={['click']} >
                        <Button style={{ fontSize: '14px' }}>
                            {sendServer.optionChildrenValue ? sendServer.optionChildrenValue : '请选择'} <DownOutlined style={{ marginLeft: '1vw' }} />
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <Col span={24}>

                    {/* <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 24 }}
                        style={{ maxWidth: 600, }}
                        initialValues={sendServer.froms}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {
                            sendServer.fields?.map((item: any, index: number) => {
                                switch (item.field_type) {
                                    case 'text':
                                        return <div key={index}>
                                            <div style={{ marginTop: '20px', paddingBottom: '5px', }}>{item.field_name}</div>
                                            <Form.Item<FieldType>
                                                label=""
                                                name={item.field_order}
                                                rules={[{ required: item.is_required, message: `请输入${item.field_name}` }]}
                                            >
                                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder={`请输入${item.field_name}`} />
                                            </Form.Item>
                                        </div>
                                        break;
                                    case 'textarea':
                                        return <div key={index}>
                                            <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item<FieldType>
                                                label=""
                                                name={item.field_order}
                                                rules={[{ required: item.is_required, message: `请输入${item.field_name}` }]}
                                            >
                                                <TextArea placeholder={`请输入${item.field_name}`} />
                                            </Form.Item>
                                        </div>
                                        break;
                                    case 'date':

                                        return <div key={index}>
                                            <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item<FieldType>
                                                // label="Username"
                                                name={item.field_order}
                                                style={{ maxWidth: 200 }}
                                                rules={[{ required: item.is_required, message: `请选择${item.field_name}` }]}
                                            >


                                                <DatePicker onChange={onChange} />

                                            </Form.Item>
                                        </div>
                                        break;
                                    case 'select':

                                        const optionsType: any = item.options?.map((item: any, index: number) => {
                                            return {
                                                key: index,
                                                value: item,
                                                label: item,
                                                id: item.id
                                            };
                                        })

                                        return <div key={index}>
                                            <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item<FieldType>
                                                // label="Username"
                                                name={item.field_order}
                                                style={{ maxWidth: 150 }}
                                                rules={[{ required: item.is_required, message: `请选择${item.field_name}` }]}
                                            >


                                                <Select options={optionsType} placeholder="请选择" style={{ width: '100%' }} />

                                            </Form.Item>
                                        </div>
                                        break;
                                    default:
                                        break;


                                }

                            })

                        }

                        {largeTextFields.length > 0 && (
                            <>
                                <div style={{ marginBottom: '5px' }}>要素信息</div>
                                <Form.Item
                                    name="elementInfo"
                                    rules={[
                                        { validator: validateTabsContent }
                                    ]}
                                    // rules={[{ required: true, message: '请输入要素信息' }]}
                                    style={{ maxWidth: 200 }}
                                >
                                    <Button onClick={showModal}>
                                        {Object.values(tempLargeTexts).some(text => text.length > 0)
                                            ? "点击查看或编辑补充内容"
                                            : "点击添加要素信息"}
                                    </Button>
                                    <Modal
                                        title="要素信息"
                                        visible={isModalVisible}
                                        onOk={handleContentOk}
                                        onCancel={handleContentCancel}
                                        width={800}
                                        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
                                    >
                                        <Tabs items={messageTab}>

                                        </Tabs>
                                    </Modal>
                                </Form.Item>
                            </>
                        )}
                    </Form> */}
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 24 }}
                        style={{ maxWidth: 600 }}
                        initialValues={sendServer.froms}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {sendServer.fields?.map((item, index) => {
                            switch (item.field_type) {
                                case 'text':
                                    return (
                                        <div key={index}>
                                            <div style={{ marginTop: '20px', paddingBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item
                                                label=""
                                                name={item.field_order}
                                                rules={[{ required: item.is_required, message: `请输入${item.field_name}` }]}
                                            >
                                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder={`请输入${item.field_name}`} />
                                            </Form.Item>
                                        </div>
                                    );
                                case 'textarea':
                                    return (
                                        <div key={index}>
                                            <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item
                                                label=""
                                                name={item.field_order}
                                                rules={[{ required: item.is_required, message: `请输入${item.field_name}` }]}
                                            >
                                                <Input.TextArea placeholder={`请输入${item.field_name}`} />
                                            </Form.Item>
                                        </div>
                                    );
                                case 'date':
                                    return (
                                        <div key={index}>
                                            <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item
                                                name={item.field_order}
                                                style={{ maxWidth: 200 }}
                                                rules={[{ required: item.is_required, message: `请选择${item.field_name}` }]}
                                            >
                                                <DatePicker onChange={() => { }} />
                                            </Form.Item>
                                        </div>
                                    );
                                case 'select':
                                    const optionsType = item.options?.map((option, idx) => ({
                                        key: idx,
                                        value: option,
                                        label: option,
                                        id: option.id
                                    }));

                                    return (
                                        <div key={index}>
                                            <div style={{ marginBottom: '5px' }}>{item.field_name}</div>
                                            <Form.Item
                                                name={item.field_order}
                                                style={{ maxWidth: 150 }}
                                                rules={[{ required: item.is_required, message: `请选择${item.field_name}` }]}
                                            >
                                                <Select options={optionsType} placeholder="请选择" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}

                        {largeTextFields.length > 0 && (
                            <>
                                <div style={{ marginBottom: '5px' }}>要素信息</div>
                                <Form.Item
                                    name="elementInfo"
                                    rules={[{ validator: validateTabsContent }]}
                                    style={{ maxWidth: 200 }}
                                >
                                    <Button onClick={showModal}>
                                        点击查看或编辑补充内容
                                    </Button>
                                    <Modal
                                        title="要素信息"
                                        visible={isModalVisible}
                                        onOk={handleContentOk}
                                        onCancel={handleContentCancel}
                                        width={800}
                                        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
                                    >
                                        <Tabs items={messageTab} />
                                    </Modal>
                                </Form.Item>
                            </>
                        )}
                        {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item> */}
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ marginBottom: '5px' }}>
                    文章字数
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Radio.Group value={sendServer.article_number} onChange={placementChange} className={styles.writtenTool_body_Numberof}>
                        <Radio.Button value="500">500字</Radio.Button>
                        <Radio.Button value="1000">1000字</Radio.Button>
                        <Radio.Button value="3000">3000字</Radio.Button>
                        <Radio.Button value="5000">5000字</Radio.Button>
                        <Radio.Button value="8000">8000字</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ paddingTop: '20px', marginBottom: '5px' }}>
                    风格选择
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Radio.Group value={sendServer.style} onChange={styleChange} className={styles.writtenTool_body_Numberof}>
                        <Radio.Button value="专业严谨">专业严谨</Radio.Button>
                        <Radio.Button value="轻松幽默">轻松幽默</Radio.Button>
                        <Radio.Button value="通俗平实">通俗平实</Radio.Button>
                        <Radio.Button value="文采绚丽">文采绚丽</Radio.Button>
                    </Radio.Group>

                </Col>
            </Row>

            {
                sendServer.optionsValue === '法定公文' ? '' : <>

                    <div style={{ paddingTop: '20px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>引用素材</div>
                        {
                            selectMaterial ? <div style={{ color: '#1677FF', cursor: 'pointer' }}
                                onClick={() => {
                                    if (currTaps === '1') {
                                        setOpen(true);
                                    }
                                    else if (currTaps === '2') {
                                        setUserMaterialModalOpen(true);
                                    }
                                }}
                            ><FolderOpenOutlined />选择更多</div> : ''
                        }

                    </div>


                    {
                        !selectMaterial || userSelectId.length < 0 ? <div className={styles.writtenTool_body_Material} onClick={showDrawer}>
                            <FolderOpenOutlined style={{ marginRight: '10px' }} /> 选择素材
                        </div> : <>

                            {
                                currTaps === '1' ? <div className={styles.textMaterial}>{sendServer.material}</div> :
                                    <div>
                                        {
                                            selectMaterial ? userSelectId.map((item: any, index: number) => {
                                                return <div key={item.key} className={styles.meterial_list_item}>
                                                    <div className={styles.meterial_list_item_img}>
                                                        <img src={item.url} alt='' />
                                                    </div>
                                                    <div className={styles.meterial_list_item_text}>
                                                        <div className={styles.meterial_list_item_text_title}>{item.title}</div>
                                                        <div className={styles.meterial_list_item_text_size}>{item.size}</div>
                                                    </div>
                                                    <div className={styles.meterial_list_item_text_del} onClick={() => { handleDelMaterial(item) }}>
                                                        <CloseOutlined />
                                                    </div>
                                                </div>
                                            }) : ''
                                        }
                                    </div>
                            }

                        </>
                    }
                    <div style={{ paddingTop: '20px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>引用范文</div>
                        {
                            selectModelEssay ? <div style={{ color: '#1677FF', cursor: 'pointer' }}
                                onClick={() => {
                                    setModelEssayOpen(true)
                                }}
                            ><FolderOpenOutlined />选择更多</div> : ''
                        }

                    </div>
                    {
                        !selectModelEssay ? <div className={styles.writtenTool_body_Material} onClick={showModelEssay}>
                            <FolderOpenOutlined style={{ marginRight: '10px' }} /> 选择范文
                        </div> : <>

                            {
                                currTaps === '1' ? <div className={styles.ModelEssay}>
                                    {
                                        selectModelEssay ? modelEssayId.map((item: any, index: number) => {
                                            return <div key={item.key} className={styles.meterial_list_item}>
                                                <div className={styles.meterial_list_item_img}>
                                                    <img src={item.url} alt='' />
                                                </div>
                                                <div className={styles.meterial_list_item_text}>
                                                    <div className={styles.meterial_list_item_text_title}>{item.title}</div>
                                                    <div className={styles.meterial_list_item_text_size}>{item.size}</div>
                                                </div>
                                                <div className={styles.meterial_list_item_text_del} onClick={() => { handleDelModelEssay(item) }}>
                                                    <CloseOutlined />
                                                </div>
                                            </div>
                                        }) : ''
                                    }
                                </div> :
                                    <div>
                                        {
                                            selectModelEssay ? modelEssayId.map((item: any, index: number) => {
                                                return <div key={item.key} className={styles.meterial_list_item}>
                                                    <div className={styles.meterial_list_item_img}>
                                                        <img src={item.url} alt='' />
                                                    </div>
                                                    <div className={styles.meterial_list_item_text}>
                                                        <div className={styles.meterial_list_item_text_title}>{item.title}</div>
                                                        <div className={styles.meterial_list_item_text_size}>{item.size}</div>
                                                    </div>
                                                    <div className={styles.meterial_list_item_text_del} onClick={() => { handleDelModelEssay(item) }}>
                                                        <CloseOutlined />
                                                    </div>
                                                </div>
                                            }) : ''
                                        }
                                    </div>
                            }
                        </>
                    }
                </>
            }
            {contextHolder}
            <Drawer
                rootStyle={{ width: '80%', position: 'absolute', right: '0' }}
                placement="right"
                closable={false}
                onClose={() => { setOpen(false) }}
                open={open}
                getContainer={false}
            >
                <Material getMaterial={getMaterial} ></Material>
            </Drawer>
            {/* 个人素材列表 */}
            <Modal title="选择素材" open={userMaterialModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} >
                <UserMaterials sendSelectId={handleSendSelectId} setSendServer={setSendServer} />
            </Modal>
            <Modal title="选择范文" open={modelEssayOpen} onOk={handleOks} onCancel={handleCancels} width={1000} >
                <ModelEssay sendSelectIds={handleSendSelectIds} setSendServer={setSendServer} />
            </Modal>
        </div >
    )
}
)
Theme.displayName = 'Theme'
export default Theme
