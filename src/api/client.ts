import axios, { AxiosError } from 'axios'
import { API_BASE_URL } from '@/shared/config'
import { ApiError } from './apiError'

interface BackendErrorBody {
  message?: string
  details?: Record<string, unknown>
}

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorBody>) => {
    if (error.response) {
      const { status, data } = error.response
      throw new ApiError(status, data?.message ?? error.message, data?.details)
    }
    throw new ApiError(0, 'Unable to reach the server. Please try again.')
  },
)
