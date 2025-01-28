export class CourseModel {
    constructor(db) {
      this.db = db
    }
  
    async addCourse({ user_id, course_name, day, start_time, end_time, course_code = null, classroom = null, building = null }) {
      try {
        await this.db.query('START TRANSACTION')
  
        await this.db.query(
          `INSERT INTO user_courses (user_id, course_name, day, start_time, end_time, course_code, classroom, building) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [user_id, course_name, day, start_time, end_time, course_code, classroom, building]
        )
  
        await this.db.query('COMMIT')
  
        return { message: 'Course added successfully', course: { course_name, day, start_time, end_time } }
      } catch (error) {
        await this.db.query('ROLLBACK')
        if (error.code === 'ER_DUP_ENTRY') {
          return { error: `You already have "${course_name}" already scheduled on ${day} at ${start_time}.` }
        }
        throw error
      }
    }
  }
  