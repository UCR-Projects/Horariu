import { DAYS } from '@/utils/constants'
import { Schedule, Day } from '@/types'
import { CourseFormValuesType } from '@/validation/schemas/course.schema'

type FormSchedule = CourseFormValuesType['groups'][0]['schedule']
type FormDaySchedule = FormSchedule[0]

/**
 * Converts API schedule format to form format.
 * API format: { monday: [{start, end}], tuesday: [{start, end}] }
 * Form format: [{ day: 'monday', active: true, timeBlocks: [{start, end}] }, ...]
 */
export function convertScheduleToFormFormat(schedule: Schedule): FormSchedule {
  return DAYS.map((day) => {
    const daySchedule = schedule[day]
    return {
      day,
      active: !!daySchedule && daySchedule.length > 0,
      timeBlocks: daySchedule || [],
    }
  })
}

/**
 * Converts form schedule format to API format.
 * Form format: [{ day: 'monday', active: true, timeBlocks: [{start, end}] }, ...]
 * API format: { monday: [{start, end}], tuesday: [{start, end}] }
 */
export function convertFormFormatToSchedule(schedules: FormSchedule): Schedule {
  return schedules
    .filter((s) => s.active && s.timeBlocks.length > 0)
    .reduce((acc, curr) => {
      acc[curr.day] = curr.timeBlocks
      return acc
    }, {} as Schedule)
}

/**
 * Creates an empty form schedule with all days inactive.
 */
export function createEmptyFormSchedule(): FormSchedule {
  return DAYS.map((day) => ({
    day,
    active: false,
    timeBlocks: [],
  }))
}

/**
 * Converts a group's schedule from form format to the format expected by the store.
 */
export function convertGroupScheduleForSubmit(
  schedule: FormSchedule
): Array<FormDaySchedule> {
  return schedule.map((s) => ({
    day: s.day as Day,
    active: s.active,
    timeBlocks: s.active ? s.timeBlocks : [],
  }))
}

