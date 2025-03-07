import { z } from 'zod'
import useCourseStore from '@/stores/useCourseStore'
import { validMsgs } from '@/validation/validationMessages'
import { DAYS } from '@/utils/constants'
import { Day } from '@/types'

export const courseSchema = (currentCourseName?: string) =>
  z.object({
    courseName: z
      .string()
      .nonempty({ message: validMsgs.course.name.required })
      .min(2, { message: validMsgs.course.name.min })
      .max(50, { message: validMsgs.course.name.max })
      .refine(
        (name) => {
          const courses = useCourseStore.getState().courses
          // if is editing
          if (currentCourseName && name === currentCourseName) {
            return true
          }

          // Check if the name exists among other courses
          return courses.every((course) => course.name !== name)
        },
        { message: validMsgs.course.name.unique }
      ),
  })

export const groupSchema = z.object({
  groupName: z
    .string()
    .nonempty({ message: validMsgs.group.name.required })
    .min(2, { message: validMsgs.group.name.min })
    .max(10, { message: validMsgs.group.name.max }),
  schedule: z.array(
    z.object({
      day: z.enum(DAYS as [Day, ...Day[]]),
      active: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
})
