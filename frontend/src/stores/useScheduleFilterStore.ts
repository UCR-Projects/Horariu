import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ScheduleFilterType = 'savedFirst' | 'leastGaps' | 'consecutiveClasses'

interface ScheduleFilterState {
  activeFilters: Record<ScheduleFilterType, boolean>
  setFilter: (filter: ScheduleFilterType, value: boolean) => void
  clearFilters: () => void
  hasActiveFilters: () => boolean
}

export const useScheduleFilterStore = create<ScheduleFilterState>()(
  persist(
    (set, get) => ({
      activeFilters: {
        savedFirst: false,
        leastGaps: false,
        consecutiveClasses: false,
      },

      setFilter: (filter, value) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, [filter]: value },
        })),

      clearFilters: () =>
        set({
          activeFilters: {
            savedFirst: false,
            leastGaps: false,
            consecutiveClasses: false,
          },
        }),

      hasActiveFilters: () =>
        Object.values(get().activeFilters).some(Boolean),
    }),
    {
      name: 'horariu-schedule-filters',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
