/**
 * API client for communicating with the FastAPI backend.
 */
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const careerPathsAPI = {
  generatePaths: async (data: {
    user_id: string
    target_profession_id: string
    max_cost?: number
    max_time_months?: number
    risk_tolerance?: number
  }) => {
    const response = await apiClient.post('/api/v1/paths/generate', data)
    return response.data
  },

  getActivePaths: async (userId: string) => {
    const response = await apiClient.get(`/api/v1/paths/${userId}/active`)
    return response.data
  },

  getDriftAlerts: async (userId: string) => {
    const response = await apiClient.get(`/api/v1/paths/${userId}/drift-alerts`)
    return response.data
  },
}

export const skillsAPI = {
  listSkills: async (params?: { skip?: number; limit?: number; category?: string }) => {
    const response = await apiClient.get('/api/v1/skills/', { params })
    return response.data
  },

  extractSkills: async (data: { text: string; source_type: string }) => {
    const response = await apiClient.post('/api/v1/skills/extract', data)
    return response.data
  },
}

export const marketDataAPI = {
  getJobTrends: async (professionId: string, region: string = 'US') => {
    const response = await apiClient.get(`/api/v1/market/trends/${professionId}`, {
      params: { region },
    })
    return response.data
  },

  getSalaryData: async (professionId: string, region: string = 'US') => {
    const response = await apiClient.get(`/api/v1/market/salary/${professionId}`, {
      params: { region },
    })
    return response.data
  },
}
