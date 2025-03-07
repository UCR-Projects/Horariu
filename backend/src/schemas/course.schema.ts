import { z } from 'zod'

export const courseDetailsSchema = z.object({
  professor: z.string().optional(),
  courseCode: z.string().max(20, 'Course code cannot exceed 20 characters').optional(),
  classroom: z.string().max(50, 'Classroom cannot exceed 50 characters').optional(),
  building: z.string().max(50, 'Building cannot exceed 50 characters').optional()
}).strict()

export const courseSchema = z.object({
  courseName: z.string({
    invalid_type_error: 'Course name must be a string',
    required_error: 'Course name is required'
  }).min(1, 'Course name cannot be empty').max(255, 'Course name cannot exceed 255 characters'),
  day: z.enum(['L', 'K', 'M', 'J', 'V', 'S', 'D'], {
    invalid_type_error: 'Day must be one of: L, K, M, J, V, S, D',
    required_error: 'Day is required'
  }),

  startTime: z.string({
    invalid_type_error: 'Start time must be a string',
    required_error: 'Start time is required'
  }).regex(
    /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    'Start time must be in the format HH:mm:ss'
  ),

  endTime: z.string({
    invalid_type_error: 'End time must be a string',
    required_error: 'End time is required'
  }).regex(
    /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    'End time must be in the format HH:mm:ss'
  ),

  groupNumber: z.number({
    invalid_type_error: 'Group number must be a number'
  }).min(1, 'Group number must be at least 1'),

  courseDetails: courseDetailsSchema.optional()
})

export const courseParamsSchema = z.object({
  courseName: z.string().min(1, 'Course name cannot be empty'),
  day: z.enum(['L', 'K', 'M', 'J', 'V', 'S', 'D']),
  startTime: z.string().regex(
    /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    'Start time must be in the format HH:mm:ss'
  ),
  groupNumber: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, 'Group number must be at least 1')
  )
})

export const updateCourseSchema = courseSchema.partial()

export type CourseInfo = z.infer<typeof courseSchema>

export type CourseParamsInfo = z.infer<typeof courseParamsSchema>

export type CourseUpdateInfo = z.infer<typeof updateCourseSchema>

export async function validateCourse (course: unknown) {
  return courseSchema.safeParseAsync(course)
}

export async function validateUpdateCourse (course: unknown) {
  return updateCourseSchema.safeParseAsync(course)
}

export async function validateCourseParams (params: unknown) {
  return courseParamsSchema.safeParseAsync(params)
}

export async function validateCourseDetails (details: unknown) {
  if (typeof details !== 'object' || details === null) return {}
  const parsed = await courseDetailsSchema.safeParseAsync(details)
  return parsed.success ? parsed.data : {}
}
