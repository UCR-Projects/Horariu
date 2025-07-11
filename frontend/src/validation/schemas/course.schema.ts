import { z } from 'zod'
import useCourseStore from '@/stores/useCourseStore'
import { validMsgs } from '@/validation/validationMessages'
import { DAYS } from '@/utils/constants'
import { Day } from '@/types'

export const dayScheduleSchema = z.object({
  day: z.enum(DAYS as [Day, ...Day[]]),
  active: z.boolean(),
  timeBlocks: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .default([]),
})

// Helper function to convert time string to minutes
const timeToMinutes = (time: string): number => {
  if (time === '----') return -1
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Function to check if there are overlapping time blocks
const hasTimeOverlap = (blocks: { start: string; end: string }[]): boolean => {
  // Filter and convert time blocks to minutes
  const validBlocks = blocks
    .filter((block) => block.start !== '----' && block.end !== '----')
    .map((block) => ({
      start: timeToMinutes(block.start),
      end: timeToMinutes(block.end),
    }))
    .sort((a, b) => a.start - b.start) // Sort by start time

  // Check for overlaps
  for (let i = 0; i < validBlocks.length - 1; i++) {
    const current = validBlocks[i]
    const next = validBlocks[i + 1]

    // If the current block ends after the next block starts, there's an overlap
    if (current.end > next.start) {
      return true
    }
  }

  return false
}

export const createGroupSchema = (
  existingGroups: string[] = [],
  currentGroupName?: string
) =>
  z.object({
    groupName: z
      .string()
      .nonempty({ message: validMsgs.group.name.required })
      .min(1, { message: validMsgs.group.name.min })
      .max(25, { message: validMsgs.group.name.max })
      .refine(
        (name) => {
          // If editing and the name didn't change, it's valid
          if (currentGroupName && name === currentGroupName) {
            return true
          }
          // If not, check if it's unique
          return !existingGroups.includes(name)
        },
        { message: validMsgs.group.name.unique }
      ),
    schedules: z
      .array(dayScheduleSchema)
      // Check if at least one day is active
      .refine((schedules) => schedules.some((s) => s.active), {
        message: validMsgs.group.schedule.required,
      })
      // Check if all time blocks have valid times (not '----')
      .refine(
        (schedules) =>
          !schedules
            .filter((s) => s.active)
            .some((s) =>
              s.timeBlocks.some(
                (block) => block.start === '----' || block.end === '----'
              )
            ),
        { message: validMsgs.group.schedule.timeRange }
      )
      // Check for time overlaps within each day
      .refine(
        (schedules) => {
          const activeDays = schedules.filter((s) => s.active)

          for (const daySchedule of activeDays) {
            if (hasTimeOverlap(daySchedule.timeBlocks)) {
              return false
            }
          }

          return true
        },
        { message: validMsgs.group.schedule.overlap }
      ),
  })

export const createCourseSchema = (currentCourseName?: string) =>
  z.object({
    courseName: z
      .string()
      .nonempty({ message: validMsgs.course.name.required })
      .min(1, { message: validMsgs.course.name.min })
      .max(30, { message: validMsgs.course.name.max })
      .refine(
        (name) => {
          const courses = useCourseStore.getState().courses

          // If editing and the name didn't change, it's valid
          if (currentCourseName && name === currentCourseName) {
            return true
          }

          // If not, check if it's unique
          return courses.every((course) => course.name !== name)
        },
        { message: validMsgs.course.name.unique }
      ),
    color: z.string(),
    groups: z
      .array(
        z.object({
          name: z.string(),
          schedule: z.array(dayScheduleSchema),
          isActive: z.boolean().default(true),
        })
      )
      .nonempty({ message: validMsgs.course.groupRequired }),
  })

export type GroupFormValuesType = z.infer<ReturnType<typeof createGroupSchema>>
export type CourseFormValuesType = z.infer<
  ReturnType<typeof createCourseSchema>
>
