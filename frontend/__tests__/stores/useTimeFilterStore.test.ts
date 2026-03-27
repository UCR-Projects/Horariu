import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { TIME_RANGES, DAYS } from '@/utils/constants'

describe('useTimeFilterStore', () => {
  beforeEach(() => {
    act(() => {
      useTimeFilterStore.setState({
        selectedCells: new Map(),
      })
    })
  })

  describe('toggleCell', () => {
    it('should add a cell when not selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(1)
      expect(state.selectedCells.has('08:00 - 08:50-L')).toBe(true)
    })

    it('should remove a cell when already selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(0)
    })

    it('should store correct hour and day data', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('09:00 - 09:50', 'M')
      })

      const state = useTimeFilterStore.getState()
      const cellData = state.selectedCells.get('09:00 - 09:50-M')
      expect(cellData).toEqual({ hour: '09:00 - 09:50', day: 'M' })
    })

    it('should handle multiple cells', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useTimeFilterStore.getState().toggleCell('09:00 - 09:50', 'L')
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'M')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(3)
    })
  })

  describe('toggleDay', () => {
    it('should select all TIME_RANGES for a day', () => {
      act(() => {
        useTimeFilterStore.getState().toggleDay('L')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(TIME_RANGES.length)
      TIME_RANGES.forEach((hour) => {
        expect(state.selectedCells.has(`${hour}-L`)).toBe(true)
      })
    })

    it('should deselect all TIME_RANGES when all are already selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleDay('L')
        useTimeFilterStore.getState().toggleDay('L')
      })

      expect(useTimeFilterStore.getState().selectedCells.size).toBe(0)
    })

    it('should select all TIME_RANGES when only some are selected (partial)', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell(TIME_RANGES[0], 'L')
        useTimeFilterStore.getState().toggleDay('L')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(TIME_RANGES.length)
    })
  })

  describe('toggleHour', () => {
    it('should select all DAYS for an hour', () => {
      act(() => {
        useTimeFilterStore.getState().toggleHour('08:00 - 08:50')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(DAYS.length)
      DAYS.forEach((day) => {
        expect(state.selectedCells.has(`08:00 - 08:50-${day}`)).toBe(true)
      })
    })

    it('should deselect all DAYS when all are already selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleHour('08:00 - 08:50')
        useTimeFilterStore.getState().toggleHour('08:00 - 08:50')
      })

      expect(useTimeFilterStore.getState().selectedCells.size).toBe(0)
    })

    it('should select all DAYS when only some are selected (partial)', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useTimeFilterStore.getState().toggleHour('08:00 - 08:50')
      })

      const state = useTimeFilterStore.getState()
      expect(state.selectedCells.size).toBe(DAYS.length)
    })
  })

  describe('isCellSelected', () => {
    it('should return true when cell is selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
      })

      expect(useTimeFilterStore.getState().isCellSelected('08:00 - 08:50', 'L')).toBe(true)
    })

    it('should return false when cell is not selected', () => {
      expect(useTimeFilterStore.getState().isCellSelected('08:00 - 08:50', 'L')).toBe(false)
    })
  })

  describe('isDayFullySelected', () => {
    it('should return true when all TIME_RANGES are selected for a day', () => {
      act(() => {
        useTimeFilterStore.getState().toggleDay('K')
      })

      expect(useTimeFilterStore.getState().isDayFullySelected('K')).toBe(true)
    })

    it('should return false when only some TIME_RANGES are selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell(TIME_RANGES[0], 'K')
      })

      expect(useTimeFilterStore.getState().isDayFullySelected('K')).toBe(false)
    })

    it('should return false when no cells are selected', () => {
      expect(useTimeFilterStore.getState().isDayFullySelected('L')).toBe(false)
    })
  })

  describe('isHourFullySelected', () => {
    it('should return true when all DAYS are selected for an hour', () => {
      act(() => {
        useTimeFilterStore.getState().toggleHour('09:00 - 09:50')
      })

      expect(useTimeFilterStore.getState().isHourFullySelected('09:00 - 09:50')).toBe(true)
    })

    it('should return false when only some DAYS are selected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('09:00 - 09:50', 'L')
      })

      expect(useTimeFilterStore.getState().isHourFullySelected('09:00 - 09:50')).toBe(false)
    })

    it('should return false when no cells are selected', () => {
      expect(useTimeFilterStore.getState().isHourFullySelected('09:00 - 09:50')).toBe(false)
    })
  })

  describe('selectedCount', () => {
    it('should return 0 initially', () => {
      expect(useTimeFilterStore.getState().selectedCount()).toBe(0)
    })

    it('should return correct count after multiple toggles', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useTimeFilterStore.getState().toggleCell('09:00 - 09:50', 'M')
        useTimeFilterStore.getState().toggleCell('10:00 - 10:50', 'J')
      })

      expect(useTimeFilterStore.getState().selectedCount()).toBe(3)
    })

    it('should decrease when a cell is deselected', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useTimeFilterStore.getState().toggleCell('09:00 - 09:50', 'M')
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
      })

      expect(useTimeFilterStore.getState().selectedCount()).toBe(1)
    })
  })

  describe('clearCells', () => {
    it('should clear all selected cells', () => {
      act(() => {
        useTimeFilterStore.getState().toggleCell('08:00 - 08:50', 'L')
        useTimeFilterStore.getState().toggleCell('09:00 - 09:50', 'M')
        useTimeFilterStore.getState().clearCells()
      })

      expect(useTimeFilterStore.getState().selectedCells.size).toBe(0)
    })

    it('should work when no cells are selected', () => {
      act(() => {
        useTimeFilterStore.getState().clearCells()
      })

      expect(useTimeFilterStore.getState().selectedCells.size).toBe(0)
    })
  })
})
