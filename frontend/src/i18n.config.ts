import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from './public/locales/en/translation.json'
import translationES from './public/locales/es/translation.json'
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    es: {
      translation: translationES,
    },
  },
  lng: navigator.language || 'es', // Navigator language or Spanish
  fallbackLng: 'es', // Fallback language is Spanish
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
