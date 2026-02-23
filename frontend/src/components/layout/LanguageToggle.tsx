import { useLanguage } from '@/hooks/useI18n'
import { Languages } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { tokens } from '@/styles'

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
          className='flex items-center gap-2 w-fit px-3 py-2 text-sm font-medium text-foreground hover:bg-interactive-hover rounded-md transition-colors duration-200 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:w-fit pointer cursor-pointer'
        >
          <Languages className={tokens.icon.sm} />
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
