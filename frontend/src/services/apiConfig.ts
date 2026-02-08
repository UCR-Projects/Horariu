import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/config/config'
import { parseApiError } from './errors'

/**
 * Default configuration for API requests
 */
const DEFAULT_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY_BASE = 1000 // 1 second base delay for exponential backoff

/**
 * Custom config to track retry attempts
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number
  _maxRetries?: number
}

/**
 * Calculate delay for exponential backoff with jitter
 */
function getRetryDelay(retryCount: number): number {
  const exponentialDelay = RETRY_DELAY_BASE * Math.pow(2, retryCount)
  const jitter = Math.random() * 1000
  return exponentialDelay + jitter
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: AxiosError): boolean {
  // Network errors are retryable
  if (!error.response) {
    return true
  }

  // Retry on 5xx errors and 429 (rate limit)
  const status = error.response.status
  return status >= 500 || status === 429
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Public API client with enhanced error handling
 */
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor for logging and request modification
 */
publicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Initialize retry count if not set
    const customConfig = config as CustomAxiosRequestConfig
    if (customConfig._retryCount === undefined) {
      customConfig._retryCount = 0
      customConfig._maxRetries = MAX_RETRIES
    }

    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(parseApiError(error))
  }
)

/**
 * Response interceptor for error handling and retry logic
 */
publicApi.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`)
    }
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig | undefined

    // If no config or max retries reached, parse and throw error
    if (!config) {
      return Promise.reject(parseApiError(error))
    }

    const retryCount = config._retryCount ?? 0
    const maxRetries = config._maxRetries ?? MAX_RETRIES

    // Check if we should retry
    if (retryCount < maxRetries && isRetryableError(error)) {
      config._retryCount = retryCount + 1
      const delay = getRetryDelay(retryCount)

      if (import.meta.env.DEV) {
        console.log(`[API Retry] Attempt ${config._retryCount}/${maxRetries} after ${delay}ms`)
      }

      await sleep(delay)
      return publicApi.request(config)
    }

    // All retries exhausted or non-retryable error
    return Promise.reject(parseApiError(error))
  }
)

/**
 * Helper to create a request with custom configuration
 */
export function createRequestConfig(options?: {
  timeout?: number
  maxRetries?: number
}): AxiosRequestConfig {
  return {
    timeout: options?.timeout ?? DEFAULT_TIMEOUT,
    // maxRetries will be handled by the interceptor
  } as AxiosRequestConfig
}
