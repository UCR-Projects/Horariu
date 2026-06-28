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
 * Merge a day's (start-sorted) blocks into maximal consecutive segments.
 * Blocks that touch or overlap (next.start <= current end) collapse into a
 * single segment, so back-to-back classes count as one continuous run and
 * contained/overlapping blocks never produce phantom gaps.
 */
function mergeDayBlocks(
  blocks: { start: number; end: number }[]
): { start: number; end: number }[] {
  const merged: { start: number; end: number }[] = []
  for (const block of blocks) {
    const last = merged[merged.length - 1]
    if (last && block.start <= last.end) {
      last.end = Math.max(last.end, block.end)
    } else {
      merged.push({ ...block })
    }
  }
  return merged
}

/**
 * Total gap MINUTES across all days for a schedule.
 * Used by the "leastGaps" filter.
 */
export function totalGapMinutes(schedule: StoredCourse[]): number {
  let total = 0
  for (const day of DAYS) {
    const merged = mergeDayBlocks(collectDayBlocks(schedule, day))
    for (let i = 1; i < merged.length; i++) {
      total += merged[i].start - merged[i - 1].end
    }
  }
  return total
}

/**
 * Total number of gaps (breaks between non-adjacent classes) across all days.
 */
export function totalGapCount(schedule: StoredCourse[]): number {
  let count = 0
  for (const day of DAYS) {
    const merged = mergeDayBlocks(collectDayBlocks(schedule, day))
    count += Math.max(0, merged.length - 1)
  }
  return count
}

/**
 * Number of distinct class segments (maximal consecutive runs) across all days.
 * Each day with classes contributes at least one segment, and every gap adds
 * one more. Minimizing this favors back-to-back classes packed into as few days
 * as possible. Used by the "consecutiveClasses" filter.
 */
export function classSegmentCount(schedule: StoredCourse[]): number {
  let segments = 0
  for (const day of DAYS) {
    segments += mergeDayBlocks(collectDayBlocks(schedule, day)).length
  }
  return segments
}

/**
 * Latest class end across the whole week, in minutes since midnight.
 * Minimizing this favors schedules that finish earlier. Returns 0 for an
 * empty schedule. Used by the "earlyFinish" filter.
 */
export function latestClassEnd(schedule: StoredCourse[]): number {
  let latest = 0
  for (const day of DAYS) {
    for (const block of collectDayBlocks(schedule, day)) {
      if (block.end > latest) latest = block.end
    }
  }
  return latest
}

/**
 * Earliest class start across the whole week, in minutes since midnight.
 * Maximizing this favors schedules that start later. Returns 0 for an empty
 * schedule. Used by the "lateStart" filter.
 */
export function earliestClassStart(schedule: StoredCourse[]): number {
  let earliest = Infinity
  for (const day of DAYS) {
    for (const block of collectDayBlocks(schedule, day)) {
      if (block.start < earliest) earliest = block.start
    }
  }
  return earliest === Infinity ? 0 : earliest
}
