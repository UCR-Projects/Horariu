import { DaySchedule, Day, TimeRange } from '@/types'
import { StoredCourse } from '@/stores/useScheduleStore'
import { TIME_RANGES } from './constants'

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function daySchedulesOverlapBlockedCells(
  daySchedules: DaySchedule[],
  blockedCells: Map<string, { hour: TimeRange; day: Day }>
): boolean {
  for (const daySchedule of daySchedules) {
    if (!daySchedule.active || daySchedule.timeBlocks.length === 0) continue

    for (const timeBlock of daySchedule.timeBlocks) {
      const blockStart = toMinutes(timeBlock.start)
      const blockEnd = toMinutes(timeBlock.end)

      for (const range of TIME_RANGES) {
        const key = `${range}-${daySchedule.day}`
        if (!blockedCells.has(key)) continue

        const [rangeStart, rangeEnd] = range.split(' - ')
        const rangeStartMin = toMinutes(rangeStart)
        const rangeEndMin = toMinutes(rangeEnd)

        if (blockStart < rangeEndMin && rangeStartMin < blockEnd) {
          return true
        }
      }
    }
  }
  return false
}

export function storedScheduleConflictsWithBlockedCells(
  schedule: StoredCourse[],
  blockedCells: Map<string, { hour: TimeRange; day: Day }>
): boolean {
  if (blockedCells.size === 0) return false

  return schedule.some((course) =>
    daySchedulesOverlapBlockedCells(course.group.schedule, blockedCells)
  )
}
