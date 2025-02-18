import { create } from 'zustand'
import { Day, TimeRange } from '../types'

interface ScheduleStore {
  selectedCells: Map<string, { hour: TimeRange; day: Day }>
  toggleCell: (hour: TimeRange, day: Day) => void
  clearCells: () => void
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
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
  clearCells: () => {
    set({ selectedCells: new Map() })
  }
}))

export default useScheduleStore