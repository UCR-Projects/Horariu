import { Day, TimeRange } from '@/types'
import { useTranslation } from 'react-i18next'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef } from 'react'
import { Download } from 'lucide-react'
import useScheduleStore, { ScheduleDataType } from '@/stores/useScheduleStore'

import html2canvas from 'html2canvas-pro'
import { useTheme } from '@/components/ThemeProvider'

const Schedules = () => {
  const { scheduleData } = useScheduleStore()

  if (!scheduleData) return null

  return (
    <div className='w-full max-w-8xl mx-auto p-2 pb-0'>
      {scheduleData?.schedules?.length > 0 &&
        scheduleData.schedules.map((_, scheduleIndex) => (
          <ScheduleTable
            key={scheduleIndex}
            scheduleData={scheduleData}
            scheduleIndex={scheduleIndex}
          />
        ))}
    </div>
  )
}

export default Schedules

interface ScheduleTableProps {
  scheduleData: ScheduleDataType
  scheduleIndex: number
}

const ScheduleTable = ({ scheduleData, scheduleIndex }: ScheduleTableProps) => {
  const { t } = useTranslation()
  const tableRef = useRef(null)
  const { theme } = useTheme()

  const getCourseAtTimeSlot = (day: Day, timeRange: TimeRange) => {
    const currentSchedule = scheduleData?.schedules?.[scheduleIndex] || []
    if (!currentSchedule.length) return null

    const [startTime, endTime] = timeRange.split(' - ')

    return currentSchedule.find((course) => {
      const courseSchedule = course.group.schedule[day]
      if (!courseSchedule) return false

      return courseSchedule.start <= startTime && courseSchedule.end >= endTime
    })
  }

  const exportAsImage = async () => {
    if (!tableRef.current) return

    try {
      const isDarkMode =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)

      const element = tableRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: isDarkMode ? '#262626' : '#ffffff',
      })

      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = `schedule-option-${scheduleIndex + 1}.png`
      link.click()
    } catch (error) {
      console.error('Error exporting schedule as image:', error)
    }
  }

  return (
    <div className='mb-12'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-bold'>
          {t('option')} {scheduleIndex + 1}
        </h2>
        <button
          onClick={exportAsImage}
          className='flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          <Download size={16} />
          <span>{t('exportSchedule')}</span>
        </button>
      </div>
      <div className='overflow-x-auto md:overflow-visible'>
        <div className='min-w-[600px] md:min-w-0'>
          <table
            className='w-full border-collapse transition-colors duration-100'
            ref={tableRef}
          >
            <thead>
              <tr>
                <th className='border border-neutral-900 dark:border-neutral-300 w-16 md:w-24 h-12'>
                  {t('hours')}
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className='p-1 border border-neutral-900 dark:border-neutral-300 w-20 md:w-32'
                  >
                    ({t(`days.${day}.short`)}) {t(`days.${day}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_RANGES.map((range) => (
                <tr key={range}>
                  <td className='p-1 border border-neutral-900 dark:border-neutral-300 text-center w-16 md:w-24'>
                    {range}
                  </td>
                  {DAYS.map((day) => {
                    const course = getCourseAtTimeSlot(day, range)

                    return (
                      <td
                        key={`${day}-${range}`}
                        className={`border border-neutral-900 dark:border-neutral-300 transition-colors w-20 md:w-24 ${
                          course ? course.color : ''
                        } h-10.5`}
                      >
                        {course && (
                          <div className='p-0.5 text-xs md:text-sm text-center text-neutral-900'>
                            <div className='font-semibold'>
                              {course.courseName}
                            </div>
                            <div className='text-xs'>{course.group.name}</div>
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
