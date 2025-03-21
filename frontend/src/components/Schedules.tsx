import { Day, TimeRange } from '@/types'
import { useTranslation } from 'react-i18next'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { useRef } from 'react'
import { Download, FileImage, FileText } from 'lucide-react'
import useScheduleStore, { ScheduleDataType } from '@/stores/useScheduleStore'
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
  const tableRef = useRef<HTMLTableElement>(null)
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

  const generateCanvas = async () => {
    if (!tableRef.current) return null

    try {
      const isDarkMode =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)

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
    <div className='mb-12'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-bold'>
          {t('option')} {scheduleIndex + 1}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='dark:bg-neutral-900 cursor-pointer'
            >
              <Download size={16} className='mr-1' />
              <span>{t('downloadSchedule')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={exportAsImage}
              className='cursor-pointer'
            >
              <FileImage size={16} className='mr-2' />
              <span>{t('image')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsPDF} className='cursor-pointer'>
              <FileText size={16} className='mr-2' />
              <span>PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='overflow-x-auto md:overflow-visible'>
        <div className='min-w-[600px] md:min-w-0'>
          <table className='w-full border-collapse' ref={tableRef}>
            <thead>
              <tr>
                <th className='border border-neutral-900 dark:border-neutral-300 w-16 md:w-24 h-9'>
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
                        className={`border border-neutral-900 dark:border-neutral-300 w-20 md:w-24 ${
                          course ? course.color : ''
                        } h-9`}
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
