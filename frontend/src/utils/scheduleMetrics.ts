import type { Day, TimeBlock } from '@/types'

interface StoredGroup {
  name: string
  schedule: { day: Day; active: boolean; timeBlocks: TimeBlock[] }[]
}

interface StoredCourse {
  courseName: string
  color: string
  group: StoredGroup
}

/** Convert "HH:MM" to minutes since midnight. */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Collect all time blocks for a given day across every course in the schedule,
 * sorted by start time in minutes.
 */
function collectDayBlocks(
  schedule: StoredCourse[],
  day: Day
): { start: number; end: number }[] {
  const blocks: { start: number; end: number }[] = []
  for (const course of schedule) {
    for (const ds of course.group.schedule) {
      if (ds.day !== day || !ds.active) continue
      for (const tb of ds.timeBlocks) {
        blocks.push({ start: toMinutes(tb.start), end: toMinutes(tb.end) })
      }
    }
  }
  return blocks.sort((a, b) => a.start - b.start)
}

const DAYS: Day[] = ['L', 'K', 'M', 'J', 'V', 'S', 'D']

/**
 * Total gap MINUTES across all days for a schedule.
 * Used by the "leastGaps" filter.
 */
export function totalGapMinutes(schedule: StoredCourse[]): number {
  let total = 0
  for (const day of DAYS) {
    const blocks = collectDayBlocks(schedule, day)
    for (let i = 1; i < blocks.length; i++) {
      const gap = blocks[i].start - blocks[i - 1].end
      if (gap > 0) total += gap
    }
  }
  return total
}

/**
 * Total number of gaps (any break > 0 min) across all days.
 * Used by the "consecutiveClasses" filter.
 */
export function totalGapCount(schedule: StoredCourse[]): number {
  let count = 0
  for (const day of DAYS) {
    const blocks = collectDayBlocks(schedule, day)
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].start - blocks[i - 1].end > 0) count++
    }
  }
  return count
}
