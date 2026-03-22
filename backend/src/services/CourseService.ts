import { CourseRepository } from '../repositories/courseRepository'
import { CourseInfo, CourseParamsInfo, CourseUpdateInfo } from '../schemas/course.schema'
import { GenerateScheduleInput } from '../schemas/schedule.schema'
import { generateSchedulesWithLinks } from '../services/ScheduleService'
import { NotFoundError } from '../utils/customsErrors'

export const CourseService = {

  async generateSchedules (input: GenerateScheduleInput) {
    const generatedSchedules = generateSchedulesWithLinks(input)

    if (generatedSchedules.length === 0) {
      return {
        success: true,
        message: 'Schedule conflicts',
        schedules: []
      }
    }

    return {
      success: true,
      schedules: generatedSchedules
    }
  },

  async registerCourse (userId: string, course: CourseInfo) {
    return await CourseRepository.addCourse({ ...course, userId })
  },

  async getCourses (userId: string) {
    const courses = await CourseRepository.getCourses(userId)

    return courses && courses.length > 0 ? courses : []
  },

  async getCourse (userId: string, params: CourseParamsInfo) {
    const course = await CourseRepository.getCourse({ userId, ...params })
    if (!course) {
      throw new NotFoundError('Course not found')
    }

    return course
  },

  async updateCourse (userId: string, params: CourseParamsInfo, updates: CourseUpdateInfo) {
    const updatedCourse = await CourseRepository.updateCourse({ userId, ...params }, updates)
    if (!updatedCourse) {
      throw new NotFoundError('Course not found')
    }

    return updatedCourse
  },

  async deleteCourse (userId: string, params: CourseParamsInfo) {
    const deletedCourse = await CourseRepository.deleteCourse({ userId, ...params })
    if (!deletedCourse) {
      throw new NotFoundError('Course not found or already deleted')
    }

    return params
  }
}
