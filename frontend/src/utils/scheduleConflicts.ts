import { Group } from '@/types'

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Check if two time blocks overlap
 */
export function timeBlocksOverlap(
  block1: { start: string; end: string },
  block2: { start: string; end: string }
): boolean {
  const start1 = toMinutes(block1.start)
  const end1 = toMinutes(block1.end)
  const start2 = toMinutes(block2.start)
  const end2 = toMinutes(block2.end)

  return start1 < end2 && start2 < end1
}

/**
 * Check if two groups have schedule conflicts
 */
export function groupsHaveConflict(group1: Group, group2: Group): boolean {
  for (const day1 of group1.schedule) {
    if (!day1.active || day1.timeBlocks.length === 0) continue

    for (const day2 of group2.schedule) {
      if (!day2.active || day2.timeBlocks.length === 0) continue
      if (day1.day !== day2.day) continue

      // Same day - check time blocks
      for (const block1 of day1.timeBlocks) {
        for (const block2 of day2.timeBlocks) {
          if (timeBlocksOverlap(block1, block2)) {
            return true
          }
        }
      }
    }
  }
  return false
}

