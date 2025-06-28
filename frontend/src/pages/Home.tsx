import Schedules from '@/components/Schedules'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import useScheduleStore from '@/stores/useScheduleStore'
import { useTranslation } from 'react-i18next'
import LoadSampleDataButtons from '@/components/LoadSampleDataButtons'
import GenerateScheduleButton from '@/components/GenerateScheduleButton'

const Home = () => {
  const { t } = useTranslation()
  const { scheduleData, isLoading } = useScheduleStore()

  const schedulesCount = scheduleData?.schedules?.length || 0
  const showBadge = isLoading || schedulesCount > 0

  return (
    <>
      <div>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 mb-2'>
          <div className='w-full md:w-auto'>
            <LoadSampleDataButtons />
            <GenerateScheduleButton />
          </div>

          {showBadge && (
            <div className='w-full md:w-auto'>
              <Badge
                variant='outline'
                className='w-full md:w-auto py-2 px-4 text-sm font-medium dark:border-neutral-700 rounded-full dark:bg-neutral-950/10 flex justify-center'
              >
                {isLoading ? (
                  <span className='flex items-center'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </span>
                ) : (
                  <span className='flex items-center justify-center'>
                    <span className='font-semibold mr-1'>{schedulesCount}</span>
                    {schedulesCount === 1
                      ? t('possibleSchedule')
                      : t('possibleSchedules')}
                  </span>
                )}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <Schedules />
    </>
  )
}

export default Home
