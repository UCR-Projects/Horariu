import { z } from 'zod'
import useCourseStore from '@/stores/useCourseStore'
import { validMsgs } from '@/validation/validationMessages'
import { DAYS } from '@/utils/constants'
import { Day } from '@/types'

const isCourseNameUnique = (courseName: string) => {
  const courses = useCourseStore.getState().courses

  return courses.every((course) => course.name !== courseName)
}

export const courseSchema = z.object({
  courseName: z
    .string()
    .nonempty({ message: validMsgs.course.name.required })
    .min(2, { message: validMsgs.course.name.min })
    .max(50, { message: validMsgs.course.name.max })
    .refine(isCourseNameUnique, { message: validMsgs.course.name.unique }),
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
