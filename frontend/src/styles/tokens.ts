// Design System Tokens
// Single source of truth for all design values

export const tokens = {
  // ===========================================
  // ICON SIZES
  // ===========================================
  icon: {
    xs: 'h-3 w-3', // 12px - tiny indicators
    sm: 'h-4 w-4', // 16px - default icons
    md: 'h-5 w-5', // 20px - medium icons
    lg: 'h-6 w-6', // 24px - large icons
    xl: 'h-7 w-7', // 28px - extra large
  },

  // ===========================================
  // BUTTON/INTERACTIVE ELEMENT SIZES
  // ===========================================
  interactive: {
    xs: 'h-6 w-6', // tiny buttons
    sm: 'h-7 w-7', // small buttons
    md: 'h-8 w-8', // medium buttons
    lg: 'h-9 w-9', // large buttons
    xl: 'h-10 w-10', // extra large buttons
  },

  // ===========================================
  // SPACING (consistent gaps and padding)
  // ===========================================
  spacing: {
    xs: '1', // 4px
    sm: '2', // 8px
    md: '3', // 12px
    lg: '4', // 16px
    xl: '6', // 24px
  },

  // ===========================================
  // TYPOGRAPHY
  // ===========================================
  text: {
    xs: 'text-xs', // 12px
    sm: 'text-sm', // 14px
    base: 'text-base', // 16px
    lg: 'text-lg', // 18px
    xl: 'text-xl', // 20px
    '2xl': 'text-2xl', // 24px
  },

  // ===========================================
  // BORDER RADIUS
  // ===========================================
  radius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
} as const

// Type exports for autocomplete
export type IconSize = keyof typeof tokens.icon
export type InteractiveSize = keyof typeof tokens.interactive
export type SpacingSize = keyof typeof tokens.spacing
export type TextSize = keyof typeof tokens.text
export type RadiusSize = keyof typeof tokens.radius

