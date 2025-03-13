import { Day, TimeRange } from '@/types'
import { useTranslation } from 'react-i18next'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import useScheduleStore from '@/stores/useScheduleStore'
import { useState } from 'react'

const Schedule = () => {
  const { t } = useTranslation()
  const { scheduleData } = useScheduleStore()

  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0)
  const currentSchedule = scheduleData?.schedules?.[selectedScheduleIndex] || []

  const getCourseAtTimeSlot = (day: Day, timeRange: TimeRange) => {
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

  return (
    <div className='w-full max-w-8xl mx-auto p-2'>
      {scheduleData?.schedules && scheduleData.schedules.length > 1 && (
        <div className='mb-4'>
          <label className='mr-2'>{t('scheduleOption')}:</label>
          <select
            value={selectedScheduleIndex}
            onChange={(e) => setSelectedScheduleIndex(Number(e.target.value))}
            className='p-1 border rounded'
          >
            {scheduleData.schedules.map((_, index: number) => (
              <option key={index} value={index}>
                {t('option')} {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}

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
                    className='p-2 border border-neutral-900 dark:border-neutral-300 w-20 md:w-32 h-14'
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
                    const course = getCourseAtTimeSlot(day, range)

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
    </div>
  )
}

export default Schedule
