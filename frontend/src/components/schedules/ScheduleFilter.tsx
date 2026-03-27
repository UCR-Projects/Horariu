import { useI18n } from '@/hooks/useI18n'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { TIME_RANGES, DAYS } from '@/utils/constants'
import { table } from '@/styles'

function ScheduleFilter() {
  const { t } = useI18n(['common'])

  const selectedCells = useTimeFilterStore((state) => state.selectedCells)
  const toggleCell = useTimeFilterStore((state) => state.toggleCell)
  const toggleDay = useTimeFilterStore((state) => state.toggleDay)
  const toggleHour = useTimeFilterStore((state) => state.toggleHour)

  const isCellSelected = (hour: string, day: string) =>
    selectedCells.has(`${hour}-${day}`)

  const isDayFullySelected = (day: string) =>
    TIME_RANGES.every((h) => selectedCells.has(`${h}-${day}`))

  const isHourFullySelected = (hour: string) =>
    DAYS.every((d) => selectedCells.has(`${hour}-${d}`))

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
                aria-selected={isDayFullySelected(day)}
                onClick={() => toggleDay(day)}
                className={`${table.border} w-20 md:w-28 h-14 p-2 text-sm cursor-pointer select-none transition-colors
                  ${isDayFullySelected(day)
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
              <th
                scope="row"
                aria-selected={isHourFullySelected(hour)}
                onClick={() => toggleHour(hour)}
                className={`${table.border} p-1 text-center text-xs font-normal cursor-pointer select-none transition-colors w-16 md:w-28 h-10
                  ${isHourFullySelected(hour)
                    ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground'
                    : 'hover:bg-interactive-active'
                  }`}
              >
                {hour}
              </th>
              {DAYS.map((day) => (
                <td
                  key={`${hour}-${day}`}
                  aria-label={`${t(`common:days.${day}.short`)} ${hour}`}
                  aria-selected={isCellSelected(hour, day)}
                  onClick={() => toggleCell(hour, day)}
                  className={`${table.border} cursor-pointer select-none transition-colors w-20 md:w-28 h-10
                    ${isCellSelected(hour, day)
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
