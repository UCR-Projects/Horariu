import { BroomIcon } from '@/assets/icons/Icons'
import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ClearCoursesButton() {
  const { t } = useTranslation()
  const { clearAllCourses, courses } = useCourseStore()

  if (!courses || courses.length < 2) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={clearAllCourses}
          className='p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors cursor-pointer'
        >
          <BroomIcon className='text-neutral-600' />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('clearAllCourses')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
