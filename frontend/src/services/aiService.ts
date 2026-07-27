import api from './api'

export interface AIAnalysis {
  analysis: string
  statistics: {
    total_attempts: number
    accuracy: number
    correct_attempts: number
  }
}

export interface Recommendation {
  type: string
  title: string
  hanzi_ids: string[]
  reason: string
}

export const aiService = {
  analyzeProgress: async (userId: string) => {
    const response = await api.post<AIAnalysis>(`/ai/analyze?user_id=${userId}`)
    return response.data
  },

  getRecommendations: async (userId: string) => {
    const response = await api.get<{ recommendations: Recommendation[] }>(`/ai/recommendations/${userId}`)
    return response.data.recommendations
  },
}
