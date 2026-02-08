import { AxiosError } from 'axios'

/**
 * Error codes for API errors
 */
export const ApiErrorCode = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const

export type ApiErrorCodeType = (typeof ApiErrorCode)[keyof typeof ApiErrorCode]

/**
 * Base API Error class with enhanced information
 */
export class ApiError extends Error {
  readonly code: ApiErrorCodeType
  readonly statusCode: number | null
  readonly isRetryable: boolean
  readonly originalError?: Error

  constructor(
    message: string,
    code: ApiErrorCodeType,
    statusCode: number | null = null,
    isRetryable: boolean = false,
    originalError?: Error
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.isRetryable = isRetryable
    this.originalError = originalError
  }
}

/**
 * Network error - no internet connection or server unreachable
 */
export class NetworkError extends ApiError {
  constructor(originalError?: Error) {
    super(
      'Unable to connect to the server. Please check your internet connection.',
      ApiErrorCode.NETWORK,
      null,
      true,
      originalError
    )
    this.name = 'NetworkError'
  }
}

/**
 * Timeout error - request took too long
 */
export class TimeoutError extends ApiError {
  constructor(timeoutMs: number, originalError?: Error) {
    super(
      `Request timed out after ${timeoutMs / 1000} seconds. Please try again.`,
      ApiErrorCode.TIMEOUT,
      null,
      true,
      originalError
    )
    this.name = 'TimeoutError'
  }
}

/**
 * Validation error - invalid data sent to API
 */
export class ValidationError extends ApiError {
  readonly details: Array<{ path: string; message: string }>

  constructor(details: Array<{ path: string; message: string }>, originalError?: Error) {
    super(
      'Validation error: The data provided is invalid.',
      ApiErrorCode.VALIDATION,
      400,
      false,
      originalError
    )
    this.name = 'ValidationError'
    this.details = details
  }
}

/**
 * Server error - 5xx errors
 */
export class ServerError extends ApiError {
  constructor(statusCode: number = 500, originalError?: Error) {
    super(
      'Server error. Please try again later.',
      ApiErrorCode.SERVER,
      statusCode,
      true,
      originalError
    )
    this.name = 'ServerError'
  }
}

/**
 * Converts an AxiosError to a specific ApiError type
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof AxiosError) {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return new TimeoutError(30000, error)
      }
      return new NetworkError(error)
    }

    const status = error.response.status
    const data = error.response.data as Record<string, unknown> | undefined

    // Validation errors (400)
    if (status === 400) {
      const details = (data?.errors as Array<{ path: string; message: string }>) || []
      return new ValidationError(details, error)
    }

    // Unauthorized (401)
    if (status === 401) {
      return new ApiError(
        'Authentication required. Please log in.',
        ApiErrorCode.UNAUTHORIZED,
        401,
        false,
        error
      )
    }

    // Forbidden (403)
    if (status === 403) {
      return new ApiError(
        'You do not have permission to perform this action.',
        ApiErrorCode.FORBIDDEN,
        403,
        false,
        error
      )
    }

    // Not found (404)
    if (status === 404) {
      return new ApiError(
        'The requested resource was not found.',
        ApiErrorCode.NOT_FOUND,
        404,
        false,
        error
      )
    }

    // Rate limit (429)
    if (status === 429) {
      return new ApiError(
        'Too many requests. Please wait and try again.',
        ApiErrorCode.RATE_LIMIT,
        429,
        true,
        error
      )
    }

    // Server errors (5xx)
    if (status >= 500) {
      return new ServerError(status, error)
    }
  }

  // Unknown error
  return new ApiError(
    error instanceof Error ? error.message : 'An unknown error occurred.',
    ApiErrorCode.UNKNOWN,
    null,
    false,
    error instanceof Error ? error : undefined
  )
}
