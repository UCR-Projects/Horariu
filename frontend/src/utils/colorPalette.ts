/**
 * Structured color palette with families and shades
 */

export type ShadeName = 'lighter' | 'light' | 'medium' | 'dark' | 'darker'
export type ShadeNameWithCustom = ShadeName | 'custom'

export interface ColorShade {
  name: ShadeName
  hex: string
}

export interface ColorFamily {
  name: string
  shades: ColorShade[]
}

export const COLOR_PALETTE: ColorFamily[] = [
  {
    name: 'Red',
    shades: [
      { name: 'lighter', hex: '#fecaca' },
      { name: 'light', hex: '#fca5a5' },
      { name: 'medium', hex: '#ef4444' },
      { name: 'dark', hex: '#dc2626' },
      { name: 'darker', hex: '#b91c1c' },
    ],
  },
  {
    name: 'Orange',
    shades: [
      { name: 'lighter', hex: '#fed7aa' },
      { name: 'light', hex: '#fdba74' },
      { name: 'medium', hex: '#f97316' },
      { name: 'dark', hex: '#ea580c' },
      { name: 'darker', hex: '#c2410c' },
    ],
  },
  {
    name: 'Yellow',
    shades: [
      { name: 'lighter', hex: '#fef08a' },
      { name: 'light', hex: '#fde047' },
      { name: 'medium', hex: '#eab308' },
      { name: 'dark', hex: '#ca8a04' },
      { name: 'darker', hex: '#a16207' },
    ],
  },
  {
    name: 'Green',
    shades: [
      { name: 'lighter', hex: '#bbf7d0' },
      { name: 'light', hex: '#86efac' },
      { name: 'medium', hex: '#22c55e' },
      { name: 'dark', hex: '#16a34a' },
      { name: 'darker', hex: '#15803d' },
    ],
  },

  {
    name: 'Blue',
    shades: [
      { name: 'lighter', hex: '#bfdbfe' },
      { name: 'light', hex: '#93c5fd' },
      { name: 'medium', hex: '#3b82f6' },
      { name: 'dark', hex: '#2563eb' },
      { name: 'darker', hex: '#1d4ed8' },
    ],
  },
  {
    name: 'Purple',
    shades: [
      { name: 'lighter', hex: '#e9d5ff' },
      { name: 'light', hex: '#d8b4fe' },
      { name: 'medium', hex: '#a855f7' },
      { name: 'dark', hex: '#9333ea' },
      { name: 'darker', hex: '#7e22ce' },
    ],
  },
  {
    name: 'Pink',
    shades: [
      { name: 'lighter', hex: '#fbcfe8' },
      { name: 'light', hex: '#f9a8d4' },
      { name: 'medium', hex: '#ec4899' },
      { name: 'dark', hex: '#db2777' },
      { name: 'darker', hex: '#be185d' },
    ],
  },
  {
    name: 'Neutral',
    shades: [
      { name: 'lighter', hex: '#e5e5e5' },
      { name: 'light', hex: '#d4d4d4' },
      { name: 'medium', hex: '#737373' },
      { name: 'dark', hex: '#525252' },
      { name: 'darker', hex: '#404040' },
    ],
  },
]

export const DEFAULT_COLOR = '#ef4444' // Red medium

/**
 * Get all colors as a flat array
 */
export function getAllColors(): { hex: string; family: string; shade: ShadeName }[] {
  return COLOR_PALETTE.flatMap((family) =>
    family.shades.map((shade) => ({
      hex: shade.hex,
      family: family.name,
      shade: shade.name,
    }))
  )
}

/**
 * Find color info by hex value
 * @param hex - Hex color string to look up
 * @returns Color family and shade name, or null if not found
 */
export function getColorInfo(
  hex: string
): { family: string; shade: ShadeNameWithCustom } | null {
  const normalizedHex = hex.toLowerCase()
  for (const family of COLOR_PALETTE) {
    for (const shade of family.shades) {
      if (shade.hex.toLowerCase() === normalizedHex) {
        return { family: family.name, shade: shade.name }
      }
    }
  }
  // Return Custom for any valid hex not in palette
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    return { family: 'Custom', shade: 'custom' }
  }
  return null
}

