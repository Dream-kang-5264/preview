

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage/session';
import { logger } from "redux-logger";
import homeStore from "./module/homeStore";
import LongStore from "./module/LongStore";
import firstDraftStore from './module/firstDraftStore';

// 持久化配置分别为每个模块定义
const persistConfigHome = {
    key: 'home',
    storage,
};

const persistConfigLong = {
    key: 'long',
    storage,
};

const persistConfigFirstDraft = {
    key: 'firstDraft',
    storage,
};

// 创建持久化 reducer
const homeReducer = persistReducer(persistConfigHome, homeStore);
const longReducer = persistReducer(persistConfigLong, LongStore);
const firstDraftReducer = persistReducer(persistConfigFirstDraft, firstDraftStore);

// 组合所有的 reducer
const rootReducer = combineReducers({
    homeReducer,
    longReducer,
    firstDraftReducer,
});

// 创建 Redux store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 禁用严格模式检查
        }),
    // .concat(logger)
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// 定义 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// 创建持久化存储器
export const persistor = persistStore(store);

export default store;
