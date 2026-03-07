import { useI18n } from '@/hooks/useI18n'
import useScheduleStore from '@/stores/useScheduleStore'
import { CalendarDays, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { tokens } from '@/styles'

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse-subtle" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className={`${tokens.icon.xl} text-muted-foreground animate-pulse-subtle`} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-muted rounded animate-pulse-subtle" />
          <div className="h-3 w-48 bg-muted rounded animate-pulse-subtle" />
        </div>
      </div>
    </div>
  )
}

const EmptyStateMessage = () => {
  const { t } = useI18n('schedules')

  return (
    <EmptyState
      icon={CalendarDays}
      title={t('emptyState.title')}
      description={t('emptyState.description')}
      className="min-h-[60vh]"
    />
  )
}

const EmptySchedulesBanner = () => {
  const isLoading = useScheduleStore((state) => state.isLoading)

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return <EmptyStateMessage />
}

export default EmptySchedulesBanner
