import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const MAX_CUSTOM_COLORS = 5

interface CustomColorState {
  customColors: string[]
  addColor: (hex: string) => void
  removeColor: (hex: string) => void
  clearColors: () => void
}

const useCustomColorStore = create<CustomColorState>()(
  persist(
    (set) => ({
      customColors: [],

      addColor: (hex) =>
        set((state) => {
          const normalizedHex = hex.toLowerCase()
          // Don't add duplicates or exceed max
          if (state.customColors.includes(normalizedHex)) return state
          if (state.customColors.length >= MAX_CUSTOM_COLORS) return state
          return { customColors: [...state.customColors, normalizedHex] }
        }),

      removeColor: (hex) =>
        set((state) => ({
          customColors: state.customColors.filter(
            (c) => c.toLowerCase() !== hex.toLowerCase()
          ),
        })),

      clearColors: () => set({ customColors: [] }),
    }),
    {
      name: 'custom-colors-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCustomColorStore

