import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Loader2, Calendar } from 'lucide-react'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import useScheduleStore from '@/stores/useScheduleStore'
import useCourseStore from '@/stores/useCourseStore'
import { useTranslation } from 'react-i18next'

const GenerateScheduleButton = () => {
  const { t } = useTranslation()
  const { generateSchedule } = useGenerateSchedule()
  const { isLoading } = useScheduleStore()
  const { courses } = useCourseStore()

  const hasCourses = courses.length > 0
  const isDisabled = !hasCourses || isLoading

  const buttonContent = isLoading ? (
    <>
      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
      {t('generating')}...
    </>
  ) : (
    <>
      <Calendar className='mr-2 h-5 w-5' />
      {t('generateSchedules')}
    </>
  )

  const button = (
    <Button
      onClick={() => generateSchedule(courses)}
      disabled={isDisabled}
      className='w-full md:w-auto px-4 py-2 font-medium disabled:text-neutral-400 disabled:bg-neutral-900'
    >
      {buttonContent}
    </Button>
  )

  if (!hasCourses) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='w-full md:w-auto'>{button}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('mustAddACourse')}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export default GenerateScheduleButton
