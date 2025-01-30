import { z } from 'zod'

export const courseSchema = z.object({
  course_name: z.string({
    invalid_type_error: 'Course name must be a string',
    required_error: 'Course name is required',
  }).min(1, 'Course name cannot be empty').max(255, 'Course name cannot exceed 255 characters'),

  day: z.enum(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], {
    invalid_type_error: 'Day must be one of: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo',
    required_error: 'Day is required',
  }),

  start_time: z.string({
    invalid_type_error: 'Start time must be a string',
    required_error: 'Start time is required',
  }).regex(
    /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    'Start time must be in the format HH:mm:ss'
  ),

  end_time: z.string({
    invalid_type_error: 'End time must be a string',
    required_error: 'End time is required',
  }).regex(
    /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    'End time must be in the format HH:mm:ss'
  ),

  course_code: z.string({
    invalid_type_error: 'Course code must be a string',
  }).max(20, 'Course code cannot exceed 20 characters').optional(),

  classroom: z.string({
    invalid_type_error: 'Classroom must be a string',
  }).max(50, 'Classroom cannot exceed 50 characters').optional(),

  building: z.string({
    invalid_type_error: 'Building must be a string',
  }).max(50, 'Building cannot exceed 50 characters').optional(),
})

export const courseParamsSchema = z.object({
  course_name: z.string().min(1, "Course name cannot be empty"),
  day: z.enum(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]),
  start_time: z.string().regex(
      /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
      "Start time must be in the format HH:mm:ss"
  )
})

export const updateCourseSchema = courseSchema.partial()

export async function validateCourse(course: unknown) {
  return courseSchema.safeParseAsync(course)
}

export async function validateUpdateCourse(course: unknown) {
  return updateCourseSchema.safeParseAsync(course)
}

export async function validateCourseParams(params: unknown) {
  return courseParamsSchema.safeParseAsync(params)
}
