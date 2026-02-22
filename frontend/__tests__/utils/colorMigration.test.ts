import { describe, it, expect } from 'vitest'
import { migrateColor, TAILWIND_TO_HEX } from '@/utils/colorMigration'

describe('colorMigration', () => {
  describe('TAILWIND_TO_HEX', () => {
    it('should contain all 21 original colors', () => {
      expect(Object.keys(TAILWIND_TO_HEX).length).toBe(21)
    })

    it('should have valid hex values', () => {
      Object.values(TAILWIND_TO_HEX).forEach((hex) => {
        expect(hex).toMatch(/^#[a-f0-9]{6}$/i)
      })
    })

    it('should have valid Tailwind class keys', () => {
      Object.keys(TAILWIND_TO_HEX).forEach((key) => {
        expect(key).toMatch(/^bg-[a-z]+-\d+$/)
      })
    })
  })

  describe('migrateColor', () => {
    it('should pass through hex values unchanged', () => {
      expect(migrateColor('#ef4444')).toBe('#ef4444')
      expect(migrateColor('#3b82f6')).toBe('#3b82f6')
      expect(migrateColor('#FFFFFF')).toBe('#FFFFFF')
    })

    it('should convert common Tailwind classes to hex', () => {
      expect(migrateColor('bg-red-500')).toBe('#ef4444')
      expect(migrateColor('bg-blue-500')).toBe('#3b82f6')
      expect(migrateColor('bg-green-500')).toBe('#22c55e')
    })

    it('should convert gray-ish Tailwind classes', () => {
      expect(migrateColor('bg-slate-200')).toBe('#e2e8f0')
      expect(migrateColor('bg-neutral-200')).toBe('#e5e5e5')
    })

    it('should convert all original colors', () => {
      expect(migrateColor('bg-orange-500')).toBe('#f97316')
      expect(migrateColor('bg-amber-400')).toBe('#fbbf24')
      expect(migrateColor('bg-yellow-300')).toBe('#fde047')
      expect(migrateColor('bg-lime-400')).toBe('#a3e635')
      expect(migrateColor('bg-emerald-500')).toBe('#10b981')
      expect(migrateColor('bg-teal-500')).toBe('#14b8a6')
      expect(migrateColor('bg-cyan-500')).toBe('#06b6d4')
      expect(migrateColor('bg-sky-500')).toBe('#0ea5e9')
      expect(migrateColor('bg-indigo-500')).toBe('#6366f1')
      expect(migrateColor('bg-violet-500')).toBe('#8b5cf6')
      expect(migrateColor('bg-purple-500')).toBe('#a855f7')
      expect(migrateColor('bg-fuchsia-500')).toBe('#d946ef')
      expect(migrateColor('bg-pink-500')).toBe('#ec4899')
      expect(migrateColor('bg-rose-500')).toBe('#f43f5e')
    })

    it('should fallback to default for unknown classes', () => {
      expect(migrateColor('bg-unknown-999')).toBe('#ef4444')
      expect(migrateColor('invalid')).toBe('#ef4444')
    })
  })
})

