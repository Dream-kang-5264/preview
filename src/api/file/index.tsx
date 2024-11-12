import { instance } from "@/utils/request";
// 文件标题搜索
export const userTitleSearch = (params: any) => instance.post('/api/v1/admin/user/personal_document', params)