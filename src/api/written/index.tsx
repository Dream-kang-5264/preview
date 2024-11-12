import { instance } from "@/utils/request";
// 生成大纲
export const getWrittenOutline = (params: any) => instance.post('/api/v1/garden/area/ai_written_outline', params)
// 获取摘编
export const getExtractData = (params: any) => instance.post('/api/v1/garden/area/ai_written_compile', params)
// 获取分步长文
export const getWrittenContext = (params: any) => instance.post('/api/v1/garden/area/ai_written_article', params)
// 保存文章
export const userSaveLongtext = (params: any) => instance.post('/api/v1/admin/user/ai_written_save', params)
// AI一步成文：
export const userStepLongtext = (params: any) => instance.post('/api/v1/garden/area/ai_written_single_step', params)
// .AI成文--模板类型
export const getTempletType = (params: any) => instance.post('/api/v1/garden/area/template/template_fields', params)
// 获取排版格式
export const getFormatType = (params: any) => instance.post('/api/v1/admin/user/format/extraction', params)
