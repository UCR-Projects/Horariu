import { useI18n } from '@/hooks/useI18n'
import useScheduleStore from '@/stores/useScheduleStore'
import { CalendarDays, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { tokens } from '@/styles'

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className={`${tokens.icon.xl} text-muted-foreground animate-pulse`} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

const EmptyStateMessage = () => {
  const { t } = useI18n('schedules')

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full bg-background/30 border-border/40 shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-6">
            <div className="rounded-2xl bg-muted/50 p-5">
              <CalendarDays className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-3">
            {t('emptyState.title')}
          </h3>

          <p className="text-base text-muted-foreground leading-relaxed">
            {t('emptyState.description')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

const EmptyScheduleTable = () => {
  const isLoading = useScheduleStore((state) => state.isLoading)

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return <EmptyStateMessage />
}

export default EmptyScheduleTable
