import { useI18n } from '@/hooks/useI18n'
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
  const { t } = useI18n(['common', 'courses'])
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
          {t('courses:deleteCourses')}
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('courses:confirmations.clearAll.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('courses:confirmations.clearAll.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            {t('common:actions.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={clearAllCourses}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer dark:text-neutral-50'
          >
            {t('common:actions.clearAll')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
