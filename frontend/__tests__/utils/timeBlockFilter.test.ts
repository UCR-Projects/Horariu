import { describe, it, expect } from 'vitest'
import { filterCoursesByBlockedCells } from '@/utils/timeBlockFilter'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import type { Course, Group, DaySchedule, Day, TimeRange } from '@/types'

// Helpers

function makeGroup(id: string, schedule: DaySchedule[]): Group {
  return { id, name: id, schedule, isActive: true }
}

function makeDaySchedule(day: Day, start: string, end: string, active = true): DaySchedule {
  return { day, active, timeBlocks: [{ start, end }] }
}

function makeCourse(name: string, groups: Group[]): Course {
  return { name, color: '#ef4444', groups, isActive: true }
}

function blockedCell(hour: TimeRange, day: Day) {
  return new Map([[`${hour}-${day}`, { hour, day }]])
}

// ─────────────────────────────────────────────
// filterCoursesByBlockedCells
// ─────────────────────────────────────────────

describe('filterCoursesByBlockedCells', () => {
  describe('empty blockedCells', () => {
    it('returns courses unchanged and removedGroupsCount = 0', () => {
      const courses = [makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '08:00', '08:50')])])]
      const result = filterCoursesByBlockedCells(courses, new Map())
      expect(result.filteredCourses).toBe(courses)
      expect(result.removedGroupsCount).toBe(0)
    })
  })

  describe('exact match', () => {
    it('removes group when timeBlock matches blocked cell exactly', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '08:00', '08:50')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })
  })

  describe('no overlap', () => {
    it('keeps group when blocked cell is on a different day', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('M', '08:00', '08:50')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(1)
      expect(removedGroupsCount).toBe(0)
    })

    it('keeps group when blocked cell is at a different hour', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '09:00', '09:50')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(1)
      expect(removedGroupsCount).toBe(0)
    })

    it('keeps group when timeBlock is adjacent before the blocked range (07:00–08:00 vs 08:00–08:50)', () => {
      // block 07:00-08:00 ends at 480; range 08:00-08:50 starts at 480 → rangeStart NOT < blockEnd
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '07:00', '08:00')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(1)
      expect(removedGroupsCount).toBe(0)
    })

    it('keeps group when timeBlock is adjacent after the blocked range (08:50–09:50 vs 08:00–08:50)', () => {
      // block 08:50-09:50 starts at 530; range 08:00-08:50 ends at 530 → blockStart NOT < rangeEnd
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '08:50', '09:50')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(1)
      expect(removedGroupsCount).toBe(0)
    })
  })

  describe('partial overlaps', () => {
    it('removes group when timeBlock overlaps the start of the blocked range (08:30–09:30 vs 08:00–08:50)', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '08:30', '09:30')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })

    it('removes group when timeBlock overlaps the end of the blocked range (07:00–08:30 vs 08:00–08:50)', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '07:00', '08:30')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })

    it('removes group when timeBlock is contained within the blocked range (08:10–08:40 vs 08:00–08:50)', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '08:10', '08:40')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })

    it('removes group when timeBlock contains the entire blocked range (07:00–10:00 vs 08:00–08:50)', () => {
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '07:00', '10:00')])])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })
  })

  describe('inactive days', () => {
    it('ignores a day with active: false even when it has timeBlocks', () => {
      const course = makeCourse('Math', [
        makeGroup('A', [{ day: 'L', active: false, timeBlocks: [{ start: '08:00', end: '08:50' }] }]),
      ])
      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )
      expect(filteredCourses).toHaveLength(1)
      expect(removedGroupsCount).toBe(0)
    })
  })

  describe('multiple groups and courses', () => {
    it('keeps course with only the non-conflicting group when one of two groups conflicts', () => {
      const groupA = makeGroup('A', [makeDaySchedule('L', '08:00', '08:50')])
      const groupB = makeGroup('B', [makeDaySchedule('L', '10:00', '10:50')])
      const course = makeCourse('Math', [groupA, groupB])

      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )

      expect(filteredCourses).toHaveLength(1)
      expect(filteredCourses[0].groups).toHaveLength(1)
      expect(filteredCourses[0].groups[0].id).toBe('B')
      expect(removedGroupsCount).toBe(1)
    })

    it('removes course entirely when all its groups conflict', () => {
      const groupA = makeGroup('A', [makeDaySchedule('L', '08:00', '08:50')])
      const groupB = makeGroup('B', [makeDaySchedule('L', '08:10', '08:40')])
      const course = makeCourse('Math', [groupA, groupB])

      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells(
        [course],
        blockedCell('08:00 - 08:50', 'L')
      )

      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(2)
    })

    it('counts removedGroupsCount correctly across multiple courses and groups', () => {
      const c1 = makeCourse('Math', [
        makeGroup('A', [makeDaySchedule('L', '08:00', '08:50')]),
        makeGroup('B', [makeDaySchedule('L', '08:00', '08:50')]),
      ])
      const c2 = makeCourse('Physics', [
        makeGroup('C', [makeDaySchedule('L', '08:00', '08:50')]),
        makeGroup('D', [makeDaySchedule('L', '10:00', '10:50')]),
      ])

      const { removedGroupsCount } = filterCoursesByBlockedCells(
        [c1, c2],
        blockedCell('08:00 - 08:50', 'L')
      )

      expect(removedGroupsCount).toBe(3)
    })
  })

  describe('full day / full hour blocked', () => {
    it('removes any group scheduled that day when all TIME_RANGES for that day are blocked', () => {
      const allCells = new Map(
        TIME_RANGES.map((r) => [`${r}-L`, { hour: r as TimeRange, day: 'L' as Day }])
      )
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('L', '08:00', '08:50')])])

      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells([course], allCells)

      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })

    it('removes any group scheduled in that hour when all DAYS for that range are blocked', () => {
      const range: TimeRange = '09:00 - 09:50'
      const allCells = new Map(
        DAYS.map((d) => [`${range}-${d}`, { hour: range, day: d as Day }])
      )
      const course = makeCourse('Math', [makeGroup('A', [makeDaySchedule('M', '09:00', '09:50')])])

      const { filteredCourses, removedGroupsCount } = filterCoursesByBlockedCells([course], allCells)

      expect(filteredCourses).toHaveLength(0)
      expect(removedGroupsCount).toBe(1)
    })
  })
})
