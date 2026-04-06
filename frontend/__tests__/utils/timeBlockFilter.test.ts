import { describe, it, expect } from 'vitest'
import { storedScheduleConflictsWithBlockedCells } from '@/utils/timeBlockFilter'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import type { DaySchedule, Day, TimeRange } from '@/types'
import type { StoredCourse } from '@/stores/useScheduleStore'

// Helpers

function makeDaySchedule(day: Day, start: string, end: string, active = true): DaySchedule {
  return { day, active, timeBlocks: [{ start, end }] }
}

function makeStoredCourse(courseName: string, daySchedules: DaySchedule[]): StoredCourse {
  return {
    courseName,
    color: '#ef4444',
    group: { name: 'G1', schedule: daySchedules },
  }
}

function blockedCell(hour: TimeRange, day: Day) {
  return new Map([[`${hour}-${day}`, { hour, day }]])
}

// ─────────────────────────────────────────────
// storedScheduleConflictsWithBlockedCells
// ─────────────────────────────────────────────

describe('storedScheduleConflictsWithBlockedCells', () => {
  describe('empty blockedCells', () => {
    it('returns false when blockedCells is empty', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '08:00', '08:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, new Map())).toBe(false)
    })
  })

  describe('no conflict', () => {
    it('returns false when no group conflicts with blocked cells', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('M', '08:00', '08:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(false)
    })

    it('returns false when blocked cell is at a different hour', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '10:00', '10:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(false)
    })

    it('returns false when timeBlock is adjacent before the blocked range', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '07:00', '08:00')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(false)
    })

    it('returns false when timeBlock is adjacent after the blocked range', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '08:50', '09:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(false)
    })
  })

  describe('conflict detected', () => {
    it('returns true when a group matches a blocked cell exactly', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '08:00', '08:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(true)
    })

    it('returns true when a group partially overlaps the blocked range', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '08:30', '09:30')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(true)
    })

    it('returns true when a group spans across the blocked range', () => {
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '07:00', '10:00')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(true)
    })
  })

  describe('multi-course schedule', () => {
    it('returns true when only one course in the schedule conflicts', () => {
      const schedule = [
        makeStoredCourse('Math', [makeDaySchedule('L', '08:00', '08:50')]),
        makeStoredCourse('Physics', [makeDaySchedule('M', '10:00', '10:50')]),
      ]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(true)
    })

    it('returns false when no course in the schedule conflicts', () => {
      const schedule = [
        makeStoredCourse('Math', [makeDaySchedule('L', '10:00', '10:50')]),
        makeStoredCourse('Physics', [makeDaySchedule('M', '10:00', '10:50')]),
      ]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(false)
    })
  })

  describe('inactive days', () => {
    it('returns false when the conflicting day is inactive', () => {
      const schedule = [
        makeStoredCourse('Math', [
          { day: 'L', active: false, timeBlocks: [{ start: '08:00', end: '08:50' }] },
        ]),
      ]
      expect(storedScheduleConflictsWithBlockedCells(schedule, blockedCell('08:00 - 08:50', 'L'))).toBe(false)
    })
  })

  describe('full day / full hour blocked', () => {
    it('returns true when all TIME_RANGES for a day are blocked and a course is scheduled that day', () => {
      const allCells = new Map(
        TIME_RANGES.map((r) => [`${r}-L`, { hour: r as TimeRange, day: 'L' as Day }])
      )
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('L', '08:00', '08:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, allCells)).toBe(true)
    })

    it('returns true when all DAYS for an hour are blocked and a course is scheduled in that hour', () => {
      const range: TimeRange = '09:00 - 09:50'
      const allCells = new Map(
        DAYS.map((d) => [`${range}-${d}`, { hour: range, day: d as Day }])
      )
      const schedule = [makeStoredCourse('Math', [makeDaySchedule('M', '09:00', '09:50')])]
      expect(storedScheduleConflictsWithBlockedCells(schedule, allCells)).toBe(true)
    })
  })
})
