import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

interface DeleteConfirmationDialogProps {
  itemName: string
  onConfirm: () => void
  triggerClassName?: string
  /** Use span with role="button" instead of button element (for nested button contexts) */
  useSpanTrigger?: boolean

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
  useSpanTrigger = false,
}: DeleteConfirmationDialogProps) => {
  const { t } = useI18n(['common', 'courses'])
  const [open, setOpen] = useState(false)

  const handleTriggerClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTriggerClick(e)
    }
  }

  const triggerContent = (
    <Trash2 className="h-4 w-4 text-neutral-600" aria-hidden="true" />
  )

  const triggerProps = {
    'aria-label': t('accessibility.deleteItem', { itemName }),
    className: `inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors cursor-pointer ${triggerClassName || ''}`,
    onClick: handleTriggerClick,
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {useSpanTrigger ? (
        <span
          role="button"
          tabIndex={0}
          {...triggerProps}
          onKeyDown={handleKeyDown}
        >
          {triggerContent}
        </span>
      ) : (
        <button type="button" {...triggerProps}>
          {triggerContent}
        </button>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || t('courses:confirmations.deleteItem.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              t('courses:confirmations.deleteItem.description', { itemName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            {cancelLabel || t('common:actions.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer dark:text-neutral-50'
          >
            {confirmLabel || t('common:actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationDialog
