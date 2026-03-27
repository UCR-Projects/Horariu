import { Day, TimeRange } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { table } from '@/styles'

const ScheduleFilter = () => {
  const { t } = useI18n(['common'])

  const {
    toggleCell,
    toggleDay,
    toggleHour,
    isCellSelected,
    isDayFullySelected,
    isHourFullySelected,
  } = useTimeFilterStore()

  return (
    <div className="min-w-[600px]">
      <table className="w-full border-collapse transition-colors duration-100">
        <thead>
          <tr>
            <th className={`${table.border} w-16 md:w-28 p-2 text-sm font-normal text-muted-foreground`}>
              {t('common:time.hours')}
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                onClick={() => toggleDay(day as Day)}
                className={`${table.border} w-20 md:w-28 h-14 p-2 text-sm cursor-pointer select-none transition-colors
                  ${isDayFullySelected(day as Day)
                    ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground'
                    : 'hover:bg-interactive-active'
                  }`}
              >
                <span className="hidden md:inline">
                  ({t(`common:days.${day}.short`)}) {t(`common:days.${day}.name`)}
                </span>
                <span className="md:hidden">
                  {t(`common:days.${day}.short`)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_RANGES.map((hour) => (
            <tr key={hour}>
              <td
                onClick={() => toggleHour(hour as TimeRange)}
                className={`${table.border} p-1 text-center text-xs cursor-pointer select-none transition-colors w-16 md:w-28 h-10
                  ${isHourFullySelected(hour as TimeRange)
                    ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground'
                    : 'hover:bg-interactive-active'
                  }`}
              >
                {hour}
              </td>
              {DAYS.map((day) => (
                <td
                  key={`${day}-${hour}`}
                  onClick={() => toggleCell(hour as TimeRange, day as Day)}
                  className={`${table.border} cursor-pointer select-none transition-colors w-20 md:w-28 h-10
                    ${isCellSelected(hour as TimeRange, day as Day)
                      ? 'bg-destructive/20 hover:bg-destructive/30'
                      : 'hover:bg-interactive-active'
                    }`}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleFilter
