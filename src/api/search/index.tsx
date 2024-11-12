import { instance, requestLongText } from "@/utils/request";
import { AxiosRequestConfig } from "axios";


// 获取所有素材的分类
export const getAllMaterial = () => instance('/api/v1/garden/area/tag/material_categories')
// 通过素材的父级id拿对应的子级数据：以及获取所有
export const getSearchClass = (params: any) => instance.post('/api/v1/garden/area/tag/materials/category_id', params);
// 通过素材id拿对应素材数据
export const getSearchFilter = (params: any) => instance.post('/api/v1/garden/area/material_categories/materials', params);
//测试 上传
export const userFileUpload = (params: any) => instance.post('/api/v1/garden/area/upload-file-categories', params)
// 上传图片
export const uploadFileImg = (params: any) => instance.post('/api/v1/garden/area/upload-file-categories-person', params)
// 获取所有上传的素材
export const getAllUploadMaterial = (params: any) => instance.post('/api/v1/garden/area/material_categories/materials/person', params)
// 删除上传的素材
export const delUploadMaterial = (params: any) => instance.post('/api/v1/garden/area/delete_user_materials', params)
// 获取类型
export const userMaterialTypes = () => instance('/api/v1/garden/area/user_materials/material_types')
// 上传列表信息
export const userUploadedList = () => instance.post('/api/v1/garden/area/user_uploaded_files_type')
// 上传文档
export const userUploadDocument = (params: any) => instance.post('/api/v1/garden/area/upload-file_imitative', params)

// 上传pdf
export const userUploadPdf = (params: any) => instance.post('/api/v1/garden/area/upload-file-categories-pdf', params)
// 粘贴文本保存
export const userAffixText = (params: any) => instance.post('/api/v1/garden/area/paste_document', params)
// 外网搜索
export const userOutNetSearch = (params: any) => instance.post('/api/v1/garden/area/bigmodel_seek/interlock', params)
// 素材-txt更换标题：修改标题
export const userUpdateTitle = (params: any) => instance.post('/api/v1/garden/area/modify_file_name', params)


// 编辑器我的素材接口
export const editMyMaterial = (params: any) => instance.post('/api/v1/garden/area/material_categories/materials/person/editor', params)
// 推荐素材
export const recommendMaterial = (params: any) => instance.post('/api/v1/garden/area/bigmodel_seek', params)
// 修改素材权限
export const modifyMaterialPermission = (params: any) => instance.post('/api/v1/garden/area/material_attribute', params)
// 查看公共素材
export const lookPublicMaterial = (params: any) => instance.post('/api/v1/garden/area/material_categories/Public/material', params)
