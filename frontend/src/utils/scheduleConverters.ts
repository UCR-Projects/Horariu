import { DAYS } from '@/utils/constants'
import { Schedule } from '@/types'

/**
 * Creates an empty schedule with all days inactive.
 * Used when initializing a new group form.
 */
export function createEmptyFormSchedule(): Schedule {
  return DAYS.map((day) => ({
    day,
    active: false,
    timeBlocks: [],
  }))
}
