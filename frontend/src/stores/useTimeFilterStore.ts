import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { TimeRange, Day } from '@/types'
import { TIME_RANGES, DAYS } from '@/utils/constants'

const mapToObject = (map: Map<string, { hour: TimeRange; day: Day }>) =>
  Object.fromEntries(map)

const objectToMap = (
  obj: Record<string, { hour: TimeRange; day: Day }> | undefined
) => {
  if (!obj) return new Map()
  return new Map(Object.entries(obj))
}

interface TimeFilterState {
  selectedCells: Map<string, { hour: TimeRange; day: Day }>
  toggleCell: (hour: TimeRange, day: Day) => void
  toggleDay: (day: Day) => void
  toggleHour: (hour: TimeRange) => void
  clearCells: () => void
  isCellSelected: (hour: TimeRange, day: Day) => boolean
  isDayFullySelected: (day: Day) => boolean
  isHourFullySelected: (hour: TimeRange) => boolean
  selectedCount: () => number
}

export const useTimeFilterStore = create<TimeFilterState>()(
  persist(
    (set, get) => ({
      selectedCells: new Map(),

      toggleCell: (hour, day) => {
        const key = `${hour}-${day}`
        const currentCells = new Map(get().selectedCells)
        if (currentCells.has(key)) {
          currentCells.delete(key)
        } else {
          currentCells.set(key, { hour, day })
        }
        set({ selectedCells: currentCells })
      },

      toggleDay: (day) => {
        const currentCells = new Map(get().selectedCells)
        const allSelected = TIME_RANGES.every((hour) => currentCells.has(`${hour}-${day}`))
        if (allSelected) {
          TIME_RANGES.forEach((hour) => currentCells.delete(`${hour}-${day}`))
        } else {
          TIME_RANGES.forEach((hour) => currentCells.set(`${hour}-${day}`, { hour, day }))
        }
        set({ selectedCells: currentCells })
      },

      toggleHour: (hour) => {
        const currentCells = new Map(get().selectedCells)
        const allSelected = DAYS.every((day) => currentCells.has(`${hour}-${day}`))
        if (allSelected) {
          DAYS.forEach((day) => currentCells.delete(`${hour}-${day}`))
        } else {
          DAYS.forEach((day) => currentCells.set(`${hour}-${day}`, { hour, day }))
        }
        set({ selectedCells: currentCells })
      },

      clearCells: () => set({ selectedCells: new Map() }),

      isCellSelected: (hour, day) => get().selectedCells.has(`${hour}-${day}`),

      isDayFullySelected: (day) => {
        const cells = get().selectedCells
        return TIME_RANGES.every((hour) => cells.has(`${hour}-${day}`))
      },

      isHourFullySelected: (hour) => {
        const cells = get().selectedCells
        return DAYS.every((day) => cells.has(`${hour}-${day}`))
      },

      selectedCount: () => get().selectedCells.size,
    }),
    {
      name: 'horariu-time-filter',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCells: mapToObject(state.selectedCells),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedCells = objectToMap(
            state.selectedCells as unknown as Record<string, { hour: TimeRange; day: Day }>
          )
        }
      },
    }
  )
)
