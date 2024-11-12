import { instance } from "@/utils/request";
// 黑名单查询
export const getBlackList = (params: any) => instance.post('/api/v1/roll/lexicon/blacklist', params)

// 新增黑名单
export const addBlackList = (params: any) => instance.post('/api/v1/roll/lexicon/add/blacklist', params)
// 敏感词查询
export const getSensitiveList = (params: any) => instance.post('/api/v1/roll/lexicon/sensitive/words', params)
// 新增敏感词
export const addSensitiveList = (params: any) => instance.post('/api/v1/roll/lexicon/add/sensitive/words', params)

// 易错词查询
export const getErrorList = (params: any) => instance.post('/api/v1/roll/lexicon/fallible/words', params)
// 新增易错词
export const addErrorLList = (params: any) => instance.post('/api/v1/roll/lexicon/add/fallible/words', params)

// 落马官员查询
export const getOfficerList = (params: any) => instance.post('/api/v1/roll/lexicon/fallen/official', params)
// 新增落马官员
export const addOfficerList = (params: any) => instance.post('/api/v1/roll/lexicon/add/fallen/official', params)

// 法律法规查询
export const getLawList = (params: any) => instance.post('/api/v1/roll/lexicon/term/definition', params)

// 固定搭配查询
export const getCombinationList = (params: any) => instance.post('/api/v1/roll/lexicon/fixed/collocation', params)

// 新增固定搭配
export const addCombinationList = (params: any) => instance.post('/api/v1/roll/lexicon/add/fixed/collocation', params)


// 重点关注词查询
export const getFocusList = (params: any) => instance.post('/api/v1/roll/lexicon/focus/on', params)
// 新增重点关注词
export const addFocusList = (params: any) => instance.post('/api/v1/roll/lexicon/add/focus/on', params)


// 职务对照词查询
export const getDutyList = (params: any) => instance.post('/api/v1/roll/lexicon/important/person', params)

// 新增职务对照
export const addDutyList = (params: any) => instance.post('/api/v1/roll/lexicon/add/important/person', params)


// 部门机构词查询
export const getDepartmentList = (params: any) => instance.post('/api/v1/roll/lexicon/query/department/organization', params)
// 新增部门机构
export const addDepartmentList = (params: any) => instance.post('/api/v1/roll/lexicon/add/department/organization', params)



// 重要讲话查询
export const getImportantList = (params: any) => instance.post('/api/v1/roll/lexicon/important/speech', params)

// 新增重要讲话
export const addImportantList = (params: any) => instance.post('/api/v1/roll/lexicon/add/important/speech', params)


// 删除词典
export const deleteLexicon = (params: any) => instance.post('/api/v1/roll/lexicon/delete/data/set', params)

