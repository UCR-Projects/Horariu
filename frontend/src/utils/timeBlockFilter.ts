import { Course, Day, TimeRange } from '@/types'
import { TIME_RANGES } from './constants'

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function groupConflictsWithBlockedCells(
  group: Course['groups'][number],
  blockedCells: Map<string, { hour: TimeRange; day: Day }>
): boolean {
  for (const daySchedule of group.schedule) {
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

export function filterCoursesByBlockedCells(
  courses: Course[],
  blockedCells: Map<string, { hour: TimeRange; day: Day }>
): { filteredCourses: Course[]; removedGroupsCount: number } {
  if (blockedCells.size === 0) return { filteredCourses: courses, removedGroupsCount: 0 }

  let removedGroupsCount = 0

  const filteredCourses = courses
    .map((course) => {
      const validGroups = course.groups.filter((group) => {
        if (groupConflictsWithBlockedCells(group, blockedCells)) {
          removedGroupsCount++
          return false
        }
        return true
      })
      return { ...course, groups: validGroups }
    })
    .filter((course) => course.groups.length > 0)

  return { filteredCourses, removedGroupsCount }
}
