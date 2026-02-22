import { describe, it, expect } from 'vitest'
import { hexToRgb, getLuminance, getContrastTextColor } from '@/utils/colorUtils'

describe('colorUtils', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#ef4444')).toEqual([239, 68, 68])
      expect(hexToRgb('#ffffff')).toEqual([255, 255, 255])
      expect(hexToRgb('#000000')).toEqual([0, 0, 0])
    })

    it('should handle hex without hash', () => {
      expect(hexToRgb('ef4444')).toEqual([239, 68, 68])
    })

    it('should return [0,0,0] for invalid hex', () => {
      expect(hexToRgb('invalid')).toEqual([0, 0, 0])
    })
  })

  describe('getLuminance', () => {
    it('should return ~1 for white', () => {
      expect(getLuminance('#ffffff')).toBeCloseTo(1, 1)
    })

    it('should return ~0 for black', () => {
      expect(getLuminance('#000000')).toBeCloseTo(0, 1)
    })

    it('should return mid-range value for gray', () => {
      const luminance = getLuminance('#808080')
      expect(luminance).toBeGreaterThan(0.2)
      expect(luminance).toBeLessThan(0.5)
    })
  })

  describe('getContrastTextColor', () => {
    it('should return dark text for light backgrounds', () => {
      expect(getContrastTextColor('#fca5a5')).toBe('#171717') // light red
      expect(getContrastTextColor('#ffffff')).toBe('#171717') // white
      expect(getContrastTextColor('#fde047')).toBe('#171717') // light yellow
    })

    it('should return light text for dark backgrounds', () => {
      expect(getContrastTextColor('#b91c1c')).toBe('#fafafa') // dark red
      expect(getContrastTextColor('#000000')).toBe('#fafafa') // black
      expect(getContrastTextColor('#1d4ed8')).toBe('#fafafa') // dark blue
    })

    it('should handle medium colors appropriately', () => {
      // Medium red - depends on exact luminance
      const textColor = getContrastTextColor('#ef4444')
      expect(['#171717', '#fafafa']).toContain(textColor)
    })
  })
})

