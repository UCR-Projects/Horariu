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
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DeleteCourseDialogProps {
  courseName: string
  onConfirm: () => void
}

const DeleteCourseDialog = ({
  courseName,
  onConfirm,
}: DeleteCourseDialogProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7 dark:hover:bg-neutral-900/80 cursor-pointer'
        >
          <Trash2 className='h-4 w-4 text-neutral-600' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmDeleteCourse')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmDeleteCourseDescription', { courseName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer dark:text-neutral-50'
          >
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCourseDialog
