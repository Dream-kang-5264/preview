import { instance, requestLongText } from "@/utils/request";
// 修改大纲
export const userSetOutline = (params: any) => instance.post('/api/v1/admin/user/messages/updata', params)
// 修改附件
export const userSetAttachment = (params: any) => instance.post('/api/v1/admin/user/attachment/updata', params)
// 文件列表
export const userFilesList = () => instance.post('/api/v1/admin/user/dialogue')
// 删除文件
export const userFilesDelete = (params: any) => instance.post('/api/v1/admin/user/delete-conversation/attachment_id', params)
// 文章改写
export const setFilesUpdate = (params:any)=>instance.post('/api/v1/admin/user/upload-file',params)
// 文章仿写
export const setFilesImitate =(params:any)=>instance.post('/api/v1/admin/user/upload-file_imitative',params)
// 生成文档
export const createWordFile = (params: any) =>instance.post('/api/v1/admin/user/generate_word_document',params)


