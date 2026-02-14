import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'

describe('useScheduleFilterStore', () => {
  beforeEach(() => {
    act(() => {
      useScheduleFilterStore.setState({
        selectedCells: new Map(),
      })
    })
  })

  describe('toggleCell', () => {
    it('should add a cell when not selected', () => {
      act(() => {
        useScheduleFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
      })

      const state = useScheduleFilterStore.getState()
      expect(state.selectedCells.size).toBe(1)
      expect(state.selectedCells.has('08:00 - 08:50-L')).toBe(true)
    })

    it('should remove a cell when already selected', () => {
      act(() => {
        useScheduleFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useScheduleFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
      })

      const state = useScheduleFilterStore.getState()
      expect(state.selectedCells.size).toBe(0)
    })

    it('should store correct hour and day data', () => {
      act(() => {
        useScheduleFilterStore.getState().toggleCell('09:00 - 09:50', 'M')
      })

      const state = useScheduleFilterStore.getState()
      const cellData = state.selectedCells.get('09:00 - 09:50-M')
      expect(cellData).toEqual({ hour: '09:00 - 09:50', day: 'M' })
    })

    it('should handle multiple cells', () => {
      act(() => {
        useScheduleFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useScheduleFilterStore.getState().toggleCell('09:00 - 09:50', 'L')
        useScheduleFilterStore.getState().toggleCell('08:00 - 08:50', 'M')
      })

      const state = useScheduleFilterStore.getState()
      expect(state.selectedCells.size).toBe(3)
    })
  })

  describe('clearCells', () => {
    it('should clear all selected cells', () => {
      act(() => {
        useScheduleFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useScheduleFilterStore.getState().toggleCell('09:00 - 09:50', 'M')
        useScheduleFilterStore.getState().clearCells()
      })

      expect(useScheduleFilterStore.getState().selectedCells.size).toBe(0)
    })

    it('should work when no cells are selected', () => {
      act(() => {
        useScheduleFilterStore.getState().clearCells()
      })

      expect(useScheduleFilterStore.getState().selectedCells.size).toBe(0)
    })
  })
})
