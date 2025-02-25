import { DAYS } from '../utils/constants'
import { useTranslation } from 'react-i18next'
import { Day, Group } from '../types'

interface WeekDaySelectorProps {
  group: Group
  toggleDay: (day: Day) => void
}

const WeekDaySelector = ({ group, toggleDay }: WeekDaySelectorProps) => {
  const { t } = useTranslation()

  return (
    <div className='flex justify-between w-full py-2'>
      {DAYS.map((day) => (
        <button
          key={day}
          onClick={() => toggleDay(day)}
          className={`transition-colors rounded-full px-3 py-1 hover:bg-gray-600 ${
            Object.keys(group.schedule || {}).includes(day)
              ? 'text-sky-500 font-extrabold'
              : 'text-gray-300'
          }`}
        >
          {t(`days.${day}.short`)}
        </button>
      ))}
    </div>
  )
}

export default WeekDaySelector
