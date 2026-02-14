import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTimeValidation } from '@/hooks/useTimeValidation'

describe('useTimeValidation', () => {
  describe('validEndTimes', () => {
    it('should return only "----" when startTime is "----"', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '----' }))

      expect(result.current.validEndTimes).toEqual(['----'])
    })

    it('should return only "----" when startTime is empty', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '' }))

      expect(result.current.validEndTimes).toEqual(['----'])
    })

    it('should return end times starting from the start time index', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.validEndTimes[0]).toBe('----')
      expect(result.current.validEndTimes[1]).toBe('08:50')
      expect(result.current.validEndTimes).not.toContain('07:50')
    })

    it('should include all end times from start time onwards', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '07:00' }))

      // Should include ---- plus all end times
      expect(result.current.validEndTimes.length).toBeGreaterThan(1)
      expect(result.current.validEndTimes).toContain('22:50')
    })
  })

  describe('isEndTimeValid', () => {
    it('should return true when end is "----"', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.isEndTimeValid('08:00', '----')).toBe(true)
    })

    it('should return false when start is "----" and end is not', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '----' }))

      expect(result.current.isEndTimeValid('----', '09:50')).toBe(false)
    })

    it('should return true when end time is after start time', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.isEndTimeValid('08:00', '09:50')).toBe(true)
      expect(result.current.isEndTimeValid('08:00', '22:50')).toBe(true)
    })

    it('should return true when end time matches start time slot', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.isEndTimeValid('08:00', '08:50')).toBe(true)
    })

    it('should return false when end time is before start time', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '10:00' }))

      expect(result.current.isEndTimeValid('10:00', '08:50')).toBe(false)
      expect(result.current.isEndTimeValid('10:00', '09:50')).toBe(false)
    })
  })

  describe('getValidatedEndTime', () => {
    it('should return "----" when newStart is "----"', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.getValidatedEndTime('----', '09:50')).toBe('----')
    })

    it('should return currentEnd when it is valid for newStart', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.getValidatedEndTime('08:00', '10:50')).toBe('10:50')
    })

    it('should return "----" when currentEnd is invalid for newStart', () => {
      const { result } = renderHook(() => useTimeValidation({ startTime: '08:00' }))

      expect(result.current.getValidatedEndTime('12:00', '10:50')).toBe('----')
    })
  })
})
