import { Day, TimeRange } from '@/types'
import { useTranslation } from 'react-i18next'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import useScheduleStore from '@/stores/useScheduleStore'

const Schedule = () => {
  const { t } = useTranslation()
  const { scheduleData } = useScheduleStore()

  const getCourseAtTimeSlot = (
    day: Day,
    timeRange: TimeRange,
    scheduleIndex: number
  ) => {
    const currentSchedule = scheduleData?.schedules?.[scheduleIndex] || []
    if (!currentSchedule.length) return null

    // Get start and end time from the time range
    const [startTime, endTime] = timeRange.split(' - ')

    // Search if there is a course that matches the time slot and return it
    return currentSchedule.find((course) => {
      const courseSchedule = course.group.schedule[day]
      if (!courseSchedule) return false

      return courseSchedule.start <= startTime && courseSchedule.end >= endTime
    })
  }

  const renderScheduleTable = (scheduleIndex: number) => {
    return (
      <div className='overflow-x-auto md:overflow-visible'>
        <div className='min-w-[600px] md:min-w-0'>
          <table className='w-full border-collapse transition-colors duration-100'>
            <thead>
              <tr>
                <th className='border border-neutral-900 dark:border-neutral-300 w-16 md:w-24'>
                  {t('hours')}
                </th>

                {DAYS.map((day) => (
                  <th
                    key={day}
                    className='p-2 border border-neutral-900 dark:border-neutral-300 w-20 md:w-32 h-12'
                  >
                    ({t(`days.${day}.short`)}) {t(`days.${day}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_RANGES.map((range) => (
                <tr key={range}>
                  <td className='p-1 border border-neutral-900 dark:border-neutral-300 text-center w-16 md:w-32 h-11'>
                    {range}
                  </td>

                  {DAYS.map((day) => {
                    const course = scheduleData?.schedules
                      ? getCourseAtTimeSlot(day, range, scheduleIndex)
                      : null

                    return (
                      <td
                        key={`${day}-${range}`}
                        className={`border border-neutral-900 dark:border-neutral-300 transition-colors w-20 md:w-32 ${
                          course ? course.color : ''
                        }`}
                      >
                        {course && (
                          <div className='p-1 text-xs md:text-sm text-center text-neutral-900'>
                            <div className='font-semibold'>
                              {course.courseName}
                            </div>
                            <div>{course.group.name}</div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-8xl mx-auto p-2'>
      {scheduleData?.schedules && scheduleData.schedules.length > 0 ? (
        scheduleData.schedules.map((_, scheduleIndex: number) => (
          <div key={scheduleIndex} className='mb-12'>
            <h2 className='font-bold mb-4'>
              {t('option')} {scheduleIndex + 1}
            </h2>
            {renderScheduleTable(scheduleIndex)}
          </div>
        ))
      ) : (
        <div className='mb-12'>{renderScheduleTable(0)}</div>
      )}
    </div>
  )
}

export default Schedule
