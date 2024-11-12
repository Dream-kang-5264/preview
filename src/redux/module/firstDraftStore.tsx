import { createSlice, } from "@reduxjs/toolkit";

const firstDraftStore = createSlice({
    name: 'firstDraft',

    initialState: {
        catalogue: [],
        toolTitle: '',//设置工具库的标题
        toolShow: false,//工具库是否显示
        templetTitle: '',//写作场景模版的一级分类
        // templetTieleId: '',//写作场景模版的一级分类的id
        templetChildren: '',//写作场景模版的二级分类
        // templetChildrenId: '',//写作场景模版的二级分类id
        SelectData: '',//选中的文本,
        homeToolShow: false,//首页快速创作调转编辑器工具库是否显示
    },
    reducers: {
        // 获取目录数据
        setCatalogue(state, { type, payload }) {
            state.catalogue = payload
        },
        // 设置工具标题
        setToolTitle(state, { type, payload }) {
            state.toolTitle = payload
        },
        //工具库是否显示
        setToolShow(state, { type, payload }) {
            state.toolShow = payload
        },
        // 写作场景模版的一级分类
        setTempletTitle(state, { type, payload }) {
            state.templetTitle = payload
        },
        // 写作场景模版的一级分类的id
        // setTempletTieleId(state, { type, payload }) {
        //     state.templetTieleId = payload
        // },
        // 写作场景模版的二级分类标题
        setTempletChildren(state, { type, payload }) {

            state.templetChildren = payload
        },
        // 写作场景模版的二级分类的id
        // setTempletChildrenId(state, { type, payload }) {
        //     state.templetChildrenId = payload
        // },
        setSelectDatas(state, { type, payload }) {
            state.SelectData = payload
        },
        sethomeToolShow(state, { type, payload }) {
            console.log(payload,'payload');
            
            state.homeToolShow = payload
        }
    }
})
export const { setCatalogue, setToolTitle, setToolShow, setTempletTitle, setTempletChildren, setSelectDatas,sethomeToolShow } = firstDraftStore.actions
export default firstDraftStore.reducer

