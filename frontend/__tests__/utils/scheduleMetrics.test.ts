import { describe, it, expect } from 'vitest'
import {
  totalGapMinutes,
  totalGapCount,
  classSegmentCount,
  latestClassEnd,
  earliestClassStart,
} from '@/utils/scheduleMetrics'
import { DAYS } from '@/utils/constants'
import { Day, TimeBlock } from '@/types'

// Helper to create a StoredCourse with a simple day -> timeBlocks map
function makeCourse(
  name: string,
  dayBlocks: Partial<Record<Day, TimeBlock[]>>
) {
  return {
    courseName: name,
    color: '#000',
    group: {
      name: 'G1',
      schedule: DAYS.map((day) => ({
        day,
        active: !!dayBlocks[day],
        timeBlocks: dayBlocks[day] || [],
      })),
    },
  }
}

describe('scheduleMetrics', () => {
  describe('totalGapMinutes', () => {
    it('returns 0 for a single class', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
      ]
      expect(totalGapMinutes(schedule)).toBe(0)
    })

    it('returns 0 for consecutive classes (no gap)', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
      ]
      expect(totalGapMinutes(schedule)).toBe(0)
    })

    it('computes gap between two classes on the same day', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '10:00', end: '11:00' }] }),
      ]
      // 60-minute gap between 09:00 and 10:00
      expect(totalGapMinutes(schedule)).toBe(60)
    })

    it('sums gaps across multiple days', () => {
      const schedule = [
        makeCourse('Math', {
          L: [{ start: '08:00', end: '09:00' }],
          M: [{ start: '08:00', end: '09:00' }],
        }),
        makeCourse('Physics', {
          L: [{ start: '10:00', end: '11:00' }], // 60 min gap on L
          M: [{ start: '09:30', end: '10:30' }], // 30 min gap on M
        }),
      ]
      expect(totalGapMinutes(schedule)).toBe(90)
    })

    it('handles multiple gaps in a single day', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '10:00', end: '11:00' }] }),
        makeCourse('Chem', { L: [{ start: '12:00', end: '13:00' }] }),
      ]
      // 60 min (09:00->10:00) + 60 min (11:00->12:00) = 120
      expect(totalGapMinutes(schedule)).toBe(120)
    })

    it('returns 0 for an empty schedule', () => {
      expect(totalGapMinutes([])).toBe(0)
    })

    it('does not report phantom gaps for overlapping/contained blocks', () => {
      const schedule = [
        makeCourse('Math', {
          L: [
            { start: '08:00', end: '12:00' },
            { start: '09:00', end: '10:00' },
            { start: '11:00', end: '13:00' },
          ],
        }),
      ]
      // All blocks merge into one continuous 08:00-13:00 run -> no gaps
      expect(totalGapMinutes(schedule)).toBe(0)
    })

    it('ignores inactive days', () => {
      const schedule = [
        {
          courseName: 'Math',
          color: '#000',
          group: {
            name: 'G1',
            schedule: [
              { day: 'L' as Day, active: false, timeBlocks: [{ start: '08:00', end: '09:00' }] },
              { day: 'K' as Day, active: true, timeBlocks: [] },
            ],
          },
        },
        {
          courseName: 'Physics',
          color: '#000',
          group: {
            name: 'G1',
            schedule: [
              { day: 'L' as Day, active: false, timeBlocks: [{ start: '11:00', end: '12:00' }] },
              { day: 'K' as Day, active: true, timeBlocks: [] },
            ],
          },
        },
      ]
      expect(totalGapMinutes(schedule)).toBe(0)
    })
  })

  describe('totalGapCount', () => {
    it('returns 0 for consecutive classes', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
      ]
      expect(totalGapCount(schedule)).toBe(0)
    })

    it('returns 1 for one gap regardless of duration', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '14:00', end: '15:00' }] }),
      ]
      // 5 hours gap, but only 1 gap counted
      expect(totalGapCount(schedule)).toBe(1)
    })

    it('counts multiple gaps across days', () => {
      const schedule = [
        makeCourse('Math', {
          L: [{ start: '08:00', end: '09:00' }],
          M: [{ start: '08:00', end: '09:00' }],
        }),
        makeCourse('Physics', {
          L: [{ start: '10:00', end: '11:00' }], // 1 gap on L
          M: [{ start: '10:00', end: '11:00' }], // 1 gap on M
        }),
      ]
      expect(totalGapCount(schedule)).toBe(2)
    })

    it('counts 2 gaps when 3 classes have breaks between each', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '10:00', end: '11:00' }] }),
        makeCourse('Chem', { L: [{ start: '12:00', end: '13:00' }] }),
      ]
      expect(totalGapCount(schedule)).toBe(2)
    })

    it('returns 0 for an empty schedule', () => {
      expect(totalGapCount([])).toBe(0)
    })
  })

  describe('classSegmentCount', () => {
    it('returns 0 for an empty schedule', () => {
      expect(classSegmentCount([])).toBe(0)
    })

    it('counts back-to-back classes on one day as a single segment', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
        makeCourse('Chem', { L: [{ start: '10:00', end: '11:00' }] }),
      ]
      expect(classSegmentCount(schedule)).toBe(1)
    })

    it('counts one segment per gap-separated run within a day', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '10:00', end: '11:00' }] }),
        makeCourse('Chem', { L: [{ start: '12:00', end: '13:00' }] }),
      ]
      // 3 isolated runs -> 3 segments
      expect(classSegmentCount(schedule)).toBe(3)
    })

    it('distinguishes a packed day from classes spread across days', () => {
      // Packed: 4 back-to-back classes on Monday -> 1 segment
      const packed = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
        makeCourse('Chem', { L: [{ start: '10:00', end: '11:00' }] }),
        makeCourse('Bio', { L: [{ start: '11:00', end: '12:00' }] }),
      ]
      // Spread: 1 class on each of 4 days -> 4 segments
      const spread = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { K: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Chem', { M: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Bio', { J: [{ start: '08:00', end: '09:00' }] }),
      ]
      // Both have 0 gaps, but segments tells them apart
      expect(totalGapCount(packed)).toBe(0)
      expect(totalGapCount(spread)).toBe(0)
      expect(classSegmentCount(packed)).toBe(1)
      expect(classSegmentCount(spread)).toBe(4)
    })
  })

  describe('sorting schedules by leastGaps', () => {
    it('sorts schedules by total gap minutes ascending', () => {
      // Schedule A: 120 min total gaps
      const scheduleA = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '11:00', end: '12:00' }] }), // 120 min gap
      ]
      // Schedule B: 0 min gaps (consecutive)
      const scheduleB = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
      ]
      // Schedule C: 30 min gap
      const scheduleC = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:30', end: '10:30' }] }),
      ]

      const schedules = [scheduleA, scheduleB, scheduleC]
      const sorted = [...schedules].sort(
        (a, b) => totalGapMinutes(a) - totalGapMinutes(b)
      )

      // Expected order: B (0), C (30), A (120)
      expect(sorted).toEqual([scheduleB, scheduleC, scheduleA])
    })
  })

  describe('sorting schedules by consecutiveClasses', () => {
    it('sorts schedules by segment count ascending', () => {
      // Schedule A: 3 segments (3 classes with breaks between each)
      const scheduleA = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '10:00', end: '11:00' }] }),
        makeCourse('Chem', { L: [{ start: '12:00', end: '13:00' }] }),
      ]
      // Schedule B: 1 segment (all consecutive)
      const scheduleB = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
        makeCourse('Chem', { L: [{ start: '10:00', end: '11:00' }] }),
      ]
      // Schedule C: 2 segments (1 gap)
      const scheduleC = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
        makeCourse('Chem', { L: [{ start: '11:00', end: '12:00' }] }),
      ]

      const schedules = [scheduleA, scheduleB, scheduleC]
      const sorted = [...schedules].sort(
        (a, b) => classSegmentCount(a) - classSegmentCount(b)
      )

      // Expected order: B (1), C (2), A (3)
      expect(sorted).toEqual([scheduleB, scheduleC, scheduleA])
    })

    it('prefers classes packed into one day over equal classes spread across days', () => {
      const packed = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
      ]
      const spread = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { K: [{ start: '08:00', end: '09:00' }] }),
      ]

      const sorted = [packed, spread].sort(
        (a, b) => classSegmentCount(a) - classSegmentCount(b)
      )

      // Both have 0 gap minutes/count, but packed (1 segment) sorts first
      expect(sorted).toEqual([packed, spread])
    })
  })

  describe('latestClassEnd', () => {
    it('returns 0 for an empty schedule', () => {
      expect(latestClassEnd([])).toBe(0)
    })

    it('returns the latest end across all days in minutes', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { M: [{ start: '15:00', end: '16:30' }] }),
      ]
      // 16:30 -> 990 minutes
      expect(latestClassEnd(schedule)).toBe(990)
    })

    it('orders schedules by earliest finish ascending', () => {
      const early = [makeCourse('Math', { L: [{ start: '08:00', end: '12:00' }] })]
      const late = [makeCourse('Math', { L: [{ start: '08:00', end: '18:00' }] })]

      const sorted = [late, early].sort((a, b) => latestClassEnd(a) - latestClassEnd(b))
      expect(sorted).toEqual([early, late])
    })
  })

  describe('earliestClassStart', () => {
    it('returns 0 for an empty schedule', () => {
      expect(earliestClassStart([])).toBe(0)
    })

    it('returns the earliest start across all days in minutes', () => {
      const schedule = [
        makeCourse('Math', { L: [{ start: '09:30', end: '10:30' }] }),
        makeCourse('Physics', { M: [{ start: '07:00', end: '08:00' }] }),
      ]
      // 07:00 -> 420 minutes
      expect(earliestClassStart(schedule)).toBe(420)
    })

    it('orders schedules by latest start (descending earliest-start)', () => {
      const earlyStart = [makeCourse('Math', { L: [{ start: '07:00', end: '08:00' }] })]
      const lateStart = [makeCourse('Math', { L: [{ start: '11:00', end: '12:00' }] })]

      const sorted = [earlyStart, lateStart].sort(
        (a, b) => earliestClassStart(b) - earliestClassStart(a)
      )
      expect(sorted).toEqual([lateStart, earlyStart])
    })
  })

  describe('combined sorting (earlyFinish + lateStart minimizes campus window)', () => {
    it('prefers the schedule with the smallest end-minus-start window', () => {
      const window = (s: Parameters<typeof latestClassEnd>[0]) =>
        latestClassEnd(s) - earliestClassStart(s)

      // A: 09:00-13:00 -> window 240
      const scheduleA = [makeCourse('Math', { L: [{ start: '09:00', end: '13:00' }] })]
      // B: 08:00-18:00 -> window 600
      const scheduleB = [makeCourse('Math', { L: [{ start: '08:00', end: '18:00' }] })]
      // C: 10:00-12:00 -> window 120
      const scheduleC = [makeCourse('Math', { L: [{ start: '10:00', end: '12:00' }] })]

      const sorted = [scheduleA, scheduleB, scheduleC].sort(
        (a, b) => window(a) - window(b)
      )
      expect(sorted).toEqual([scheduleC, scheduleA, scheduleB])
    })
  })

  describe('combined sorting (consecutiveClasses primary, leastGaps tiebreaker)', () => {
    it('uses segment count first, then gap minutes for ties', () => {
      // Schedule A: 1 gap, 120 min total
      const scheduleA = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '11:00', end: '12:00' }] }),
      ]
      // Schedule B: 1 gap, 30 min total
      const scheduleB = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:30', end: '10:30' }] }),
      ]
      // Schedule C: 0 gaps
      const scheduleC = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
      ]

      const schedules = [scheduleA, scheduleB, scheduleC]
      const sorted = [...schedules].sort((a, b) => {
        const segDiff = classSegmentCount(a) - classSegmentCount(b)
        if (segDiff !== 0) return segDiff
        return totalGapMinutes(a) - totalGapMinutes(b)
      })

      // Expected: C (1 segment), B (2 segments, 30 min), A (2 segments, 120 min)
      expect(sorted).toEqual([scheduleC, scheduleB, scheduleA])
    })
  })
})
