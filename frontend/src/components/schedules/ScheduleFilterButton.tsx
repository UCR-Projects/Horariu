import { useState } from 'react'
import { Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ResponsiveTooltip } from '@/components/shared'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { useI18n } from '@/hooks/useI18n'
import { TimeFilterDialog } from './TimeFilterModal'

export function ScheduleFilterButton() {
  const { t } = useI18n('schedules')
  const { activeFilters, setFilter, clearFilters } = useScheduleFilterStore()
  const clearCells = useTimeFilterStore((state) => state.clearCells)
  const blockedCount = useTimeFilterStore((state) => state.selectedCells.size)

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const activeToggleCount = Object.values(activeFilters).filter(Boolean).length
  const totalActive = activeToggleCount + blockedCount

  const openTimeDialog = () => {
    setPopoverOpen(false)
    setDialogOpen(true)
  }

  const clearAll = () => {
    clearFilters()
    clearCells()
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <ResponsiveTooltip content={t('filters.title')}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 cursor-pointer gap-1"
              aria-label={t('filters.title')}
            >
              <Filter className="h-4 w-4" />
              {totalActive > 0 && (
                <Badge variant="secondary" className="px-1.5 py-0 text-xs">
                  {totalActive}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
        </ResponsiveTooltip>

        <PopoverContent align="end" className="w-64 p-3">
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('filters.title')}
            </p>

            <div className="flex items-center justify-between">
              <label htmlFor="filter-saved-first" className="text-sm cursor-pointer select-none">
                {t('filters.savedFirst')}
              </label>
              <Switch
                id="filter-saved-first"
                checked={activeFilters.savedFirst}
                onCheckedChange={(checked) => setFilter('savedFirst', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="filter-least-gaps" className="text-sm cursor-pointer select-none">
                {t('filters.leastGaps')}
              </label>
              <Switch
                id="filter-least-gaps"
                checked={activeFilters.leastGaps}
                onCheckedChange={(checked) => setFilter('leastGaps', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="filter-consecutive" className="text-sm cursor-pointer select-none">
                {t('filters.consecutiveClasses')}
              </label>
              <Switch
                id="filter-consecutive"
                checked={activeFilters.consecutiveClasses}
                onCheckedChange={(checked) => setFilter('consecutiveClasses', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="filter-early-finish" className="text-sm cursor-pointer select-none">
                {t('filters.earlyFinish')}
              </label>
              <Switch
                id="filter-early-finish"
                checked={activeFilters.earlyFinish}
                onCheckedChange={(checked) => setFilter('earlyFinish', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="filter-late-start" className="text-sm cursor-pointer select-none">
                {t('filters.lateStart')}
              </label>
              <Switch
                id="filter-late-start"
                checked={activeFilters.lateStart}
                onCheckedChange={(checked) => setFilter('lateStart', checked)}
              />
            </div>

            <Separator />

            <Button
              variant="outline"
              size="sm"
              onClick={openTimeDialog}
              className="w-full justify-start gap-2 cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              {t('filters.blockHoursButton')}
              {blockedCount > 0 && (
                <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-xs">
                  {blockedCount}
                </Badge>
              )}
            </Button>

            <Separator />

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={totalActive === 0}
              className="w-full cursor-pointer"
            >
              {t('filters.clearAllButton')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <TimeFilterDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
