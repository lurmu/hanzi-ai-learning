import api from './api'

export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export const userService = {
  register: async (username: string, email: string, password: string, full_name?: string) => {
    const response = await api.post<User>('/users/register', {
      username,
      email,
      password,
      full_name,
    })
    return response.data
  },

  login: async (username: string, password: string) => {
    const response = await api.post<LoginResponse>('/users/login', {
      username,
      password,
    })
    return response.data
  },

  getCurrentUser: async (userId: string) => {
    const response = await api.get<User>(`/users/me?user_id=${userId}`)
    return response.data
  },
}
