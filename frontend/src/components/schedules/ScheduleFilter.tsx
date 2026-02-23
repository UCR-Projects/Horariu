import { Day, TimeRange } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { table } from '@/styles'

const ScheduleFilter = () => {
  const { t } = useI18n()

  const { toggleCell, selectedCells } = useScheduleFilterStore()

  const isCellSelected = (hour: TimeRange, day: Day) => {
    return selectedCells.has(`${hour}-${day}`)
  }

  return (
    <div className="w-full max-w-8xl mx-auto p-2">
      <div className="overflow-x-auto md:overflow-visible">
        <div className="min-w-150 md:min-w-0">
          <table className="w-full border-collapse transition-colors duration-100">
            <thead>
              <tr>
                <th className={`${table.border} w-16 md:w-24`}>
                  {t('time.hours')}
                </th>

                {DAYS.map((day) => (
                  <th
                    key={day}
                    className={`p-2 ${table.border} w-20 md:w-32 h-14`}
                  >
                    ({t(`days.${day}.short`)}) {t(`days.${day}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_RANGES.map((hour) => (
                <tr key={hour}>
                  <td className={`p-1 ${table.border} text-center w-16 md:w-32 h-11`}>
                    {hour}
                  </td>

                  {DAYS.map((day) => (
                    <td
                      key={`${day}-${hour}`}
                      onClick={() => toggleCell(hour, day)}
                      className={`${table.border} cursor-pointer transition-colors w-20 md:w-32
                      ${isCellSelected(hour, day) ? 'bg-cyan-900 hover:bg-cyan-950' : 'hover:bg-interactive-active'}`}
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
