import { Day } from '@/types'
import { useI18n } from '@/hooks/useI18n'

interface WeekDaySelectorProps {
  day: Day
  active: boolean
  onToggle: (active: boolean) => void
  disabled?: boolean
}

const WeekDaySelector = ({ day, active, onToggle }: WeekDaySelectorProps) => {
  const { t } = useI18n()

  return (
    <button
      type='button'
      onClick={() => onToggle(!active)}
      className={`transition-colors rounded-full w-8 h-8 flex items-center justify-center dark:hover:bg-neutral-800/20 hover:bg-neutral-200 cursor-pointer ${
        active
          ? 'text-sky-500 font-extrabold dark:bg-neutral-800/20 bg-neutral-100'
          : 'dark:text-neutral-300'
      }`}
    >
      {t(`days.${day}.short`)}
    </button>
  )
}

export default WeekDaySelector
