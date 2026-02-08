/**
 * i18n TypeScript types for type-safe translations
 */

import es from './es'

/**
 * Available namespaces
 */
export type Namespace =
  | 'common'
  | 'courses'
  | 'schedules'
  | 'validation'
  | 'errors'
  | 'info'

/**
 * Translation resources type (inferred from Spanish translations)
 */
export type Resources = typeof es

/**
 * Translation keys for each namespace
 */
export type TranslationKeys = {
  common: keyof Resources['common']
  courses: keyof Resources['courses']
  schedules: keyof Resources['schedules']
  validation: keyof Resources['validation']
  errors: keyof Resources['errors']
  info: keyof Resources['info']
}

/**
 * Extend i18next types for better autocomplete
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: Resources
  }
}
