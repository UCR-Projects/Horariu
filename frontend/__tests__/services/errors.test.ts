import { describe, it, expect } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import {
  ApiError,
  ApiErrorCode,
  NetworkError,
  TimeoutError,
  ValidationError,
  ServerError,
  parseApiError,
} from '@/services/errors'

describe('Error classes', () => {
  describe('ApiError', () => {
    it('should create an error with all properties', () => {
      const error = new ApiError('Test error', ApiErrorCode.UNKNOWN, 500, true)

      expect(error.message).toBe('Test error')
      expect(error.code).toBe(ApiErrorCode.UNKNOWN)
      expect(error.statusCode).toBe(500)
      expect(error.isRetryable).toBe(true)
      expect(error.name).toBe('ApiError')
    })
  })

  describe('NetworkError', () => {
    it('should create a network error', () => {
      const error = new NetworkError()

      expect(error.code).toBe(ApiErrorCode.NETWORK)
      expect(error.isRetryable).toBe(true)
      expect(error.statusCode).toBeNull()
      expect(error.name).toBe('NetworkError')
    })
  })

  describe('TimeoutError', () => {
    it('should create a timeout error with duration in message', () => {
      const error = new TimeoutError(30000)

      expect(error.code).toBe(ApiErrorCode.TIMEOUT)
      expect(error.message).toContain('30')
      expect(error.isRetryable).toBe(true)
      expect(error.name).toBe('TimeoutError')
    })
  })

  describe('ValidationError', () => {
    it('should create a validation error with details', () => {
      const details = [{ path: 'name', message: 'Required' }]
      const error = new ValidationError(details)

      expect(error.code).toBe(ApiErrorCode.VALIDATION)
      expect(error.details).toEqual(details)
      expect(error.statusCode).toBe(400)
      expect(error.isRetryable).toBe(false)
      expect(error.name).toBe('ValidationError')
    })
  })

  describe('ServerError', () => {
    it('should create a server error', () => {
      const error = new ServerError(503)

      expect(error.code).toBe(ApiErrorCode.SERVER)
      expect(error.statusCode).toBe(503)
      expect(error.isRetryable).toBe(true)
      expect(error.name).toBe('ServerError')
    })
  })
})

describe('parseApiError', () => {
  const createAxiosError = (
    status: number | undefined,
    data?: Record<string, unknown>,
    code?: string,
    message?: string
  ): AxiosError => {
    const error = new AxiosError(message || 'Test error')
    error.code = code
    if (status !== undefined) {
      error.response = {
        status,
        data,
        statusText: 'Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    }
    return error
  }

  it('should return the error if already an ApiError', () => {
    const apiError = new ApiError('Test', ApiErrorCode.UNKNOWN)
    const result = parseApiError(apiError)

    expect(result).toBe(apiError)
  })

  it('should return NetworkError for no response', () => {
    const axiosError = createAxiosError(undefined)
    const result = parseApiError(axiosError)

    expect(result).toBeInstanceOf(NetworkError)
  })

  it('should return TimeoutError for timeout', () => {
    const axiosError = createAxiosError(undefined, undefined, 'ECONNABORTED')
    const result = parseApiError(axiosError)

    expect(result).toBeInstanceOf(TimeoutError)
  })

  it('should return ValidationError for 400 status', () => {
    const axiosError = createAxiosError(400, { errors: [{ path: 'name', message: 'Required' }] })
    const result = parseApiError(axiosError)

    expect(result).toBeInstanceOf(ValidationError)
  })

  it('should return ApiError with UNAUTHORIZED for 401', () => {
    const axiosError = createAxiosError(401)
    const result = parseApiError(axiosError)

    expect(result.code).toBe(ApiErrorCode.UNAUTHORIZED)
    expect(result.statusCode).toBe(401)
  })

  it('should return ApiError with FORBIDDEN for 403', () => {
    const axiosError = createAxiosError(403)
    const result = parseApiError(axiosError)

    expect(result.code).toBe(ApiErrorCode.FORBIDDEN)
  })

  it('should return ApiError with NOT_FOUND for 404', () => {
    const axiosError = createAxiosError(404)
    const result = parseApiError(axiosError)

    expect(result.code).toBe(ApiErrorCode.NOT_FOUND)
  })

  it('should return ApiError with RATE_LIMIT for 429', () => {
    const axiosError = createAxiosError(429)
    const result = parseApiError(axiosError)

    expect(result.code).toBe(ApiErrorCode.RATE_LIMIT)
    expect(result.isRetryable).toBe(true)
  })

  it('should return ServerError for 5xx status', () => {
    const axiosError = createAxiosError(500)
    const result = parseApiError(axiosError)

    expect(result).toBeInstanceOf(ServerError)
  })

  it('should return ApiError with UNKNOWN for non-axios errors', () => {
    const result = parseApiError(new Error('Random error'))

    expect(result.code).toBe(ApiErrorCode.UNKNOWN)
    expect(result.message).toBe('Random error')
  })
})

