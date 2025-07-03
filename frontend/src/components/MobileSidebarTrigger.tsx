import { Button } from './ui/button'
import { useSidebar } from './ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const MobileSidebarTrigger = () => {
  const { t } = useTranslation()
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <div className='pb-2'>
      <Button
        variant='outline'
        onClick={toggleSidebar}
        className='w-full md:w-auto px-4 py-2 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900'
      >
        <BookOpen className='h-4 w-4 mr-2' />
        {t('seeCourses')}
      </Button>
    </div>
  )
}
