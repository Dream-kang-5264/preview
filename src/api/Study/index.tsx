import { instance } from "@/utils/request";
// 获取一级标题的数据
export const getTitleData = () => instance.get('/api/v1/garden/area/tag/listByTagType')
// 获取所有子类分类：
export const getClassChildren = (params:any) =>instance.post('/api/v1/garden/area/tag/listByTagType/category_id',params)
// 获取分类所属的数据：
export const getCategoryData =(params:any) =>instance.post('/api/v1/garden/area/learningGardenDetail',params)
// 获取dpf文件
export const getPdfFile =(params:any) =>instance.post('/api/v1/garden/area/industryReport_pdf',params)
// 文件预览
export const getPreviewFile =(params:any) =>instance.post('/api/v1/garden/area/industryReport_file',params)