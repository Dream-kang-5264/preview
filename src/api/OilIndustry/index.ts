import { instance } from "@/utils/request";
// 查询行业术语列表
export const getTermList = (params: any) => instance.post('/api/v1/roll/lexicon/term/definition', params)
// 新增行业术语
export const addTerm = (params: any) => instance.post('/api/v1/roll/lexicon/add/term/definition', params)


