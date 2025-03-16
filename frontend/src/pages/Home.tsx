import Schedule from '@/components/Schedule'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'
import useScheduleStore from '@/stores/useScheduleStore'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()
  const { generateSchedule, isLoading, isSuccess, error } =
    useGenerateSchedule()
  const { scheduleData } = useScheduleStore()

  useEffect(() => {
    if (isSuccess) {
      toast.success('Schedule generated successfully', {
        className: 'bg-green-500 text-white border border-green-600',
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      toast.error('Error generating schedule')
    }
  }, [error])

  const schedulesCount = scheduleData?.schedules?.length || 0
  const showBadge = isLoading || schedulesCount > 0

  return (
    <>
      <div>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2'>
          <div className='w-full md:w-auto'>
            <Button
              onClick={() => generateSchedule()}
              disabled={isLoading}
              className='w-full md:w-auto px-4 py-2 font-medium'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  {t('generating')}...
                </>
              ) : (
                <>
                  <Calendar className='mr-2 h-5 w-5' />
                  {t('generateSchedules')}
                </>
              )}
            </Button>
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

      <Schedule />
    </>
  )
}

export default Home
