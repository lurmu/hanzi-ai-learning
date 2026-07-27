import api from './api'

export interface Hanzi {
  id: string
  character: string
  pinyin: string
  english: string
  radical: string
  strokes: number
  difficulty_level: number
  grade_level: string
  audio_url?: string
  stroke_order_url?: string
  frequency?: number
}

export const hanziService = {
  getHanzi: async (hanziId: string) => {
    const response = await api.get<Hanzi>(`/hanzi/${hanziId}`)
    return response.data
  },

  listHanzi: async (skip: number = 0, limit: number = 50, difficulty?: number) => {
    const params = new URLSearchParams()
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())
    if (difficulty) {
      params.append('difficulty', difficulty.toString())
    }
    const response = await api.get<Hanzi[]>(`/hanzi/?${params.toString()}`)
    return response.data
  },
}
