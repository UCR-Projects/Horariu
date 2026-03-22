import { publicApi } from './apiConfig'
import { Course, Schedule, ApiSchedule, DaySchedule, CourseLink } from '@/types'
import { ApiError, parseApiError } from './errors'
import { DAYS } from '@/utils/constants'

/**
 * API response type for schedule generation (uses object format, no color)
 */
interface ApiGenerateScheduleResponse {
  message?: string
  schedules: Array<
    Array<{
      courseName: string
      group: {
        name: string
        schedule: ApiSchedule
      }
    }>
  >
}

/**
 * Internal response type (uses array format, includes color from frontend)
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
   * @param links - Array of course links
   * @param options - Optional request configuration
   * @returns Promise with generated schedules
   * @throws {ApiError} When the API request fails
   */
  async generateSchedule(
    coursesData: Course[],
    links: CourseLink[],
    options?: GenerateScheduleOptions
  ): Promise<GenerateScheduleResponse> {
    try {
      // Create color lookup for re-attaching colors in response
      const colorLookup: Record<string, string> = {}
      for (const course of coursesData) {
        colorLookup[course.name] = course.color
      }

      // Convert internal schedule format to API format (no color)
      const apiCourses = coursesData.map((course) => ({
        name: course.name,
        groups: course.groups
          .filter((group) => group.isActive)
          .map((group) => ({
            name: group.name,
            schedule: convertScheduleToApiFormat(group.schedule),
          })),
      }))

      // Convert links to API format
      const apiLinks = links.map((link) => ({
        courses: link.courses,
        connectionSets: link.connectionSets,
      }))

      const response = await publicApi.post<ApiGenerateScheduleResponse>(
        '/generate',
        { courses: apiCourses, links: apiLinks },
        { timeout: options?.timeout }
      )

      // Convert API response format to internal format and re-attach colors
      const convertedSchedules: GenerateScheduleResponse = {
        message: response.data.message,
        schedules: response.data.schedules.map((scheduleOption) =>
          scheduleOption.map((course) => ({
            courseName: course.courseName,
            color: colorLookup[course.courseName] || '#000000',
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
