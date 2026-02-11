import { useI18n } from '@/hooks/useI18n'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef, useMemo, useCallback, memo } from 'react'
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

const ScheduleTable = memo(({ scheduleData, scheduleIndex }: ScheduleTableProps) => {
  const { t } = useI18n(['common', 'schedules'])
  const tableRef = useRef<HTMLTableElement>(null)
  const { theme } = useTheme()

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

          const daySchedule = course.group.schedule[day]
          if (!daySchedule || !Array.isArray(daySchedule)) continue

          const hasTimeSlot = daySchedule.some(
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

  const generateCanvas = useCallback(async () => {
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
  }, [theme])

  const exportAsImage = useCallback(async () => {
    const canvas = await generateCanvas()
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `schedule-option-${scheduleIndex + 1}.png`
    link.click()
  }, [generateCanvas, scheduleIndex])

  const exportAsPDF = useCallback(async () => {
    const canvas = await generateCanvas()
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm (portrait)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`schedule-option-${scheduleIndex + 1}.pdf`)
  }, [generateCanvas, scheduleIndex])

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
