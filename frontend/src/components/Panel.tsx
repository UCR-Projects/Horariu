import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCourseStore from '../stores/useCourseStore'
import ColorSelector from './ColorSelector'
import TimeRangeSelector from './TimeRangeSelector'
import WeekDaySelector from './WeekDaySelector'
import { Day, Group } from '../types'

const Panel = () => {
  const { t } = useTranslation()

  const [courseName, setCourseName] = useState<string>('')
  const [courseColor, setCourseColor] = useState<string>('bg-blue-500')
  const [newGroups, setNewGroups] = useState<Group[]>([])
  const [selectedNewGroup, setSelectedNewGroup] = useState<Group | null>(null)

  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    addCourse,
    deleteCourse,
  } = useCourseStore()

  const handleAddNewGroup = () => {
    const newGroup = {
      name: `${String(newGroups.length + 1).padStart(2, '0')}`,
      schedule: {},
    }

    const updatedGroups = [...newGroups, newGroup]

    setNewGroups(updatedGroups)
    setSelectedNewGroup(newGroup)
  }

  const handleDeleteNewGroup = (groupName: string) => {
    const updatedGroups = newGroups.filter((group) => group.name !== groupName)
    setNewGroups(updatedGroups)

    if (selectedNewGroup?.name === groupName) {
      setSelectedNewGroup(null)
    }
  }

  const toggleNewGroupDay = (day: Day) => {
    if (!selectedNewGroup) return

    const groupToUpdate = { ...selectedNewGroup }

    if (groupToUpdate.schedule[day]) {
      const updatedSchedule = { ...groupToUpdate.schedule }
      delete updatedSchedule[day]
      groupToUpdate.schedule = updatedSchedule
    } else {
      groupToUpdate.schedule = {
        ...groupToUpdate.schedule,
        [day]: { start: '----', end: '----' },
      }
    }

    updateNewGroup(groupToUpdate)
  }

  const updateNewGroupSchedule = (
    groupName: string,
    day: string,
    start: string,
    end: string
  ) => {
    const groupToUpdate = newGroups.find((group) => group.name === groupName)
    if (!groupToUpdate) return

    const updatedGroup = {
      ...groupToUpdate,
      schedule: {
        ...groupToUpdate.schedule,
        [day]: { start, end },
      },
    }

    updateNewGroup(updatedGroup)
  }

  const updateNewGroup = (updatedGroup: Group) => {
    const updatedGroups = newGroups.map((group) =>
      group.name === updatedGroup.name ? updatedGroup : group
    )

    setNewGroups(updatedGroups)

    if (selectedNewGroup?.name === updatedGroup.name) {
      setSelectedNewGroup(updatedGroup)
    }
  }

  const handleAddCourse = () => {
    if (!courseName.trim()) return

    const newCourse = {
      name: courseName,
      color: courseColor,
      groups: newGroups,
    }

    addCourse(newCourse)

    setCourseName('')
    setNewGroups([])
    setSelectedNewGroup(null)
  }

  return (
    <div className='w-full max-w-md text-zinc-300 p-2 flex flex-col'>
      <div className='mb-4 p-4 bg-zinc-900 rounded-lg'>
        <h2 className='text-lg text-center font-medium mb-3'>
          {t('createNewCourse')}
        </h2>

        <div className='mb-4'>
          <input
            className='bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 mb-2 w-full'
            type='text'
            placeholder={t('courseName')}
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <div className='flex space-x-2 mb-2'>
            <div className='flex-1'>
              <ColorSelector
                currentColor={courseColor}
                setCurrentColor={setCourseColor}
              />
            </div>
            <button
              type='button'
              className='bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-md'
              onClick={handleAddNewGroup}
            >
              + {t('addGroup')}
            </button>
          </div>

          {newGroups.length === 0 ? (
            <p className='text-sm text-zinc-500 my-2'>{t('noGroupsAdded')}</p>
          ) : (
            <div className='space-y-2'>
              {newGroups.map((group) => (
                <div
                  key={group.name}
                  className={`bg-zinc-800 rounded-md overflow-hidden hover:bg-zinc-800 ${
                    selectedNewGroup?.name === group.name
                      ? 'ring-1 ring-zinc-400'
                      : ''
                  }`}
                >
                  <div
                    className='flex justify-between items-center p-2 cursor-pointer'
                    onClick={() =>
                      setSelectedNewGroup(
                        selectedNewGroup?.name === group.name ? null : group
                      )
                    }
                  >
                    <span>
                      {t('group')} {group.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNewGroup(group.name)
                      }}
                      className='text-zinc-400 hover:text-zinc-200'
                    >
                      ×
                    </button>
                  </div>

                  {selectedNewGroup?.name === group.name && (
                    <div className='p-2 bg-zinc-700'>
                      <WeekDaySelector
                        group={group}
                        toggleDay={toggleNewGroupDay}
                      />

                      {Object.keys(group.schedule || {}).map((day) => {
                        return (
                          <div
                            key={day}
                            className='flex items-center my-2 px-2'
                          >
                            <span className='w-24 text-left'>
                              {t(`days.${day}.name`)}
                            </span>
                            <TimeRangeSelector
                              groupName={group.name}
                              day={day as Day}
                              initialStart={
                                group.schedule[day]?.start || '----'
                              }
                              initialEnd={group.schedule[day]?.end || '----'}
                              onTimeChange={updateNewGroupSchedule}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type='button'
          className='border-zinc-300 border-1 hover:bg-zinc-800 text-white py-2 rounded w-full'
          onClick={handleAddCourse}
          disabled={!courseName.trim() || newGroups.length === 0}
        >
          {t('addCourse')}
        </button>
      </div>

      {/* Courses List */}
      <div className='mt-2 flex-1 overflow-y-auto'>
        <h2 className='text-lg font-medium'>{t('Courses')}</h2>
        {courses.length === 0 ? (
          <p className='text-sm text-zinc-500'>{t('noCourses')}</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.name}
              className={`mb-3 p-3 rounded cursor-pointer ${
                selectedCourse?.name === course.name
                  ? 'bg-gray-700'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div
                    className={`w-6 h-6 rounded-full mr-2 ${course.color}`}
                  />
                  <span className='font-medium'>{course.name}</span>
                </div>
                <div className='flex'>
                  <button
                    className='text-gray-400 hover:text-white mx-1'
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteCourse(course.name)
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className='text-sm text-gray-400 mt-1'>
                {t('group')}s: {course.groups.length}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Panel
