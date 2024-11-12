import { instance, requestLongText } from "@/utils/request";
// 历史会话
export const getHistory = () => instance.post('/api/v1/admin/user/conversations/dialogue')
// 创建会话
export const getCreateRecord = () => instance.post('/api/v1/admin/user/conversations/')
// 获取长文
export const getOutline = (params: any) => requestLongText.post('/api/v1/admin/user/outline_chapter/stream', params)
// 会话详情
export const getRecordDetails = (params: any) => instance.post('/api/v1/admin/user/messages/conversation_id', params)
// 附件信息

export const getAnnexDetails = (params: any) => instance.post('/api/v1/admin/user/messages/attachment_id', params)
// 删除会话
export const DeleteRecord = (params: any) => instance.post('/api/v1/admin/user/delete-conversation/conversation_id', params)
// 修改昵称
export const UpdateNickname = (params: any) => instance.post('/api/v1/admin/user/conversation/updata', params)
// 修改标题
export const UpdateOutlineTitle = (params: any) => instance.post('/api/v1/admin/userarticle_outline_title', params)
// 换个大纲
export const exchangeOutline = (params: any) => instance.post('/api/v1/admin/user/article_outline_too', params)
// 获取层级的大纲
export const getTierOutline = (params: any) => instance.post('/api/v1/admin/user/article_outline_new',params)
// 上传范文素材
export const uploadModelEssay = (params: any) => instance.post('/api/v1/garden/area/upload_copy_template', params)


