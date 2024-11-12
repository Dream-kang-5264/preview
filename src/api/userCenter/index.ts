import { instance } from "@/utils/request";
// 获取用户信息
export const getUserInfo = (params: any) => instance.post('/api/v1/admin/user/individual/center', params)
// 修改用户信息
export const editUserInfo = (params: any) => instance.post('/api/v1/admin/user/individual/center/modify/information', params)