import {instance} from "@/utils/request";
// 用户注册
export const userRegister = (params:any) => instance.post('/api/v1/admin/user/signin', params)
// 用户登录
export const userLogin = (params:any) => instance.post('/api/v1/admin/user/account/login', params)

