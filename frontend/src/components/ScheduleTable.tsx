import { Day, TimeRange } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef } from 'react'
import { Download, FileImage, FileText } from 'lucide-react'
import { ScheduleDataType } from '@/stores/useScheduleStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useTheme } from '@/components/ThemeProvider'

interface ScheduleTableProps {
  scheduleData: ScheduleDataType
  scheduleIndex: number
}

const ScheduleTable = ({ scheduleData, scheduleIndex }: ScheduleTableProps) => {
  const { t } = useI18n(['common', 'schedules'])
  const tableRef = useRef<HTMLTableElement>(null)
  const { theme } = useTheme()

  const getCourseAtTimeSlot = (day: Day, timeRange: TimeRange) => {
    const currentSchedule = scheduleData?.schedules?.[scheduleIndex] || []
    if (!currentSchedule.length) return null

    const [startTime, endTime] = timeRange.split(' - ')

    return currentSchedule.find((course) => {
      // Verify that course and course.group exist
      if (!course || !course.group || !course.group.schedule) return false

      // Validate that course.group.schedule has the day
      const daySchedule = course.group.schedule[day]
      if (!daySchedule || !Array.isArray(daySchedule)) return false

      // Check if the time range overlaps with any time block for the day
      return daySchedule.some((timeBlock) => {
        return timeBlock && timeBlock.start <= startTime && timeBlock.end >= endTime
      })
    })
  }

  const getGroupNameAtTimeSlot = (day: Day, timeRange: TimeRange) => {
    const currentSchedule = scheduleData?.schedules?.[scheduleIndex] || []
    if (!currentSchedule.length) return null

    const [startTime, endTime] = timeRange.split(' - ')

    for (const course of currentSchedule) {
      // Verify that course and course.group exist
      if (!course || !course.group || !course.group.schedule) continue

      const daySchedule = course.group.schedule[day]
      if (!daySchedule || !Array.isArray(daySchedule)) continue

      const hasTimeSlot = daySchedule.some((timeBlock) => {
        return timeBlock && timeBlock.start <= startTime && timeBlock.end >= endTime
      })

      if (hasTimeSlot) {
        return course.group.name
      }
    }

    return null
  }

  const generateCanvas = async () => {
    if (!tableRef.current) return null

    try {
      const isDarkMode =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

      const element = tableRef.current
      return await html2canvas(element, {
        scale: 2,
        backgroundColor: isDarkMode ? '#262626' : '#ffffff',
      })
    } catch (error) {
      console.error('Error generating canvas:', error)
      return null
    }
  }

  const exportAsImage = async () => {
    const canvas = await generateCanvas()
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `schedule-option-${scheduleIndex + 1}.png`
    link.click()
  }

  const exportAsPDF = async () => {
    const canvas = await generateCanvas()
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm (portrait)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`schedule-option-${scheduleIndex + 1}.pdf`)
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">
          {t('schedules:option')} {scheduleIndex + 1}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="dark:bg-neutral-900 cursor-pointer bg-neutral-100  hover:bg-neutral-200/50 dark:hover:bg-neutral-900/70"
            >
              <Download size={16} className="mr-1" />
              <span>{t('schedules:downloadSchedule')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={exportAsImage}
              className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <FileImage size={16} className="mr-2" />
              <span>{t('schedules:image')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={exportAsPDF}
              className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <FileText size={16} className="mr-2" />
              <span>PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                    const course = getCourseAtTimeSlot(day, range)
                    const groupName = getGroupNameAtTimeSlot(day, range)

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
}

export default ScheduleTable
