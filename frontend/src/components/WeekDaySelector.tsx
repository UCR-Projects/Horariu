import { DAYS } from '../utils/constants'
import { Day } from '@/types'
import { useTranslation } from 'react-i18next'
interface WeekDaySelectorProps {
  schedules: { day: Day; active: boolean }[]
  onToggleDay: (day: Day, active: boolean) => void
}

const WeekDaySelector = ({ schedules, onToggleDay }: WeekDaySelectorProps) => {
  const { t } = useTranslation()
  return (
    <div className='flex justify-between w-full py-2'>
      {DAYS.map((day) => {
        const isActive = schedules.find((s) => s.day === day)?.active || false
        return (
          <button
            key={day}
            type='button'
            onClick={() => onToggleDay(day, !isActive)}
            className={`transition-colors rounded-full w-8 h-8 flex items-center justify-center dark:hover:bg-neutral-800/20 ${
              isActive
                ? 'text-sky-500 font-extrabold dark:bg-neutral-800/20'
                : 'dark:text-neutral-300'
            }`}
          >
            {t(`days.${day}.short`)}
          </button>
        )
      })}
    </div>
  )
}

export default WeekDaySelector
