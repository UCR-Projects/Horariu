import { describe, it, expect } from 'vitest'
import { totalGapMinutes, totalGapCount } from '@/utils/scheduleMetrics'
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
    it('sorts schedules by gap count ascending', () => {
      // Schedule A: 2 gaps (3 classes with breaks between each)
      const scheduleA = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '10:00', end: '11:00' }] }),
        makeCourse('Chem', { L: [{ start: '12:00', end: '13:00' }] }),
      ]
      // Schedule B: 0 gaps (all consecutive)
      const scheduleB = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
        makeCourse('Chem', { L: [{ start: '10:00', end: '11:00' }] }),
      ]
      // Schedule C: 1 gap
      const scheduleC = [
        makeCourse('Math', { L: [{ start: '08:00', end: '09:00' }] }),
        makeCourse('Physics', { L: [{ start: '09:00', end: '10:00' }] }),
        makeCourse('Chem', { L: [{ start: '11:00', end: '12:00' }] }),
      ]

      const schedules = [scheduleA, scheduleB, scheduleC]
      const sorted = [...schedules].sort(
        (a, b) => totalGapCount(a) - totalGapCount(b)
      )

      // Expected order: B (0), C (1), A (2)
      expect(sorted).toEqual([scheduleB, scheduleC, scheduleA])
    })
  })

  describe('combined sorting (consecutiveClasses primary, leastGaps tiebreaker)', () => {
    it('uses gap count first, then gap minutes for ties', () => {
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
        const countDiff = totalGapCount(a) - totalGapCount(b)
        if (countDiff !== 0) return countDiff
        return totalGapMinutes(a) - totalGapMinutes(b)
      })

      // Expected: C (0 gaps), B (1 gap, 30 min), A (1 gap, 120 min)
      expect(sorted).toEqual([scheduleC, scheduleB, scheduleA])
    })
  })
})
