import { publicApi } from './apiConfig'
import { Course, Schedule } from '@/types'
import { ApiError, parseApiError } from './errors'

/**
 * API response type for schedule generation
 */
export interface GenerateScheduleResponse {
  message?: string
  schedules: Array<
    Array<{
      courseName: string
      color: string
      group: {
        name: string
        schedule: Schedule
      }
    }>
  >
}

/**
 * Request options for schedule generation
 */
export interface GenerateScheduleOptions {
  timeout?: number
}

export const generateScheduleService = {
  /**
   * Generate schedules from course data
   * @param coursesData - Array of courses to generate schedules from
   * @param options - Optional request configuration
   * @returns Promise with generated schedules
   * @throws {ApiError} When the API request fails
   */
  async generateSchedule(
    coursesData: Course[],
    options?: GenerateScheduleOptions
  ): Promise<GenerateScheduleResponse> {
    try {
      const response = await publicApi.post<GenerateScheduleResponse>(
        '/generate',
        coursesData,
        {
          timeout: options?.timeout,
        }
      )
      return response.data
    } catch (error) {
      // Error is already parsed by the interceptor if it's from axios
      if (error instanceof ApiError) {
        throw error
      }
      // Parse any other errors
      throw parseApiError(error)
    }
  },
}
