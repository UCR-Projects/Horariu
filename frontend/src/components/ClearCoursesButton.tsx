import { BroomIcon } from '@/assets/icons/Icons'
import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function ClearCoursesButton() {
  const { t } = useTranslation()
  const { clearAllCourses, courses } = useCourseStore()

  if (!courses || courses.length < 2) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className='p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors cursor-pointer'>
              <BroomIcon className='text-neutral-600' />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmClearAllCourses')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('confirmClearAllCoursesDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearAllCourses}
                className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
              >
                {t('clearAll')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('clearAllCourses')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
