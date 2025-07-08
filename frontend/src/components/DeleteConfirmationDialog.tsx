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
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DeleteConfirmationDialogProps {
  itemName: string
  onConfirm: () => void
  triggerClassName?: string

  title?: string
  description?: string
  cancelLabel?: string
  confirmLabel?: string
}

const DeleteConfirmationDialog = ({
  itemName,
  onConfirm,
  title,
  description,
  cancelLabel,
  confirmLabel,
  triggerClassName,
}: DeleteConfirmationDialogProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span
          className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors cursor-pointer ${triggerClassName || ''}`}
        >
          <Trash2 className='h-4 w-4 text-neutral-600' />
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || t('confirmDeleteItem')}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || t('confirmDeleteItemDescription', { itemName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            {cancelLabel || t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer dark:text-neutral-50'
          >
            {confirmLabel || t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationDialog
