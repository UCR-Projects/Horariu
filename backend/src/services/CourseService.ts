import { CourseRepository } from '../repositories/courseRepository'
import { CourseInfo, CourseParamsInfo, CourseUpdateInfo } from '../schemas/course.schema'
import { GenerateScheduleInfo } from '../schemas/schedule.schema'
import { generateAllSchedules } from '../utils/scheduleUtils'

export const CourseService = {

  async generateSchedules (courses: GenerateScheduleInfo) {
    const generatedSchedules = generateAllSchedules(courses)
    return generatedSchedules
  },

  async registerCourse (userId: string, course: CourseInfo) {
    const newCourse = await CourseRepository.addCourse({ ...course, userId })

    if ('error' in newCourse) {
      throw new Error(newCourse.error as string)
    }

    return newCourse
  },

  async getCourses (userId: string) {
    const courses = await CourseRepository.getCourses(userId)

    return courses && courses.length > 0 ? courses : []
  },

  async getCourse (userId: string, params: CourseParamsInfo) {
    const course = await CourseRepository.getCourse({ userId, ...params })
    if (!course) {
      throw new Error('Course not found')
    }

    return course
  },

  async updateCourse (userId: string, params: CourseParamsInfo, updates: CourseUpdateInfo) {
    const updatedCourse = await CourseRepository.updateCourse({ userId, ...params }, updates)
    if (!updatedCourse) {
      throw new Error('Course not found')
    }

    return updatedCourse
  },

  async deleteCourse (userId: string, params: CourseParamsInfo) {
    const deletedCourse = await CourseRepository.deleteCourse({ userId, ...params })
    if (!deletedCourse) {
      throw new Error('Course not found or already deleted')
    }

    return params
  }
}
