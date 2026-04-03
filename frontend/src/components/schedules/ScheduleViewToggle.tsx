import { List, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScheduleViewStore } from '@/stores/useScheduleViewStore'
import { useI18n } from '@/hooks/useI18n'
import { ResponsiveTooltip } from '@/components/shared'

export function ScheduleViewToggle() {
  const { t } = useI18n('schedules')
  const { viewMode, setViewMode } = useScheduleViewStore()

  return (
    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
      <ResponsiveTooltip content={t('view.list')}>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="h-8 px-3 cursor-pointer"
          aria-label={t('view.switchToList')}
          aria-pressed={viewMode === 'list'}
        >
          <List className="h-4 w-4" />
        </Button>
      </ResponsiveTooltip>

      <ResponsiveTooltip content={t('view.carousel')}>
        <Button
          variant={viewMode === 'carousel' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('carousel')}
          className="h-8 px-3 cursor-pointer"
          aria-label={t('view.switchToCarousel')}
          aria-pressed={viewMode === 'carousel'}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </ResponsiveTooltip>
    </div>
  )
}

