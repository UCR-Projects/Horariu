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

// Table style variants for user preference
// Uses --table-border which is black in light mode and white in dark mode
export const tableStyles = {
  classic: {
    table: 'border-collapse',
    headerCell: 'border border-table-border/70',
    timeCell: 'border border-table-border/70 font-normal',
    dataCell: 'border border-table-border/70',
    dataCellWithCourse: 'border border-table-border/70',
  },
  rounded: {
    table: 'border-separate border-spacing-0 rounded-xl overflow-hidden border border-table-border/30',
    headerCell: 'border border-table-border/20 bg-muted/50 first:rounded-tl-lg last:rounded-tr-lg',
    timeCell: 'border border-table-border/20 bg-muted/30 font-normal',
    dataCell: 'border border-table-border/20',
    dataCellWithCourse: 'border border-table-border/20',
  },
  floating: {
    table: 'border-separate border-spacing-0.5',
    headerCell: 'rounded-md bg-accent/80 font-semibold',
    timeCell: 'rounded-md bg-accent/60 font-normal',
    dataCell: 'rounded-md bg-muted',
    dataCellWithCourse: 'rounded-md shadow-md',
  },
  minimal: {
    table: 'border-collapse',
    headerCell: 'border-b-2 border-table-border/60 bg-accent/80 font-semibold',
    timeCell: 'border-b border-table-border/40 border-r border-table-border/15 bg-accent/40 font-normal',
    dataCell: 'border-b border-table-border/40 border-r border-table-border/15 bg-muted/50',
    dataCellWithCourse: 'border-b border-table-border/40 border-r border-table-border/15',
  },
  glass: {
    table: 'border-separate border-spacing-0.5',
    headerCell: 'rounded-md bg-primary/15 border border-primary/20',
    timeCell: 'rounded-md bg-primary/10 border border-primary/10 font-normal',
    dataCell: 'rounded-md bg-muted/40 border border-primary/5',
    dataCellWithCourse: 'rounded-md border border-primary/10 shadow-md',
  },
} as const

// ===========================================
// TEXT STYLES
// ===========================================
export const text = {
  muted: 'text-muted-foreground',
  label: 'text-xs italic text-muted-foreground',
  empty: 'text-xs text-muted-foreground',
}

