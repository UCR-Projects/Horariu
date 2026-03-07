import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ScheduleViewMode = 'list' | 'carousel'

interface ScheduleViewState {
  viewMode: ScheduleViewMode
  setViewMode: (mode: ScheduleViewMode) => void
  toggleViewMode: () => void
}

export const useScheduleViewStore = create<ScheduleViewState>()(
  persist(
    (set, get) => ({
      viewMode: 'list',

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleViewMode: () => {
        const current = get().viewMode
        set({ viewMode: current === 'list' ? 'carousel' : 'list' })
      },
    }),
    {
      name: 'horariu-schedule-view',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

