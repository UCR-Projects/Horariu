import { DAYS, TIME_RANGES } from '@/utils/constants'
import { useI18n } from '@/hooks/useI18n'
import useScheduleStore from '@/stores/useScheduleStore'
import { ReactNode } from 'react'

interface ScheduleTableShellProps {
  renderCell: (day: string, range: string) => ReactNode
  cellClassName?: string
}

/**
 * Shared table structure for schedule display.
 * Used by both empty state and skeleton loader.
 */
const ScheduleTableShell = ({ renderCell, cellClassName = '' }: ScheduleTableShellProps) => {
  const { t } = useI18n()

  return (
    <div className="mb-12">
      <div className="overflow-x-auto md:overflow-visible">
        <div className="min-w-150 md:min-w-0">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-neutral-900 dark:border-neutral-300 w-16 md:w-24 h-9">
                  {t('time.hours')}
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="p-1 border border-neutral-900 dark:border-neutral-300 w-20 md:w-32"
                  >
                    ({t(`days.${day}.short`)}) {t(`days.${day}.name`)}
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
                  {DAYS.map((day) => (
                    <td
                      key={`${day}-${range}`}
                      className={`border border-neutral-900 dark:border-neutral-300 w-20 md:w-24 h-9 ${cellClassName}`}
                    >
                      {renderCell(day, range)}
                    </td>
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

const SkeletonCell = () => (
  <div className="h-full w-full relative overflow-hidden rounded-sm">
    <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700/80 animate-pulse rounded-b-xs" />
  </div>
)

const EmptyScheduleTable = () => {
  const isLoading = useScheduleStore((state) => state.isLoading)

  if (isLoading) {
    return <ScheduleTableShell renderCell={() => <SkeletonCell />} cellClassName="p-1" />
  }

  return <ScheduleTableShell renderCell={() => null} />
}

export default EmptyScheduleTable
