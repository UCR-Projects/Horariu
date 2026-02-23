// Component-specific style patterns
// Reusable class combinations for consistency

import { tokens } from './tokens'

// ===========================================
// INTERACTIVE ELEMENTS (buttons, clickable items)
// ===========================================
export const interactive = {
  // Ghost button hover states
  ghostHover: 'hover:bg-interactive-hover cursor-pointer transition-colors',

  // List item hover (courses, groups, etc.)
  listItemHover: 'hover:bg-interactive-hover transition-colors',

  // Subtle hover for nested items
  subtleHover: 'hover:bg-interactive-subtle transition-colors',
}

// ===========================================
// LIST ITEMS (course list, group list, etc.)
// ===========================================
export const listItem = {
  base: 'flex items-center justify-between rounded-md transition-colors',
  course:
    'w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-interactive-hover border border-transparent hover:border-border',
  group: 'px-3 py-1 rounded-md text-sm hover:bg-interactive-hover',
  inactive: 'opacity-50',
}

// ===========================================
// ICONS
// ===========================================
export const icon = {
  muted: 'text-icon-muted',
  default: 'text-icon-default',
  // Size + color combinations
  smallMuted: `${tokens.icon.xs} text-icon-muted`,
  defaultMuted: `${tokens.icon.sm} text-icon-muted`,
}

// ===========================================
// TABLE (schedule table)
// ===========================================
export const table = {
  border: 'border border-table-border',
  cell: 'border border-table-border',
  header: 'border border-table-border font-normal',
}

// ===========================================
// TEXT STYLES
// ===========================================
export const text = {
  muted: 'text-muted-foreground',
  label: 'text-xs italic text-muted-foreground',
  empty: 'text-xs text-muted-foreground',
}

