import { useI18n } from '@/hooks/useI18n'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef, useMemo, memo } from 'react'
import { ScheduleDataType } from '@/stores/useScheduleStore'
import { useScheduleExport } from '@/hooks/useScheduleExport'
import { ScheduleExportMenu } from './ScheduleExportMenu'

interface ScheduleTableProps {
  scheduleData: ScheduleDataType
  scheduleIndex: number
}

const ScheduleTable = memo(({ scheduleData, scheduleIndex }: ScheduleTableProps) => {
  const { t } = useI18n(['common', 'schedules'])
  const tableRef = useRef<HTMLTableElement>(null)

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

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">
          {t('schedules:option')} {scheduleIndex + 1}
        </h2>
        <ScheduleExportMenu onExportImage={exportAsImage} onExportPDF={exportAsPDF} />
      </div>
      <div className="overflow-x-auto md:overflow-visible">
        <div className="min-w-150 md:min-w-0">
          <table className="w-full border-collapse" ref={tableRef}>
            <thead>
              <tr>
                <th className="border border-neutral-900 dark:border-neutral-300 w-16 md:w-24 h-9">
                  {t('common:time.hours')}
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="p-1 border border-neutral-900 dark:border-neutral-300 w-20 md:w-32"
                  >
                    ({t(`common:days.${day}.short`)}) {t(`common:days.${day}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_RANGES.map((range) => (
                <tr key={range}>
                  <td className="p-1 border border-neutral-900 dark:border-neutral-300 text-center w-16 md:w-24">
                    {range}
                  </td>
                  {DAYS.map((day) => {
                    const cellData = scheduleGrid[`${day}-${range}`]
                    const course = cellData?.course
                    const groupName = cellData?.groupName

                    return (
                      <td
                        key={`${day}-${range}`}
                        className={`border border-neutral-900 dark:border-neutral-300 w-20 md:w-24 ${
                          course ? course.color : ''
                        } h-9`}
                      >
                        {course && (
                          <div className="p-0.5 text-xs md:text-sm text-center text-neutral-900">
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
