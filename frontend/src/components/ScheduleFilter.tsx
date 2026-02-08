import { Day, TimeRange } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { TIME_RANGES, DAYS } from '@/utils/constants'

const ScheduleFilter = () => {
  const { t } = useI18n()

  const { toggleCell, selectedCells } = useScheduleFilterStore()

  const isCellSelected = (hour: TimeRange, day: Day) => {
    return selectedCells.has(`${hour}-${day}`)
  }

  return (
    <div className='w-full max-w-8xl mx-auto p-2'>
      <div className='overflow-x-auto md:overflow-visible'>
        <div className='min-w-[600px] md:min-w-0'>
          <table className='w-full border-collapse transition-colors duration-100'>
            <thead>
              <tr>
                <th className='border border-neutral-900 dark:border-neutral-300 w-16 md:w-24'>
                  {t('time.hours')}
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
              {TIME_RANGES.map((hour) => (
                <tr key={hour}>
                  <td className='p-1 border border-neutral-900 dark:border-neutral-300 text-center w-16 md:w-32 h-11'>
                    {hour}
                  </td>

                  {DAYS.map((day) => (
                    <td
                      key={`${day}-${hour}`}
                      onClick={() => toggleCell(hour, day)}
                      className={`border border-neutral-900 dark:border-neutral-300 cursor-pointer transition-colors w-20 md:w-32
                      ${isCellSelected(hour, day) ? 'bg-cyan-900 hover:bg-cyan-950' : 'hover:bg-neutral-600'}`}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ScheduleFilter
