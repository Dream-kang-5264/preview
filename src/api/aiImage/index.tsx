import { instance } from "@/utils/request";

// AI成图 - 推荐图形：
export const RecommendedFigure = (params: any) => instance.post('/api/v1/garden/area/recommendation_chart', params)
// AI-成图：
export const getOptionData = (params: any) => instance.post('/api/v1/garden/area/chart_generation', params)