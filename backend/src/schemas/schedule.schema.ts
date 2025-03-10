import { z } from 'zod'

export const timeSlotSchema = z.object({
  start: z.string().regex(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, 'Start time must be in HH:mm format'),
  end: z.string().regex(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, 'End time must be in HH:mm format')
})

export const scheduleSchema = z
  .object({})
  .catchall(timeSlotSchema)
  .refine(schedule => Object.keys(schedule).length > 0, {
    message: 'At least one schedule entry is required'
  })
  .refine(schedule => Object.keys(schedule).every(day => ['L', 'K', 'M', 'J', 'V', 'S', 'D'].includes(day)), {
    message: 'Invalid day key found. Allowed values: L, K, M, J, V, S, D'
  })

export const groupSchema = z.object({
  name: z.string().min(1, 'Group name cannot be empty'),
  schedule: scheduleSchema
})

export const courseSchema = z.object({
  name: z.string().min(1, 'Course name cannot be empty'),
  color: z.string().min(1, 'Color cannot be empty'),
  groups: z.array(groupSchema).min(1, 'Each course must have at least one group')
})

export const generateScheduleSchema = z.array(courseSchema).min(1, 'Must provide at least one course')

const courseAndGroupSchema = z.object({
  courseName: z.string().min(1, 'Course name cannot be empty'),
  color: z.string().min(1, 'Color cannot be empty'),
  group: groupSchema
})

export const currentScheduleSchema = z.array(courseAndGroupSchema)

export const allCoursesSchema = z.array(
  z.object({
    courseName: z.string().min(1, 'Course name cannot be empty'),
    color: z.string().min(1, 'Color cannot be empty'),
    group: groupSchema
  })
)

export async function validateCourses (courses: unknown) {
  return generateScheduleSchema.safeParseAsync(courses)
}

export type TimeSlot = z.infer<typeof timeSlotSchema>

export type Group = z.infer<typeof groupSchema>

export type GenerateScheduleInfo = z.infer<typeof generateScheduleSchema>

export type CurrentSchedule = z.infer<typeof currentScheduleSchema>

export type AllCourses = z.infer<typeof allCoursesSchema>
