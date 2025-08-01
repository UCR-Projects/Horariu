import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from '@/locales/en/translation.json'
import translationES from '@/locales/es/translation.json'
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    es: {
      translation: translationES,
    },
  },
  lng: localStorage.getItem('language') || 'es', // Navigator language or Spanish
  fallbackLng: 'es', // Fallback language is Spanish
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
