import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { useI18n } from '@/hooks/useI18n'
import ScheduleFilter from './ScheduleFilter'

interface TimeFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimeFilterDialog({ open, onOpenChange }: TimeFilterDialogProps) {
  const { t } = useI18n(['common', 'schedules'])

  const clearCells = useTimeFilterStore((state) => state.clearCells)
  const count = useTimeFilterStore((state) => state.selectedCells.size)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('schedules:timeFilter.title')}</DialogTitle>
          <DialogDescription>
            {t('schedules:timeFilter.description')}
          </DialogDescription>
          <p className={`text-xs font-medium ${count > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
            {count > 0
              ? t('schedules:timeFilter.activeFilters', { count })
              : t('schedules:timeFilter.noFilters')}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <ScheduleFilter />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCells}
            disabled={count === 0}
            className="cursor-pointer"
          >
            {t('schedules:timeFilter.clearAll')}
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)} className="cursor-pointer">
            {t('common:actions.done')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
