import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Schedule } from '@/types'

interface StoredGroup {
  name: string
  schedule: Schedule
}

interface StoredCourse {
  courseName: string
  color: string
  group: StoredGroup
}

export interface SavedSchedule {
  id: string
  schedule: StoredCourse[]
  savedAt: number
}

/**
 * Generate a content-based fingerprint for a schedule.
 * Sorts course+group pairs alphabetically so order doesn't matter.
 */
function getScheduleFingerprint(schedule: StoredCourse[]): string {
  return schedule
    .map((c) => `${c.courseName}::${c.group.name}`)
    .sort()
    .join('|')
}

function generateSavedScheduleId(): string {
  return `saved_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

interface SavedSchedulesState {
  savedSchedules: SavedSchedule[]
  saveSchedule: (schedule: StoredCourse[]) => boolean
  removeSchedule: (id: string) => void
  isScheduleSaved: (schedule: StoredCourse[]) => boolean
  clearAll: () => void
}

export const useSavedSchedulesStore = create<SavedSchedulesState>()(
  persist(
    (set, get) => ({
      savedSchedules: [],

      saveSchedule: (schedule) => {
        if (get().isScheduleSaved(schedule)) return false
        const saved: SavedSchedule = {
          id: generateSavedScheduleId(),
          schedule,
          savedAt: Date.now(),
        }
        set((state) => ({
          savedSchedules: [...state.savedSchedules, saved],
        }))
        return true
      },

      removeSchedule: (id) =>
        set((state) => ({
          savedSchedules: state.savedSchedules.filter((s) => s.id !== id),
        })),

      isScheduleSaved: (schedule) => {
        const fingerprint = getScheduleFingerprint(schedule)
        return get().savedSchedules.some(
          (s) => getScheduleFingerprint(s.schedule) === fingerprint
        )
      },

      clearAll: () => set({ savedSchedules: [] }),
    }),
    {
      name: 'horariu-saved-schedules',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
