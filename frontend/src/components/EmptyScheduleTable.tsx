import { DAYS, TIME_RANGES } from '@/utils/constants'
import { useTranslation } from 'react-i18next'

const EmptyScheduleTable = () => {
  const { t } = useTranslation()

  return (
    <div className='mb-12'>
      <div className='overflow-x-auto md:overflow-visible'>
        <div className='min-w-[600px] md:min-w-0'>
          <table className='w-full border-collapse'>
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
                  {DAYS.map((day) => (
                    <td
                      key={`${day}-${range}`}
                      className='border border-neutral-900 dark:border-neutral-300 w-20 md:w-24 h-9'
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

export default EmptyScheduleTable
