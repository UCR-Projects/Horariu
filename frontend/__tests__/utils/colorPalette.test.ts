import { describe, it, expect } from 'vitest'
import {
  COLOR_PALETTE,
  DEFAULT_COLOR,
  getAllColors,
  getColorInfo,
} from '@/utils/colorPalette'

describe('colorPalette', () => {
  describe('COLOR_PALETTE', () => {
    it('should have 9 color families', () => {
      expect(COLOR_PALETTE.length).toBe(9)
    })

    it('should have 5 shades per family', () => {
      COLOR_PALETTE.forEach((family) => {
        expect(family.shades.length).toBe(5)
        expect(family.shades.map((s) => s.name)).toEqual([
          'lighter',
          'light',
          'medium',
          'dark',
          'darker',
        ])
      })
    })

    it('should have valid hex values for all shades', () => {
      COLOR_PALETTE.forEach((family) => {
        family.shades.forEach((shade) => {
          expect(shade.hex).toMatch(/^#[a-f0-9]{6}$/i)
        })
      })
    })

    it('should contain expected color families', () => {
      const familyNames = COLOR_PALETTE.map((f) => f.name)
      expect(familyNames).toContain('Red')
      expect(familyNames).toContain('Blue')
      expect(familyNames).toContain('Green')
      expect(familyNames).toContain('Neutral')
    })
  })

  describe('DEFAULT_COLOR', () => {
    it('should be a valid hex color', () => {
      expect(DEFAULT_COLOR).toMatch(/^#[a-f0-9]{6}$/i)
    })

    it('should be red medium', () => {
      expect(DEFAULT_COLOR).toBe('#ef4444')
    })
  })

  describe('getAllColors', () => {
    it('should return flat array of all colors', () => {
      const colors = getAllColors()
      expect(colors.length).toBe(45) // 9 families * 5 shades
    })

    it('should have correct structure for each color', () => {
      const colors = getAllColors()
      colors.forEach((color) => {
        expect(color).toHaveProperty('hex')
        expect(color).toHaveProperty('family')
        expect(color).toHaveProperty('shade')
        expect(color.hex).toMatch(/^#[a-f0-9]{6}$/i)
        expect(['lighter', 'light', 'medium', 'dark', 'darker']).toContain(color.shade)
      })
    })
  })

  describe('getColorInfo', () => {
    it('should find color info by hex', () => {
      const info = getColorInfo('#ef4444')
      expect(info).toEqual({ family: 'Red', shade: 'medium' })
    })

    it('should handle uppercase hex', () => {
      const info = getColorInfo('#EF4444')
      expect(info).toEqual({ family: 'Red', shade: 'medium' })
    })

    it('should return null for unknown hex', () => {
      expect(getColorInfo('#123456')).toBeNull()
    })

    it('should find different shades', () => {
      expect(getColorInfo('#fca5a5')).toEqual({ family: 'Red', shade: 'light' })
      expect(getColorInfo('#b91c1c')).toEqual({ family: 'Red', shade: 'darker' })
    })
  })
})

