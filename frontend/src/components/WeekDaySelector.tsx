import { DAYS } from '../utils/constants'
import useCourseStore from '../stores/useCourseStore'
import { useTranslation } from 'react-i18next'

const WeekDaySelector = () => {
  const { t } = useTranslation()
  const { selectedDays, toggleDay } = useCourseStore()

  return (
    <div className='flex justify-between w-full py-2'>
      {DAYS.map((day) => (
        <button
          key={day}
          onClick={() => toggleDay(day)}
          className={`transition-colors rounded-full px-3 py-1 hover:bg-gray-600
            ${selectedDays.includes(day) ? 'text-sky-500 font-extrabold' : ' text-gray-300'}`}
        >
          {t(`days.${day}.short`)}
        </button>
      ))}
    </div>
  )
}

export default WeekDaySelector
