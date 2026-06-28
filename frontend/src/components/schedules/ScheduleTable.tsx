import { useI18n } from '@/hooks/useI18n'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef, useMemo, memo, useCallback } from 'react'
import { ScheduleDataType } from '@/stores/useScheduleStore'
import { useScheduleExport } from '@/hooks/useScheduleExport'
import { ScheduleExportMenu } from './ScheduleExportMenu'
import { getContrastTextColor } from '@/utils/colorUtils'
import useCourseStore from '@/stores/useCourseStore'
import { useTableStyleStore } from '@/stores/useTableStyleStore'
import { tableStyles } from '@/styles'
import { Card } from '@/components/ui/card'
import { Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResponsiveTooltip } from '@/components/shared'
import { useSavedSchedulesStore } from '@/stores/useSavedSchedulesStore'

interface ScheduleTableProps {
  scheduleData: ScheduleDataType
  scheduleIndex: number
  showSaveButton?: boolean
  savedScheduleId?: string
  onRemoveSaved?: (id: string) => void
}

const ScheduleTable = memo(({ scheduleData, scheduleIndex, showSaveButton = true, savedScheduleId, onRemoveSaved }: ScheduleTableProps) => {
  const { t } = useI18n(['common', 'schedules'])
  const tableRef = useRef<HTMLTableElement>(null)
  const courses = useCourseStore((state) => state.courses)
  const tableStyle = useTableStyleStore((state) => state.tableStyle)
  const styles = tableStyles[tableStyle]

  const currentSchedule = scheduleData?.schedules?.[scheduleIndex]
  const isScheduleSaved = useSavedSchedulesStore((state) =>
    currentSchedule ? state.isScheduleSaved(currentSchedule) : false
  )
  const saveSchedule = useSavedSchedulesStore((state) => state.saveSchedule)

  const removeScheduleByFingerprint = useCallback(() => {
    if (!currentSchedule) return
    const { savedSchedules, removeSchedule } = useSavedSchedulesStore.getState()
    const fingerprint = currentSchedule
      .map((c) => `${c.courseName}::${c.group.name}`)
      .sort()
      .join('|')
    const match = savedSchedules.find((s) =>
      s.schedule
        .map((c) => `${c.courseName}::${c.group.name}`)
        .sort()
        .join('|') === fingerprint
    )
    if (match) removeSchedule(match.id)
  }, [currentSchedule])

  const handleToggleSave = useCallback(() => {
    if (!currentSchedule) return
    if (isScheduleSaved) {
      removeScheduleByFingerprint()
    } else {
      saveSchedule(currentSchedule)
    }
  }, [currentSchedule, isScheduleSaved, saveSchedule, removeScheduleByFingerprint])

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
    <Card
      className="mb-4 p-2 md:mb-8 md:p-4 shadow-sm border"
      role="region"
      aria-labelledby={`schedule-title-${scheduleIndex}`}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1">
          {showSaveButton && (
            <ResponsiveTooltip
              content={isScheduleSaved ? t('schedules:favorites.remove') : t('schedules:favorites.add')}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSave}
                className="h-7 w-7 p-0 cursor-pointer"
                aria-label={isScheduleSaved ? t('schedules:favorites.remove') : t('schedules:favorites.add')}
                aria-pressed={isScheduleSaved}
              >
                <Star
                  className={`h-4 w-4 transition-colors ${
                    isScheduleSaved
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </ResponsiveTooltip>
          )}
          <h2 id={`schedule-title-${scheduleIndex}`} className="font-bold text-sm">
            {scheduleTitle}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {savedScheduleId && onRemoveSaved && (
            <ResponsiveTooltip content={t('schedules:favorites.remove')}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSaved(savedScheduleId)}
                className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                aria-label={t('schedules:favorites.remove')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ResponsiveTooltip>
          )}
          <ScheduleExportMenu onExportImage={exportAsImage} onExportPDF={exportAsPDF} />
        </div>
      </div>
      <div className="overflow-x-auto md:overflow-visible">
        <div className="min-w-150 md:min-w-0">
          <table
            className={`w-full ${styles.table}`}
            ref={tableRef}
            aria-label={scheduleTitle}
            role="grid"
          >
            <caption className="sr-only">
              {t('accessibility.scheduleTableCaption', { option: scheduleIndex + 1 })}
            </caption>
            <thead>
              <tr>
                <th scope="col" className={`${styles.headerCell} w-16 md:w-24 h-7 md:h-9`}>
                  {t('common:time.hours')}
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    scope="col"
                    className={`p-1 ${styles.headerCell} w-20 md:w-32`}
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
                  <th scope="row" className={`p-1 ${styles.timeCell} text-center w-16 md:w-24`}>
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
                        className={`${course ? styles.dataCellWithCourse : styles.dataCell} w-20 md:w-24 h-7 md:h-9`}
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
    </Card>
  )
})

export default ScheduleTable
