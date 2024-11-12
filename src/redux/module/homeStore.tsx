import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";
const todosSlice = createSlice({
  name: 'home',
  initialState: {
    loginShow: false,//登录弹窗的显示与隐藏
    leftNav: 0,//左侧菜单选中的高亮和背景
    ThesisCount: 0,//长文组件的数量
    ThematiCount: 0,//标题组件的数量
    themeShow: null,//搜索框前面的文字显示与隐藏
    // AItext:[]//AI返回的数据
    loginButtonShow: false,//登录按钮的显示与隐藏,
    DefaulText: false,//默认的文字
  },
  reducers: {
    // 设置点击nav导航栏的高亮
    setIndex(state, { type, payload }) {

      state.leftNav = payload
    },
    // 设置登录弹窗的显示与隐藏
    setLoginShow(state, { type, payload }) {
      state.loginShow = payload
    },
    // 设置长文组件的数量+1
    setThesisCount(state, { type, payload }) {

      state.ThesisCount = payload
    },
    // 设置标题组件的数量+1
    setThematiCount(state, { type, payload }) {
      state.ThematiCount = payload
    },
    setthemeShow(state, { type, payload }) {
      state.themeShow = payload
    },
    //登录按钮的显示与隐藏
    setloginButtonShow(state, { type, payload }) {
      state.loginButtonShow = payload
    },
    // 设置默认的文字
    setDefaulText(state, { type, payload }) {
      state.DefaulText = payload
    }
  }

})



// export const demoStoreAction = todosSlice.actions;
export const { setIndex, setLoginShow, setThesisCount, setThematiCount, setthemeShow, setloginButtonShow, setDefaulText } = todosSlice.actions
// const demoStorePersist = persistReducer(persistConfig, todosSlice.reducer);
export default todosSlice.reducer
// export default demoStorePersist
