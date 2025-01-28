export class CourseModel {
    constructor(db) {
      this.db = db
    }
  
    async addCourse({ user_id, course_name, day, start_time, end_time, course_code = null, classroom = null, building = null }) {
      try {
        await this.db.query('START TRANSACTION')
  
        await this.db.query(
          `INSERT INTO user_courses (id, user_id, course_name, day, start_time, end_time, course_code, classroom, building) 
          VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)`,
          [user_id, course_name, day, start_time, end_time, course_code, classroom, building]
        )
  
        await this.db.query('COMMIT')
  
        return { message: 'Course added successfully', course: { user_id, course_name, day, start_time, end_time, course_code, classroom, building } }
      } catch (error) {
        await this.db.query('ROLLBACK')
        throw error
      }
    }
  }
  