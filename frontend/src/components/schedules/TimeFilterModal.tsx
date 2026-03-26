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
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useI18n } from '@/hooks/useI18n'
import { table } from '@/styles'
import { useState } from 'react'
import { Day, TimeRange } from '@/types'

export function TimeFilterModal() {
  const { t } = useI18n(['common', 'schedules'])
  const [open, setOpen] = useState(false)

  const {
    toggleCell,
    toggleDay,
    toggleHour,
    clearCells,
    isCellSelected,
    isDayFullySelected,
    isHourFullySelected,
    selectedCount,
  } = useScheduleFilterStore()

  const count = selectedCount()

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
            <div className="min-w-[600px]">
              <table className="w-full border-collapse transition-colors duration-100">
                <thead>
                  <tr>
                    <th className={`${table.border} w-16 md:w-28 p-2 text-sm font-normal text-muted-foreground`}>
                      {t('common:time.hours')}
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        onClick={() => toggleDay(day as Day)}
                        className={`${table.border} w-20 md:w-28 h-14 p-2 text-sm cursor-pointer select-none transition-colors
                          ${isDayFullySelected(day as Day)
                            ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground'
                            : 'hover:bg-interactive-active'
                          }`}
                      >
                        <span className="hidden md:inline">
                          ({t(`common:days.${day}.short`)}) {t(`common:days.${day}.name`)}
                        </span>
                        <span className="md:hidden">
                          {t(`common:days.${day}.short`)}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_RANGES.map((hour) => (
                    <tr key={hour}>
                      <td
                        onClick={() => toggleHour(hour as TimeRange)}
                        className={`${table.border} p-1 text-center text-xs cursor-pointer select-none transition-colors w-16 md:w-28 h-10
                          ${isHourFullySelected(hour as TimeRange)
                            ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground'
                            : 'hover:bg-interactive-active'
                          }`}
                      >
                        {hour}
                      </td>
                      {DAYS.map((day) => (
                        <td
                          key={`${day}-${hour}`}
                          onClick={() => toggleCell(hour as TimeRange, day as Day)}
                          className={`${table.border} cursor-pointer select-none transition-colors w-20 md:w-28 h-10
                            ${isCellSelected(hour as TimeRange, day as Day)
                              ? 'bg-destructive/20 hover:bg-destructive/30'
                              : 'hover:bg-interactive-active'
                            }`}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
