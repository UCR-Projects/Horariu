import { useTranslation } from 'react-i18next'
import type { Namespace } from '@/locales/types'

/**
 * Custom hook for i18n with better TypeScript support
 *
 * @example
 * // Using default namespace (common)
 * const { t } = useI18n()
 * t('actions.save') // "Guardar" or "Save"
 *
 * @example
 * // Using specific namespace
 * const { t } = useI18n('courses')
 * t('addCourse') // "Agregar Curso" or "Add Course"
 *
 * @example
 * // Using multiple namespaces
 * const { t } = useI18n(['common', 'courses'])
 * t('common:actions.save')
 * t('courses:addCourse')
 */
export const useI18n = (ns?: Namespace | Namespace[]) => {
  return useTranslation(ns)
}

/**
 * Hook for changing language
 *
 * @example
 * const { language, changeLanguage, availableLanguages } = useLanguage()
 *
 * changeLanguage('en') // Switch to English
 * changeLanguage('es') // Switch to Spanish
 */
export const useLanguage = () => {
  const { i18n } = useTranslation()

  return {
    language: i18n.language,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
    availableLanguages: ['es', 'en'] as const,
  }
}
