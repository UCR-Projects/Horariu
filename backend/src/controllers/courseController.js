import { validateCourse, validateUpdateCourse, validateCourseParams } from "../schemas/course.schema.js"
import { validateUserId } from "../schemas/user.schema.js"

export class CourseController {
    constructor({ courseModel }) {
        this.courseModel = courseModel
    }

    registerCourse = async (req, res) => {
        try {
            const courseValid = await validateCourse(req.body)
            if (!courseValid.success) {
                return res.status(422).json({ errors: JSON.parse(courseValid.error.message) })
            }
            if (!req.user || !req.user.user_id) {
                return res.status(401).json({ message: 'User ID is missing from authentication' })
            }
            const courseData = { ...courseValid.data, user_id: req.user.user_id }
            const newCourse = await this.courseModel.addCourse(courseData)

            if (newCourse.error) {
                return res.status(409).json({ message: newCourse.error })
            }

            return res.status(201).json({ message: 'Course registered successfully', newCourse })
        } catch (error) {
            console.error('[registerCourse]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    getCourses = async (req, res) => {
        try {
            const userValid = await validateUserId(req.user)
            if (!userValid.success) {
                return res.status(422).json({ errors: JSON.parse(userValid.error.message) })
            }

            const { user_id } = userValid.data
            const courses = await this.courseModel.getCourses({ user_id: user_id })

            if (!courses || courses.length === 0) {
                return res.status(200).json({
                    message: "No courses found for this user",
                    courses: []
                })
            }
            return res.status(200).json({
                message: "Courses retrieved successfully",
                courses
            })
        } catch (error) {
            console.error('[getCourses]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    getCourse = async (req, res) => {
        try {
            const paramResult = await validateCourseParams(req.params)
            if (!paramResult.success) {
                return res.status(400).json({ errors: JSON.parse(paramResult.error.message) })
            }
            const { course_name, day, start_time } = paramResult.data
            const userValid = await validateUserId(req.user)
            if (!userValid.success) {
                return res.status(422).json({ errors: JSON.parse(userValid.error.message) })
            }
            const { user_id } = userValid.data
            const course = await this.courseModel.getCourse({ user_id: user_id, course_name: course_name, day: day, start_time: start_time })
            if (!course) {
                return res.status(404).json({ message: 'User course not found' })
            }
            return res.status(200).json({
                message: "Course retrieved successfully",
                course
            })
        } catch (error) {
            console.error('[getCourse]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    updateCourse = async (req, res) => {
        try {
            const paramResult = await validateCourseParams(req.params)
            if (!paramResult.success) {
                return res.status(400).json({ errors: JSON.parse(paramResult.error.message) })
            }
            const { course_name, day, start_time } = paramResult.data

            const userValid = await validateUserId(req.user)
            if (!userValid.success) {
                return res.status(401).json({ message: "Unauthorized user" })
            }
            const { user_id } = userValid.data

            const updateValid = await validateUpdateCourse(req.body)
            if (!updateValid.success) {
                return res.status(422).json({ errors: JSON.parse(updateValid.error.message) })
            }
            const updateData = updateValid.data

            const updatedCourse = await this.courseModel.updateCourse({ user_id, course_name, day, start_time }, updateData)
            if (!updatedCourse) {
                return res.status(404).json({ message: 'User course not found' })
            }

            const updatedFieldsMessage = Object.keys(updateData)
                .map((field) => `${field} updated successfully`)
                .join(", ")

            return res.status(200).json({
                message: updatedFieldsMessage,
                data: {
                    course_name,
                    day,
                    start_time,
                    ...updateData
                }
            })
        } catch (error) {
            console.error('[updateCourse]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    deleteCourse = async (req, res) => {
        try {
            const paramResult = await validateCourseParams(req.params)
            if (!paramResult.success) {
                return res.status(400).json({ errors: JSON.parse(paramResult.error.message) })
            }
            const { course_name, day, start_time } = paramResult.data
            const userValid = await validateUserId(req.user)
            if (!userValid.success) {
                return res.status(401).json({ message: "Unauthorized user" })
            }
            const { user_id } = userValid.data
            const deletedCourse = await this.courseModel.deleteCourse({ user_id, course_name, day, start_time })
            if (!deletedCourse) {
                return res.status(404).json({ message: 'Course not found or already deleted' })
            }

            return res.status(200).json({
                message: "Course deleted successfully",
                deleted_course: {
                    course_name,
                    day,
                    start_time
                }
            })
        } catch (error) {
            console.error('[deleteCourse]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}