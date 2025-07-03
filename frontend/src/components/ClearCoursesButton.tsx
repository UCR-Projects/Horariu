import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function ClearCoursesButton() {
  const { t } = useTranslation()
  const { clearAllCourses } = useCourseStore()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className='flex items-center gap-2 cursor-pointer'
          onSelect={(e) => {
            e.preventDefault()
          }}
        >
          {t('Eliminar Cursos')}
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmClearAllCourses')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmClearAllCoursesDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={clearAllCourses}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer dark:text-neutral-50'
          >
            {t('clearAll')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
