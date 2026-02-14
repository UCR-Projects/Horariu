import { describe, it, expect } from 'vitest'
import {
  START_TIMES,
  END_TIMES,
  TIME_RANGES,
  DAYS,
  COLORS,
  DEFAULT_COLOR,
  SCHEDULES_PER_PAGE,
} from '@/utils/constants'

describe('constants', () => {
  describe('DAYS', () => {
    it('should contain 7 days', () => {
      expect(DAYS).toHaveLength(7)
    })

    it('should contain expected day codes', () => {
      expect(DAYS).toEqual(['L', 'K', 'M', 'J', 'V', 'S', 'D'])
    })
  })

  describe('START_TIMES and END_TIMES', () => {
    it('should have equal lengths', () => {
      expect(START_TIMES.length).toBe(END_TIMES.length)
    })

    it('should start at 07:00', () => {
      expect(START_TIMES[0]).toBe('07:00')
    })

    it('should end at 22:00', () => {
      expect(START_TIMES[START_TIMES.length - 1]).toBe('22:00')
    })

    it('should have matching end times for each start time', () => {
      expect(END_TIMES[0]).toBe('07:50')
      expect(END_TIMES[END_TIMES.length - 1]).toBe('22:50')
    })
  })

  describe('TIME_RANGES', () => {
    it('should have same length as START_TIMES', () => {
      expect(TIME_RANGES.length).toBe(START_TIMES.length)
    })

    it('should format time ranges correctly', () => {
      expect(TIME_RANGES[0]).toBe('07:00 - 07:50')
      expect(TIME_RANGES[1]).toBe('08:00 - 08:50')
    })
  })

  describe('COLORS', () => {
    it('should be a non-empty array', () => {
      expect(COLORS.length).toBeGreaterThan(0)
    })

    it('should have required properties for each color', () => {
      COLORS.forEach((color) => {
        expect(color).toHaveProperty('name')
        expect(color).toHaveProperty('class')
        expect(color).toHaveProperty('value')
      })
    })

    it('should have valid tailwind color classes', () => {
      COLORS.forEach((color) => {
        expect(color.class).toMatch(/^bg-[a-z]+-\d+$/)
      })
    })
  })

  describe('DEFAULT_COLOR', () => {
    it('should be a valid color from COLORS', () => {
      const colorValues = COLORS.map((c) => c.value)
      expect(colorValues).toContain(DEFAULT_COLOR)
    })
  })

  describe('SCHEDULES_PER_PAGE', () => {
    it('should be a positive number', () => {
      expect(SCHEDULES_PER_PAGE).toBeGreaterThan(0)
    })

    it('should be 5', () => {
      expect(SCHEDULES_PER_PAGE).toBe(5)
    })
  })
})

