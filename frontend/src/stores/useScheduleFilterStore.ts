import { create } from 'zustand'
import { Day, TimeRange } from '@/types'
import { persist, createJSONStorage } from 'zustand/middleware'

const mapToObject = (map: Map<string, { hour: TimeRange; day: Day }>) => {
  return Object.fromEntries(map.entries())
}

const objectToMap = (
  obj: Record<string, { hour: TimeRange; day: Day }> | undefined
) => {
  if (!obj) return new Map()
  return new Map(Object.entries(obj))
}

interface ScheduleState {
  selectedCells: Map<string, { hour: TimeRange; day: Day }>
  toggleCell: (hour: TimeRange, day: Day) => void
  clearCells: () => void
}

export const useScheduleFilterStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      selectedCells: new Map(),

      toggleCell: (hour: TimeRange, day: Day) => {
        const key = `${hour}-${day}`
        const currentCells = new Map(get().selectedCells)

        if (currentCells.has(key)) {
          currentCells.delete(key)
        } else {
          currentCells.set(key, { hour, day })
        }

        set({ selectedCells: currentCells })
      },

      clearCells: () => {
        set({ selectedCells: new Map() })
      },
    }),
    {
      name: 'schedule-filter-storage', // Local storage key
      storage: createJSONStorage(() => localStorage),

      // Convert the Map to an object before serializing
      // because JSON.stringify does not support Maps
      partialize: (state) => ({
        selectedCells: mapToObject(state.selectedCells),
      }),

      // Convert the object back to a Map after deserializing
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedCells = objectToMap(
            state.selectedCells as unknown as Record<
              string,
              { hour: TimeRange; day: Day }
            >
          )
        }
      },
    }
  )
)
