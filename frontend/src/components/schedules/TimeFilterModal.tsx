import { Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { useI18n } from '@/hooks/useI18n'
import { useState } from 'react'
import ScheduleFilter from './ScheduleFilter'

export function TimeFilterModal() {
  const { t } = useI18n(['common', 'schedules'])
  const [open, setOpen] = useState(false)

  const clearCells = useScheduleFilterStore((state) => state.clearCells)
  const count = useScheduleFilterStore((state) => state.selectedCells.size)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full md:w-auto gap-2 cursor-pointer"
      >
        <Clock className="h-4 w-4" />
        {t('schedules:timeFilter.button')}
        {count > 0 && (
          <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
            {count}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('schedules:timeFilter.title')}</DialogTitle>
            <DialogDescription>
              {t('schedules:timeFilter.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <ScheduleFilter />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border mt-2 shrink-0">
            <span className="text-sm text-muted-foreground">
              {count > 0
                ? t('schedules:timeFilter.activeFilters', { count })
                : t('schedules:timeFilter.noFilters')}
            </span>
            <div className="flex gap-2">
              {count > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCells}
                  className="gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  {t('schedules:timeFilter.clearAll')}
                </Button>
              )}
              <Button size="sm" onClick={() => setOpen(false)} className="cursor-pointer">
                {t('common:actions.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
