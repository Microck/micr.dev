import axios from 'axios'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `${basePath}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminAuth')
    if (token) {
      const parsedToken = JSON.parse(token)
      if (parsedToken) {
        config.headers.Authorization = `Bearer ${parsedToken}`
      }
    }
  }
  return config
})

const ntfyApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Question {
  content: string
  timestamp: string
}

export interface QAPair {
  question: Question
  answer: Question
}

export interface ApiResponse {
  message: string
}

export interface RegenerateResponse {
  corrected: string
  error?: string
}

export const questionsAPI = {
  submitQuestion: async (content: string): Promise<ApiResponse> => {
    const response = await api.post('/questions', { content })
    return response.data
  },

  getQA: async (): Promise<QAPair[]> => {
    const response = await api.get('/questions/qa')
    return response.data
  },

  regenerateText: async (content: string): Promise<RegenerateResponse> => {
    const response = await api.post('/questions/regenerate', { content })
    return response.data
  },

  sendNotification: async (title: string, message: string): Promise<void> => {
    const ntfyUrl = process.env.NEXT_PUBLIC_NTFY_URL;

    if (!ntfyUrl) {
      return; // No notification configured
    }

    try {
      await ntfyApi.post(ntfyUrl, {
        title,
        message,
        tags: ['new-question'],
        priority: 'low',
      });
    } catch (error) {
      console.warn('Failed to send notification:', error);
      // Don't throw error - notification failure shouldn't break the app
    }
  },

  // Admin API methods
  admin: {
    login: async (password: string): Promise<ApiResponse> => {
      const response = await api.post('/admin/login', { password })
      return response.data
    },

    getQuestions: async () => {
      const response = await api.get('/admin/questions')
      return response.data
    },

    postAnswer: async (questionId: string, content: string): Promise<ApiResponse> => {
      const response = await api.post('/admin/answer', { questionId, content })
      return response.data
    },

    deleteQuestion: async (id: string): Promise<void> => {
      await api.delete(`/admin/questions?id=${id}`)
    },
  },
}