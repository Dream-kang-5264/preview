import { instance } from "@/utils/request";
// .AI成文--金句--主题生成： 
export const aiGoldenSentenceTheme = (params: any) => instance.post('/api/v1/garden/area/ai_golden_sentence_theme', params)
// AI成文--金句--样例仿写：
export const aiGoldenSentenceWriting = (params: any) => instance.post('/api/v1/garden/area/ai_golden_sentence_writing', params)

// AI成文--金句--文章提取：
export const aiGoldenSentenceArticle = (params: any) => instance.post('/api/v1/garden/area/ai_golden_sentence_article', params)