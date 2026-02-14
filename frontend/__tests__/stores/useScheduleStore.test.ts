import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import useScheduleStore, { ScheduleDataType } from '@/stores/useScheduleStore'
import { DAYS } from '@/utils/constants'
import { Day } from '@/types'

function createTestScheduleData(): ScheduleDataType {
  return {
    schedules: [
      [
        {
          courseName: 'Math 101',
          color: 'bg-red-500',
          group: {
            name: 'Group 1',
            schedule: DAYS.map((day: Day) => ({
              day,
              active: day === 'L',
              timeBlocks: day === 'L' ? [{ start: '08:00', end: '09:30' }] : [],
            })),
          },
        },
      ],
    ],
  }
}

describe('useScheduleStore', () => {
  beforeEach(() => {
    act(() => {
      useScheduleStore.setState({
        scheduleData: null,
        isLoading: false,
        error: null,
        isSuccess: false,
      })
    })
  })

  describe('setScheduleData', () => {
    it('should set schedule data and mark as success', () => {
      const data = createTestScheduleData()

      act(() => {
        useScheduleStore.getState().setScheduleData(data)
      })

      const state = useScheduleStore.getState()
      expect(state.scheduleData).toEqual(data)
      expect(state.isSuccess).toBe(true)
    })
  })

  describe('clearScheduleData', () => {
    it('should clear schedule data', () => {
      const data = createTestScheduleData()

      act(() => {
        useScheduleStore.getState().setScheduleData(data)
        useScheduleStore.getState().clearScheduleData()
      })

      expect(useScheduleStore.getState().scheduleData).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('should set loading state', () => {
      act(() => {
        useScheduleStore.getState().setLoading(true)
      })

      expect(useScheduleStore.getState().isLoading).toBe(true)

      act(() => {
        useScheduleStore.getState().setLoading(false)
      })

      expect(useScheduleStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error state', () => {
      const error = new Error('Test error')

      act(() => {
        useScheduleStore.getState().setError(error)
      })

      expect(useScheduleStore.getState().error).toBe(error)
    })

    it('should allow clearing error', () => {
      const error = new Error('Test error')

      act(() => {
        useScheduleStore.getState().setError(error)
        useScheduleStore.getState().setError(null)
      })

      expect(useScheduleStore.getState().error).toBeNull()
    })
  })

  describe('setSuccess', () => {
    it('should set success state', () => {
      act(() => {
        useScheduleStore.getState().setSuccess(true)
      })

      expect(useScheduleStore.getState().isSuccess).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset loading, error, and success states', () => {
      act(() => {
        useScheduleStore.getState().setLoading(true)
        useScheduleStore.getState().setError(new Error('Test'))
        useScheduleStore.getState().setSuccess(true)
        useScheduleStore.getState().reset()
      })

      const state = useScheduleStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.isSuccess).toBe(false)
    })

    it('should not clear scheduleData', () => {
      const data = createTestScheduleData()

      act(() => {
        useScheduleStore.getState().setScheduleData(data)
        useScheduleStore.getState().reset()
      })

      expect(useScheduleStore.getState().scheduleData).toEqual(data)
    })
  })
})
