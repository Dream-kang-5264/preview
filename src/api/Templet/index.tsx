import { instance } from "@/utils/request";
// 获取模板的顶级数据
export const getTempletData = () => instance('/api/v1/garden/area/tag/template_types')
// AI成文--模板父级数据查询（type为4不展示)
export const getTemplateType4 = () => instance('/api/v1/garden/area/tag/template_types_too')
// 通过模板id拿对应模板数据
export const getTempletChildren = (params: any) => instance.post('/api/v1/garden/area/template_types/templates', params)
// 保存标题
export const userSaveTitle = (params: any) => instance.post('/api/v1/admin/user/ai_written_save_title', params)
// 上传模板
export const uploadTemplate = (params: any) => instance.post('/api/v1/garden/area/parsing/format', params)