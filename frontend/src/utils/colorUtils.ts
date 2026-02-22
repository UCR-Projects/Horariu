/**
 * Color utility functions for luminance calculation and contrast detection
 */

/**
 * Convert hex color string to RGB array
 * @param hex - Hex color string (with or without #)
 * @returns RGB array [r, g, b] where each value is 0-255
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0]
}

/**
 * Calculate relative luminance of a hex color using WCAG formula
 * @param hex - Hex color string
 * @returns Luminance value between 0 (black) and 1 (white)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  const [r, g, b] = rgb.map((c) => {
    const normalized = c / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Get contrasting text color (dark or light) for a background color
 * @param backgroundHex - Background hex color string
 * @returns '#171717' (neutral-900) for light backgrounds, '#fafafa' (neutral-50) for dark
 */
export function getContrastTextColor(backgroundHex: string): string {
  const luminance = getLuminance(backgroundHex)
  return luminance > 0.5 ? '#171717' : '#fafafa'
}

