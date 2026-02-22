import { useI18n } from '@/hooks/useI18n'
import useScheduleStore from '@/stores/useScheduleStore'
import { CalendarDays, Plus, Sparkles } from 'lucide-react'

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-neutral-400 dark:text-neutral-500 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-3 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

const EmptyStateMessage = () => {
  const { t } = useI18n('schedules')

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center text-center px-6 max-w-lg">
        <div className="relative mb-6">
          <div className="rounded-2xl bg-neutral-200/50 dark:bg-neutral-700/30 p-5">
            <CalendarDays className="h-12 w-12 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-neutral-300 dark:bg-neutral-600 p-1.5">
            <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
          {t('emptyState.title')}
        </h3>

        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {t('emptyState.description')}
        </p>
      </div>
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
