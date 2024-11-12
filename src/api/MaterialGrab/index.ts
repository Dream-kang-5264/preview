import { instance } from "@/utils/request";
//获取素材源
export const getMaterialSource = (params: any) => instance.post('/api/v1/crawler/without/website/source', params)
// 抓取素材
export const grabMaterial = (params: any) => instance.post('/api/v1/crawler/without/articles', params)
// 抓取记录
export const getGrabRecord = (params: any) => instance.post('/api/v1/crawler/without/crawler/task/liste', params)
// 抓取日志
export const getGrabLog = (params: any) => instance.post('/api/v1/crawler/without/task/execution/table', params)
// 所有外部素材的数据
export const getAllExternalMaterial = (params: any) => instance.post('/api/v1/crawler/without/external/material/presentation', params)
// // 外部素材预览
// export const ExternalMaterialPreview = (params: any) => instance.post('/api/v1/crawler/without/external/material/preview', params)
