import { useTranslation } from 'react-i18next'
import { Group, Day } from '../types'
import { XIcon } from '../assets/icons/Icons'
import WeekDaySelector from './WeekDaySelector'
import TimeRangeSelector from './TimeRangeSelector'

interface GroupFormSectionProps {
  groups: Group[]
  selectedGroup: Group | null
  setSelectedGroup: (group: Group | null) => void
  onDeleteGroup: (groupName: string) => void
  onToggleDay: (day: Day) => void
  onUpdateSchedule: (
    groupName: string,
    day: string,
    start: string,
    end: string
  ) => void
  errors?: { [groupName: string]: string }
}

const GroupFormSection = ({
  groups,
  selectedGroup,
  setSelectedGroup,
  onDeleteGroup,
  onToggleDay,
  onUpdateSchedule,
  errors = {},
}: GroupFormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className='space-y-2'>
      {groups.map((group) => (
        <div
          key={group.name}
          className={`bg-zinc-800 rounded-md overflow-hidden hover:bg-zinc-800 ${
            selectedGroup?.name === group.name ? 'ring-1 ring-zinc-400' : ''
          } ${errors[group.name] ? 'border border-red-500' : ''}`}
        >
          <div
            className='flex justify-between items-center p-2 cursor-pointer'
            onClick={() =>
              setSelectedGroup(
                selectedGroup?.name === group.name ? null : group
              )
            }
          >
            <span>
              {t('group')} {group.name}
            </span>
            {selectedGroup?.name !== group.name && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteGroup(group.name)
                }}
                className='text-zinc-400 hover:text-white'
              >
                <XIcon />
              </button>
            )}
          </div>

          {selectedGroup?.name === group.name && (
            <div className='p-2 bg-zinc-700'>
              <WeekDaySelector group={group} toggleDay={onToggleDay} />
              {errors[group.name] && (
                <p className='text-red-500 text-xs mb-2 px-2'>
                  {errors[group.name]}
                </p>
              )}

              {Object.keys(group.schedule || {}).map((day) => (
                <div key={day} className='flex items-center my-2 px-2'>
                  <span className='w-24 text-left'>
                    {t(`days.${day}.name`)}
                  </span>
                  <TimeRangeSelector
                    groupName={group.name}
                    day={day as Day}
                    initialStart={group.schedule[day]?.start || '----'}
                    initialEnd={group.schedule[day]?.end || '----'}
                    onTimeChange={onUpdateSchedule}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default GroupFormSection
