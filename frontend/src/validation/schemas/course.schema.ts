import { z } from 'zod'
import useCourseStore from '@/stores/useCourseStore'
import { validMsgs } from '@/validation/validationMessages'
import { DAYS } from '@/utils/constants'
import { Day } from '@/types'

export const scheduleItemSchema = z.object({
  day: z.enum(DAYS as [Day, ...Day[]]),
  active: z.boolean(),
  startTime: z.string(),
  endTime: z.string(),
})

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
          // if editing and the name didn't change, it's valid
          if (currentGroupName && name === currentGroupName) {
            return true
          }
          // if not, check if it's unique
          return !existingGroups.includes(name)
        },
        { message: validMsgs.group.name.unique }
      ),
    schedules: z
      .array(scheduleItemSchema)
      // Check if at least one day is active
      .refine((schedules) => schedules.some((s) => s.active), {
        message: validMsgs.group.schedule.required,
      })
      // Check if all active schedules have a valid time range
      .refine(
        (schedules) =>
          !schedules
            .filter((s) => s.active)
            .some((s) => s.startTime === '----' || s.endTime === '----'),
        { message: validMsgs.group.schedule.timeRange }
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

          // if editing and the name didn't change, it's valid
          if (currentCourseName && name === currentCourseName) {
            return true
          }

          // if not, check if it's unique
          return courses.every((course) => course.name !== name)
        },
        { message: validMsgs.course.name.unique }
      ),
    color: z.string(),
    groups: z
      .array(
        z.object({
          name: z.string(),
          schedule: z.array(scheduleItemSchema),
        })
      )
      .nonempty({ message: validMsgs.course.groupRequired }),
  })

export type GroupFormValuesType = z.infer<ReturnType<typeof createGroupSchema>>
export type CourseFormValuesType = z.infer<
  ReturnType<typeof createCourseSchema>
>
