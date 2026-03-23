import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type TableStyle = 'classic' | 'rounded' | 'floating' | 'minimal' | 'glass'

interface TableStyleState {
  tableStyle: TableStyle
  setTableStyle: (style: TableStyle) => void
}

export const useTableStyleStore = create<TableStyleState>()(
  persist(
    (set) => ({
      tableStyle: 'classic',
      setTableStyle: (style) => set({ tableStyle: style }),
    }),
    {
      name: 'horariu-table-style',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

