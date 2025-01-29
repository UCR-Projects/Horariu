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

    async getCourses({ user_id }) {
        const [courses] = await this.db.query(
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

	async getCourse({ user_id, course_name, day, start_time }) {
        const [course] = await this.db.query(
            `SELECT course_name, day, start_time, end_time, course_code, classroom, building
             FROM user_courses
             WHERE user_id = ? AND course_name = ? AND day = ? AND start_time = ?`,
            [user_id, course_name, day, start_time]
        )
        return course[0] || null
    }

	async updateCourse(identifiers, updates) {
		const { user_id, course_name, day, start_time } = identifiers

		if (Object.keys(updates).length === 0) {
			throw new Error("No fields provided for update")
		}

		const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ")
	
    	const values = Object.values(updates)

		try {
			const [result] = await this.db.query(
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
			console.error(`[updateCourse]: Error updating course`, error)
			throw error
		}
    }

    async deleteCourse(identifiers) {
        const { user_id, course_name, day, start_time } = identifiers
    
        try {
            const [result] = await this.db.query(
                `DELETE FROM user_courses
                 WHERE user_id = ? AND course_name = ? AND day = ? AND start_time = ?`,
                [user_id, course_name, day, start_time]
            )
    
            return result.affectedRows > 0
        } catch (error) {
            console.error("[deleteCourse]: Error deleting course", error)
            throw error
        }
    }
}
  