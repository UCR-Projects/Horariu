import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesState {
  favoriteScheduleIndices: number[]
  toggleFavorite: (index: number) => void
  isFavorite: (index: number) => boolean
  clearFavorites: () => void
  getFavoritesCount: () => number
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteScheduleIndices: [],

      toggleFavorite: (index) => {
        const current = get().favoriteScheduleIndices
        if (current.includes(index)) {
          set({ favoriteScheduleIndices: current.filter((i) => i !== index) })
        } else {
          set({ favoriteScheduleIndices: [...current, index] })
        }
      },

      isFavorite: (index) => get().favoriteScheduleIndices.includes(index),

      clearFavorites: () => set({ favoriteScheduleIndices: [] }),

      getFavoritesCount: () => get().favoriteScheduleIndices.length,
    }),
    {
      name: 'horariu-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

