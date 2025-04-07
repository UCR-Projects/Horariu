import { db } from '../database/database'
import { courses } from '../database/schema/courses'
import { eq, and } from 'drizzle-orm'
import { validateCourseDetails } from '../schemas/course.schema'
import { IAddCourseData, ICourseData, ICourseIdentifiers } from '../interfaces/ICourseData'
import { InternalServerError, ConflictError } from '../utils/customsErrors'

function isDatabaseError (error: unknown): error is { code?: string; message: string } {
  return typeof error === 'object' &&
         error !== null &&
         'message' in error &&
         typeof (error as Record<string, unknown>).message === 'string'
}

export const CourseRepository = {
  async addCourse (courseData: IAddCourseData): Promise<ICourseData> {
    try {
      const newCourse = await db.insert(courses).values({
        userId: courseData.userId,
        courseName: courseData.courseName,
        day: courseData.day,
        startTime: courseData.startTime,
        endTime: courseData.endTime,
        groupNumber: courseData.groupNumber,
        courseDetails: courseData.courseDetails ?? {}
      }).returning()

      return {
        ...newCourse[0],
        courseDetails: await validateCourseDetails(newCourse[0].courseDetails)
      }
    } catch (error: unknown) {
      console.error('[CourseRepository.addCourse]', error)

      if (isDatabaseError(error)) {
        if (error.code === '23505' || error.message.includes('duplicate')) {
          throw new ConflictError('Course already exists')
        }
      }

      throw new InternalServerError('Database error while inserting course')
    }
  },

  async getCourses (userId: string): Promise<ICourseData[]> {
    const allCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, userId))

    if (allCourses.length === 0) return []

    return await Promise.all(
      allCourses.map(async (course) => {
        const validatedDetails = await validateCourseDetails(course.courseDetails)

        return {
          ...course,
          courseDetails: validatedDetails
        }
      })
    )
  },

  async getCourse (identifiers: ICourseIdentifiers): Promise<ICourseData | null> {
    const course = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.userId, identifiers.userId),
          eq(courses.courseName, identifiers.courseName),
          eq(courses.day, identifiers.day),
          eq(courses.startTime, identifiers.startTime),
          eq(courses.groupNumber, identifiers.groupNumber)
        )
      )

    if (course.length === 0) return null

    const validatedDetails = await validateCourseDetails(course[0].courseDetails)

    return {
      ...course[0],
      courseDetails: validatedDetails
    }
  },

  // TODO: Optimize to use only one query? Make sure to update only the fields that 'updates' has. PD: courseDetails is a JSON object
  async updateCourse (
    identifiers: ICourseIdentifiers,
    updates: Partial<ICourseData>
  ): Promise<Partial<ICourseData> | null> {
    if (Object.keys(updates).length === 0) {
      throw new Error('No fields provided for update')
    }

    if (updates.courseDetails) {
      const existingCourse = await db
        .select({ courseDetails: courses.courseDetails })
        .from(courses)
        .where(
          and(
            eq(courses.userId, identifiers.userId),
            eq(courses.courseName, identifiers.courseName),
            eq(courses.day, identifiers.day),
            eq(courses.startTime, identifiers.startTime),
            eq(courses.groupNumber, identifiers.groupNumber)
          )
        )

      if (existingCourse.length === 0) return null

      const validatedExistingDetails = await validateCourseDetails(existingCourse[0].courseDetails)

      updates.courseDetails = {
        ...validatedExistingDetails,
        ...updates.courseDetails
      }
    }

    const updatedCourse = await db
      .update(courses)
      .set(updates)
      .where(
        and(
          eq(courses.userId, identifiers.userId),
          eq(courses.courseName, identifiers.courseName),
          eq(courses.day, identifiers.day),
          eq(courses.startTime, identifiers.startTime),
          eq(courses.groupNumber, identifiers.groupNumber)
        )
      )
      .returning()

    if (updatedCourse.length === 0) return null

    return {
      ...updatedCourse[0],
      courseDetails: await validateCourseDetails(updatedCourse[0].courseDetails)
    }
  },

  async deleteCourse (identifiers: ICourseIdentifiers): Promise<boolean> {
    const result = await db
      .delete(courses)
      .where(
        and(
          eq(courses.userId, identifiers.userId),
          eq(courses.courseName, identifiers.courseName),
          eq(courses.day, identifiers.day),
          eq(courses.startTime, identifiers.startTime),
          eq(courses.groupNumber, identifiers.groupNumber)
        )
      )
      .returning()

    return result.length > 0
  }
}
