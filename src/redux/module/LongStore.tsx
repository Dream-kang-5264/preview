import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
    name: 'long',
    initialState: {
        outlineShow: false,//回答问题的组件显示
        progressShow: false,//控制进度条组件的显示与隐藏
        // myText: [],//用户问的value
        loadingShow: false,//生成回答之前的loading效果
        titleOutline: [],//大纲的数据
        outlineLoading: false,//大纲生成完毕的loading、
        titleOutlineShow: false,//标题大纲组件的显示与隐藏
        componentsType: [],//根据点击的类型渲染组件
        outlineRawdata: [],//大纲的原始数据
        UpdataOutline: null,//修改大纲的数据
        createDecordId: '',//创建会话的id
        orderId: 0,
        isAddHistory: false,//判断是新增还是历史会话
        attachmentIds: '',//附件的id
        historyLongtextId:'',//历史长文的id
        historyDecordId: '',//历史会话的id
        decodeTitle: '',//会话的title
        messageOutlineId: '',//修改会话当中的大纲id,
        addOutlineid:'',//新增大纲完成后需要修改的id
        outlineValue:'',//更换大纲的value值
        getLongtext:[],//判断用户是否点击了获取长文
        historyType:[],//历史记录需要渲染的组件
        Longtitle:0,//长文写作，或者扩写的title
        outlineLevel:'3',//大纲的层级
        longTextLength:[],//记录点击长文的长度,
        uploadMaterialId:''//上传素材的id
    },
    reducers: {
        // 回答的答案
        // setAItext(state, action) {
        //     state.AItext = action.payload
        // },
        // 回答是否显示
        setoutlineShow(state, { type, payload }) {
            state.outlineShow = payload
        },
        // 从历史进入大纲获取的长文的会话id
        sethistoryLongtextId(state, { type, payload }) {
        state.historyLongtextId = payload
        },
        // 问完之后的loading效果
        setloadingShow(state, { type, payload }) {
            state.loadingShow = payload
        },
        // 大纲的数据
        settitleOutline(state, { type, payload }) {
            state.titleOutline = payload
        },
        //大纲加载完毕隐藏loading
        setoutlineLoading(state, { type, payload }) {
            state.outlineLoading = payload
        },
        // 标题大纲组件的显示与隐藏
        settitleOutlineShow(state, { type, payload }) {
            state.titleOutlineShow = payload
        },
        // 渲染的组件类型
        setComponentsType(state, { type, payload }) {
            state.componentsType = payload
        },
        // 大纲的原数据
        setoutlineRawdata(state, { type, payload }) {
            state.outlineRawdata = payload
        },
        // 修改大纲的数据
        setUpdataOutline(state, { type, payload }) {
            state.UpdataOutline = payload
        },
        // 控制进度条
        setprogressShow(state, { type, payload }) {
            state.progressShow = payload
        },
        // 设置当前会话的id
        setDecordId(state, { type, payload }) {
            state.createDecordId = payload
        },
        setOrderId(state, { type, payload }) {
            state.orderId = payload
        },
        // 修改附件的id
        setattachmentId(state, { type, payload }) {
            state.attachmentIds = payload
        },
        // 修改会话类型，新增还是历史
        setisAddHistory(state, { type, payload }) {
            state.isAddHistory = payload
        },
        // 设置历史会话的id
        sethistoryDecordId(state, { type, payload }) {
            state.historyDecordId = payload
        },
        // 修改当前会话的title
        setdecodeTitle(state, { type, payload }) {
            state.decodeTitle = payload
        },
        //修改历史对话的大纲的id
        setmessageOutlineId(state, { type, payload }) {
            state.messageOutlineId = payload
        },
        setaddOutlineid(state, { type, payload }){
            state.addOutlineid = payload
        },
        // 设置更换大纲的value值
        setoutlineValue(state, { type, payload }){
            state.outlineValue = payload
        },
        // 判断用户是否点击了获取长文
        setgetLongtext(state, { type, payload }){
            state.getLongtext = payload
        },
        // 设置历史记录渲染的组件
        sethistoryType(state, { type, payload }){
            state.historyType = payload
        },
        //设置长文或者仿写的title
        setLongtitle(state, { type, payload }){
            state.Longtitle = payload
        },
        // 设置大纲的层级
        setoutlineLevel(state, { type, payload }){
            state.outlineLevel = payload
        },
        // 设置点击长文的长度
        setlongTextLength(state, { type, payload }){
            state.longTextLength = payload
        },
        //设置上传素材的id
        setUploadMaterialId(state,{type,payload}){
            state.uploadMaterialId = payload
        }
    }

})



// export const demoStoreAction = todosSlice.actions;
export const { setoutlineShow, setloadingShow, settitleOutline, setoutlineLoading, settitleOutlineShow, setComponentsType, setoutlineRawdata, setUpdataOutline, setprogressShow, setDecordId, setOrderId, setattachmentId, setisAddHistory, sethistoryDecordId, setdecodeTitle,setmessageOutlineId,setaddOutlineid,sethistoryLongtextId,setoutlineValue,setgetLongtext,sethistoryType,setLongtitle,setoutlineLevel, setlongTextLength,setUploadMaterialId} = todosSlice.actions
// const demoStorePersist = persistReducer(persistConfig, todosSlice.reducer);
export default todosSlice.reducer
// export default demoStorePersist
