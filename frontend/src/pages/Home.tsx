import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import useScheduleStore from '@/stores/useScheduleStore'
import { useI18n } from '@/hooks/useI18n'
import { SchedulesList, GenerateScheduleButton } from '@/components/schedules'
import { LoadSampleDataButtons } from '@/components/courses'
import { MobileSidebarTrigger } from '@/components/sidebar'

const Home = () => {
  const { t } = useI18n('schedules')
  const scheduleData = useScheduleStore((state) => state.scheduleData)
  const isLoading = useScheduleStore((state) => state.isLoading)

  const schedulesCount = scheduleData?.schedules?.length || 0
  const showBadge = isLoading || schedulesCount > 0

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 mb-2">
          <div className="w-full md:w-auto">
            <LoadSampleDataButtons />
            <MobileSidebarTrigger />
            <GenerateScheduleButton />
          </div>

          {showBadge && (
            <div className="w-full md:w-auto">
              <Badge
                variant="outline"
                className="w-full md:w-auto py-2 px-4 text-sm font-medium dark:border-neutral-700 rounded-full dark:bg-neutral-950/10 flex justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="font-semibold mr-1">{schedulesCount}</span>
                    {schedulesCount === 1 ? t('possibleSchedule') : t('possibleSchedules')}
                  </span>
                )}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <SchedulesList />
    </>
  )
}

export default Home
