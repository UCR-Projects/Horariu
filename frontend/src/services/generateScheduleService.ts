import { publicApi } from './apiConfig'
import { Course, Schedule, ApiSchedule, DaySchedule } from '@/types'
import { ApiError, parseApiError } from './errors'
import { DAYS } from '@/utils/constants'

/**
 * API response type for schedule generation (uses object format)
 */
interface ApiGenerateScheduleResponse {
  message?: string
  schedules: Array<
    Array<{
      courseName: string
      color: string
      group: {
        name: string
        schedule: ApiSchedule
      }
    }>
  >
}

/**
 * Internal response type (uses array format)
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

/**
 * Converts internal array schedule format to API object format.
 * Internal: [{ day: 'L', active: true, timeBlocks: [{start, end}] }, ...]
 * API: { L: [{start, end}], M: [{start, end}] }
 */
function convertScheduleToApiFormat(schedule: Schedule): ApiSchedule {
  const apiSchedule: ApiSchedule = {}
  for (const daySchedule of schedule) {
    if (daySchedule.active && daySchedule.timeBlocks.length > 0) {
      apiSchedule[daySchedule.day] = daySchedule.timeBlocks
    }
  }
  return apiSchedule
}

/**
 * Converts API object schedule format to internal array format.
 * API: { L: [{start, end}], M: [{start, end}] }
 * Internal: [{ day: 'L', active: true, timeBlocks: [{start, end}] }, ...]
 */
function convertApiFormatToSchedule(apiSchedule: ApiSchedule): Schedule {
  return DAYS.map((day): DaySchedule => {
    const timeBlocks = apiSchedule[day] || []
    return {
      day,
      active: timeBlocks.length > 0,
      timeBlocks,
    }
  })
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
      // Convert internal schedule format to API format
      const apiCourses = coursesData.map((course) => ({
        name: course.name,
        color: course.color,
        groups: course.groups
          .filter((group) => group.isActive)
          .map((group) => ({
            name: group.name,
            schedule: convertScheduleToApiFormat(group.schedule),
          })),
      }))

      const response = await publicApi.post<ApiGenerateScheduleResponse>('/generate', apiCourses, {
        timeout: options?.timeout,
      })

      // Convert API response format to internal format
      const convertedSchedules: GenerateScheduleResponse = {
        message: response.data.message,
        schedules: response.data.schedules.map((scheduleOption) =>
          scheduleOption.map((course) => ({
            ...course,
            group: {
              ...course.group,
              schedule: convertApiFormatToSchedule(course.group.schedule),
            },
          }))
        ),
      }

      return convertedSchedules
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
