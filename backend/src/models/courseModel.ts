import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise'

interface CourseData {
  user_id: string
  course_name: string
  day: string
  start_time: string
  end_time: string
  course_code?: string | null
  classroom?: string | null
  building?: string | null
}

interface CourseIdentifiers {
  user_id: string
  course_name: string
  day: string
  start_time: string
}

interface CourseRecord extends RowDataPacket {
  course_name: string
  day: string
  start_time: string
  end_time: string
  course_code?: string
  classroom?: string
  building?: string
}

export class CourseModel {
  private db: Pool

  constructor (db: Pool) {
    this.db = db
  }

  async addCourse (courseData: CourseData): Promise<{ message: string; course: Partial<CourseData> } | { error: string }> {
    try {
      await this.db.query('START TRANSACTION')

      await this.db.query(
          `INSERT INTO user_courses (user_id, course_name, day, start_time, end_time, course_code, classroom, building) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            courseData.user_id,
            courseData.course_name,
            courseData.day,
            courseData.start_time,
            courseData.end_time,
            courseData.course_code ?? null,
            courseData.classroom ?? null,
            courseData.building ?? null
          ]
      )

      await this.db.query('COMMIT')

      return {
        message: 'Course added successfully',
        course:
            {
              course_name: courseData.course_name,
              day: courseData.day,
              start_time: courseData.start_time,
              end_time: courseData.end_time
            }
      }
    } catch (error) {
      await this.db.query('ROLLBACK')
      if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
        if (error.code === 'ER_DUP_ENTRY') {
          return { error: `You already have "${courseData.course_name}" scheduled on ${courseData.day} at ${courseData.start_time}.` }
        }
      }
      throw error
    }
  }

  async getCourses ({ user_id }: { user_id: string }): Promise<CourseRecord[] | null> {
    const [courses] = await this.db.query<CourseRecord[]>(
            `SELECT course_name, day, start_time, end_time, course_code, classroom, building
             FROM user_courses
             WHERE user_id = ?`,
            [user_id]
    )
    if (courses.length === 0) {
      return null
    }
    return courses
  }

  async getCourse (identifiers: CourseIdentifiers): Promise<CourseRecord | null> {
    const { user_id, course_name, day, start_time } = identifiers
    const [course] = await this.db.query<CourseRecord[]>(
            `SELECT course_name, day, start_time, end_time, course_code, classroom, building
             FROM user_courses
             WHERE user_id = ? AND course_name = ? AND day = ? AND start_time = ?`,
            [user_id, course_name, day, start_time]
    )
    return course[0] || null
  }

  async updateCourse (identifiers: CourseIdentifiers, updates: Partial<CourseData>): Promise<Partial<CourseData> | null> {
    const { user_id, course_name, day, start_time } = identifiers

    if (Object.keys(updates).length === 0) {
      throw new Error('No fields provided for update')
    }

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ')
    const values = Object.values(updates)

    try {
      const [result] = await this.db.query<ResultSetHeader>(
        `UPDATE user_courses
         SET ${fields}
         WHERE user_id = ? AND course_name = ? AND day = ? AND start_time = ?`,
        [...values, user_id, course_name, day, start_time]
      )
      if (result.affectedRows === 0) {
        return null
      }
      return { course_name, day, start_time, ...updates }
    } catch (error) {
      console.error('[updateCourse]: Error updating course', error)
      throw error
    }
  }

  async deleteCourse (identifiers: CourseIdentifiers): Promise<boolean> {
    const { user_id, course_name, day, start_time } = identifiers

    try {
      const [result] = await this.db.query<ResultSetHeader>(
                `DELETE FROM user_courses
                 WHERE user_id = ? AND course_name = ? AND day = ? AND start_time = ?`,
                [user_id, course_name, day, start_time]
      )

      return result.affectedRows > 0
    } catch (error) {
      console.error('[deleteCourse]: Error deleting course', error)
      throw error
    }
  }
}
