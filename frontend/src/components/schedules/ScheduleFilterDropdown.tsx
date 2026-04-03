import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { useI18n } from '@/hooks/useI18n'
import { ResponsiveTooltip } from '@/components/shared'

export function ScheduleFilterDropdown() {
  const { t } = useI18n('schedules')
  const { activeFilters, setFilter, clearFilters, hasActiveFilters } =
    useScheduleFilterStore()

  return (
    <Popover>
      <ResponsiveTooltip content={t('filters.title')}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 cursor-pointer relative"
            aria-label={t('filters.title')}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilters() && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </PopoverTrigger>
      </ResponsiveTooltip>

      <PopoverContent align="end" className="w-56 p-3">
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

          <Separator />

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={!hasActiveFilters()}
            className="w-full cursor-pointer"
          >
            {t('filters.clearFilters')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
