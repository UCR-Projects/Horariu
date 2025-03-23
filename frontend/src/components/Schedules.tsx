import useScheduleStore from '@/stores/useScheduleStore'
import ScheduleTable from '@/components/ScheduleTable'
import EmptyScheduleTable from './EmptyScheduleTable'

const Schedules = () => {
  const { scheduleData } = useScheduleStore()

  if (!scheduleData) return null

  return (
    <div className='w-full max-w-8xl mx-auto p-2 pb-0'>
      {scheduleData?.schedules?.length > 0 ? (
        scheduleData.schedules.map((_, scheduleIndex) => (
          <ScheduleTable
            key={scheduleIndex}
            scheduleData={scheduleData}
            scheduleIndex={scheduleIndex}
          />
        ))
      ) : (
        <EmptyScheduleTable />
      )}
    </div>
  )
}

export default Schedules
