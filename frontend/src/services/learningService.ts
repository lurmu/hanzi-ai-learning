import api from './api'

export interface LearningRecord {
  id: string
  user_id: string
  hanzi_id: string
  is_correct: boolean
  time_spent: number
  attempts: number
  confidence?: number
  created_at: string
}

export interface LearningStats {
  total_hanzi_learned: number
  accuracy_rate: number
  learning_streak: number
  total_study_time: number
  current_level: number
}

export const learningService = {
  recordLearning: async (userId: string, hanziId: string, isCorrect: boolean, timeSpent: number, attempts: number = 1, confidence?: number) => {
    const response = await api.post<LearningRecord>(`/learning/record?user_id=${userId}`, {
      hanzi_id: hanziId,
      is_correct: isCorrect,
      time_spent: timeSpent,
      attempts,
      confidence,
    })
    return response.data
  },

  getStats: async (userId: string) => {
    const response = await api.get<LearningStats>(`/learning/stats/${userId}`)
    return response.data
  },
}
