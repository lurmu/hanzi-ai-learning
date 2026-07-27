import { create } from 'zustand'

interface AuthStore {
  userId: string | null
  token: string | null
  login: (userId: string, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  userId: localStorage.getItem('user_id'),
  token: localStorage.getItem('access_token'),
  login: (userId: string, token: string) => {
    localStorage.setItem('user_id', userId)
    localStorage.setItem('access_token', token)
    set({ userId, token })
  },
  logout: () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('access_token')
    set({ userId: null, token: null })
  },
  isAuthenticated: () => {
    return !!(get().token && get().userId)
  },
}))
