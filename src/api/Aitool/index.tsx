import { instance } from "@/utils/request";
// 生成表格
export const getTableData = (params: any) => instance.post('/api/v1/garden/area/text_to_table/invoke', params)
// 敏感词过滤
export const getSensitiveWords = (params: any) => instance.post('/api/v1/garden/area/sensitive_words/invoke', params)
// 全文摘要
export const getContinue = (params: any) => instance.post('/api/v1/garden/area/summar/stream/text', params)
// 文本纠错
export const getProofread = (params: any) => instance.post('/api/v1/garden/area/correct_stream_text', params)
// 文章总结摘编
export const getSummary = (params: any) => instance.post('/api/v1/garden/area/summar/stream/text', params)
// 修改建议
export const getSuggestion = (params: any) => instance.post('/api/v1/garden/area/suggest/textstream/text', params)