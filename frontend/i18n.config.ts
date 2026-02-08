import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en'
import es from '@/locales/es'

/**
 * Get stored language from localStorage (SSR-safe)
 */
const getStoredLanguage = (): string => {
  if (typeof window === 'undefined') return 'es'
  return localStorage.getItem('language') || 'es'
}

/**
 * i18n configuration with namespaces
 * Namespaces: common, courses, schedules, validation, errors, info
 */
i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
  },
  lng: getStoredLanguage(),
  fallbackLng: 'es',
  defaultNS: 'common',
  ns: ['common', 'courses', 'schedules', 'validation', 'errors', 'info'],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

/**
 * Save language preference to localStorage when changed
 */
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng)
  }
})

export default i18n
