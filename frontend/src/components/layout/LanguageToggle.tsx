import { useLanguage } from '@/hooks/useI18n'
import { Languages } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

export function LanguageToggleButton() {
  const { language, changeLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es'
    changeLanguage(newLang)
  }

  const getCurrentLanguageLabel = () => {
    return language === 'es' ? 'ES' : 'EN'
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleLanguage}
          className='flex items-center gap-2 w-fit px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:w-fit pointer cursor-pointer'
        >
          <Languages className='h-4 w-4' />
          <span className='group-data-[collapsible=icon]:hidden'>
            {getCurrentLanguageLabel()}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
