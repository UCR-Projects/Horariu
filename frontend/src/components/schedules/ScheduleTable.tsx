import { useI18n } from '@/hooks/useI18n'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef, useMemo, memo, useCallback } from 'react'
import { ScheduleDataType } from '@/stores/useScheduleStore'
import { useScheduleExport } from '@/hooks/useScheduleExport'
import { ScheduleExportMenu } from './ScheduleExportMenu'
import { getContrastTextColor } from '@/utils/colorUtils'
import useCourseStore from '@/stores/useCourseStore'
import { table } from '@/styles'

interface ScheduleTableProps {
  scheduleData: ScheduleDataType
  scheduleIndex: number
}

const ScheduleTable = memo(({ scheduleData, scheduleIndex }: ScheduleTableProps) => {
  const { t } = useI18n(['common', 'schedules'])
  const tableRef = useRef<HTMLTableElement>(null)
  const courses = useCourseStore((state) => state.courses)

  // Look up current color from course store, fallback to stored color
  const getCourseColor = useCallback(
    (courseName: string, fallbackColor: string): string => {
      const course = courses.find((c) => c.name === courseName)
      return course?.color ?? fallbackColor
    },
    [courses]
  )

  const { exportAsImage, exportAsPDF } = useScheduleExport({
    tableRef,
    scheduleIndex,
  })

  // Pre-compute the schedule grid to avoid recalculating on every cell render
  const scheduleGrid = useMemo(() => {
    const currentSchedule = scheduleData?.schedules?.[scheduleIndex] || []
    const grid: Record<string, { course: (typeof currentSchedule)[0]; groupName: string } | null> =
      {}

    if (!currentSchedule.length) return grid

    for (const range of TIME_RANGES) {
      const [startTime, endTime] = range.split(' - ')

      for (const day of DAYS) {
        const key = `${day}-${range}`

        for (const course of currentSchedule) {
          if (!course?.group?.schedule) continue

          // Find the day in the schedule array
          const daySchedule = course.group.schedule.find((s) => s.day === day)
          if (!daySchedule || !daySchedule.active) continue

          const hasTimeSlot = daySchedule.timeBlocks.some(
            (timeBlock) => timeBlock && timeBlock.start <= startTime && timeBlock.end >= endTime
          )

          if (hasTimeSlot) {
            grid[key] = { course, groupName: course.group.name }
            break
          }
        }

        if (!grid[key]) {
          grid[key] = null
        }
      }
    }

    return grid
  }, [scheduleData, scheduleIndex])

  const scheduleTitle = `${t('schedules:option')} ${scheduleIndex + 1}`

  return (
    <div className="mb-12" role="region" aria-labelledby={`schedule-title-${scheduleIndex}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id={`schedule-title-${scheduleIndex}`} className="font-bold">
          {scheduleTitle}
        </h2>
        <ScheduleExportMenu onExportImage={exportAsImage} onExportPDF={exportAsPDF} />
      </div>
      <div className="overflow-x-auto md:overflow-visible">
        <div className="min-w-150 md:min-w-0">
          <table
            className="w-full border-collapse"
            ref={tableRef}
            aria-label={scheduleTitle}
            role="grid"
          >
            <caption className="sr-only">
              {t('accessibility.scheduleTableCaption', { option: scheduleIndex + 1 })}
            </caption>
            <thead>
              <tr>
                <th scope="col" className={`${table.border} w-16 md:w-24 h-9`}>
                  {t('common:time.hours')}
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    scope="col"
                    className={`p-1 ${table.border} w-20 md:w-32`}
                  >
                    <span className="sr-only">{t(`common:days.${day}.name`)}</span>
                    <span aria-hidden="true">({t(`common:days.${day}.short`)}) {t(`common:days.${day}.name`)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_RANGES.map((range) => (
                <tr key={range}>
                  <th scope="row" className={`p-1 ${table.header} text-center w-16 md:w-24`}>
                    {range}
                  </th>
                  {DAYS.map((day) => {
                    const cellData = scheduleGrid[`${day}-${range}`]
                    const course = cellData?.course
                    const groupName = cellData?.groupName
                    const dayName = t(`common:days.${day}.name`)
                    // Use current color from course store (syncs when course is edited)
                    const color = course ? getCourseColor(course.courseName, course.color) : undefined

                    return (
                      <td
                        key={`${day}-${range}`}
                        className={`${table.cell} w-20 md:w-24 h-9`}
                        style={color ? { backgroundColor: color } : undefined}
                        aria-label={course ? t('accessibility.courseAt', { courseName: course.courseName, groupName, day: dayName, time: range }) : t('accessibility.emptySlot', { day: dayName, time: range })}
                      >
                        {course && color && (
                          <div
                            className="p-0.5 text-xs md:text-sm text-center"
                            style={{ color: getContrastTextColor(color) }}
                          >
                            <div className="font-semibold">{course.courseName}</div>
                            <div className="text-xs">{groupName}</div>
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
})

export default ScheduleTable
