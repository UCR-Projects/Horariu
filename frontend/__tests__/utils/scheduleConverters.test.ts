import { describe, it, expect } from 'vitest'
import { createEmptyFormSchedule } from '@/utils/scheduleConverters'
import { DAYS } from '@/utils/constants'

describe('scheduleConverters', () => {
  describe('createEmptyFormSchedule', () => {
    it('should create a schedule with all days', () => {
      const schedule = createEmptyFormSchedule()

      expect(schedule).toHaveLength(7)
      expect(schedule.map((s) => s.day)).toEqual(DAYS)
    })

    it('should create a schedule with all days inactive', () => {
      const schedule = createEmptyFormSchedule()

      schedule.forEach((daySchedule) => {
        expect(daySchedule.active).toBe(false)
      })
    })

    it('should create a schedule with empty timeBlocks for all days', () => {
      const schedule = createEmptyFormSchedule()

      schedule.forEach((daySchedule) => {
        expect(daySchedule.timeBlocks).toEqual([])
      })
    })

    it('should return a new array each time', () => {
      const schedule1 = createEmptyFormSchedule()
      const schedule2 = createEmptyFormSchedule()

      expect(schedule1).not.toBe(schedule2)
    })
  })
})

