/**
 * Migration utilities for converting Tailwind color classes to hex values
 */

import { DEFAULT_COLOR } from './colorPalette'

/**
 * Mapping of old Tailwind color classes to hex values
 * These are the 21 colors from the original COLORS constant
 */
export const TAILWIND_TO_HEX: Record<string, string> = {
  // Grays (200 shades)
  'bg-slate-200': '#e2e8f0',
  'bg-zinc-200': '#e4e4e7',
  'bg-neutral-200': '#e5e5e5',
  'bg-stone-200': '#e7e5e4',
  // Colors (various shades)
  'bg-red-500': '#ef4444',
  'bg-orange-500': '#f97316',
  'bg-amber-400': '#fbbf24',
  'bg-yellow-300': '#fde047',
  'bg-lime-400': '#a3e635',
  'bg-green-500': '#22c55e',
  'bg-emerald-500': '#10b981',
  'bg-teal-500': '#14b8a6',
  'bg-cyan-500': '#06b6d4',
  'bg-sky-500': '#0ea5e9',
  'bg-blue-500': '#3b82f6',
  'bg-indigo-500': '#6366f1',
  'bg-violet-500': '#8b5cf6',
  'bg-purple-500': '#a855f7',
  'bg-fuchsia-500': '#d946ef',
  'bg-pink-500': '#ec4899',
  'bg-rose-500': '#f43f5e',
}

/**
 * Migrate a color value from old Tailwind format to new hex format
 * @param color - Color value (Tailwind class or hex)
 * @returns Hex color value
 */
export function migrateColor(color: string): string {
  // Already hex format - pass through
  if (color.startsWith('#')) {
    return color
  }

  // Convert Tailwind class to hex
  return TAILWIND_TO_HEX[color] ?? DEFAULT_COLOR
}

