import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCourseStore from '../stores/useCourseStore'
import GroupTimetableEditor from './GroupTimetableEditor'
import ColorSelector from './ColorSelector'

const Panel = () => {
  const { t } = useTranslation()
  const [courseName, setCourseName] = useState('')
  const {
    courses,
    selectedCourse,
    selectedGroup,
    setSelectedCourse,
    setSelectedGroup,
    addCourse,
    deleteCourse,
    addGroup,
    deleteGroup,
  } = useCourseStore()

  const handleAddCourse = () => {
    if (courseName.trim()) {
      addCourse(courseName)
      setCourseName('')
    }
  }

  return (
    <div className='w-full max-w-md text-zinc-300 p-2 flex flex-col'>
      <div className='mb-4'>
        <input
          className='bg-zinc-900 px-4 py-2 rounded hover:bg-zinc-800 mb-2'
          type='text'
          placeholder={t('courseName')}
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <div className='flex space-x-2'>
          <div className='flex-1'>
            <ColorSelector />
          </div>
          {selectedCourse && (
            <button
              type='button'
              className='bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-4 py-1 rounded cursor-pointer flex-1'
              onClick={() => addGroup(selectedCourse.name)}
            >
              + {t('addGroup')}
            </button>
          )}
        </div>
      </div>

      <button
        type='button'
        className='bg-blue-600 hover:bg-blue-500 text-white py-2 rounded'
        onClick={handleAddCourse}
      >
        {t('addCourse')}
      </button>

      {selectedCourse && (
        <div className='mb-4 p-3 bg-gray-800 rounded'>
          <div className='flex items-center mb-3'>
            <div
              className={`w-4 h-4 rounded-full mr-2 ${selectedCourse.color}`}
            />
            <h3 className='font-medium'>{selectedCourse.name}</h3>
          </div>

          <div className='flex flex-wrap gap-2 mb-2'>
            {selectedCourse.groups.map((group) => (
              <div
                key={group.name}
                className={`flex flex-col w-full bg-gray-700 rounded overflow-hidden transition-all}
                  ${selectedGroup?.name === group.name ? 'bg-gray-600' : ''}  
                `}
              >
                <div
                  className='flex items-center justify-between px-3 py-2 cursor-pointer'
                  onClick={() =>
                    setSelectedGroup(
                      selectedGroup?.name === group.name ? null : group
                    )
                  }
                >
                  <span className='text-sm'>
                    {t('group')} {group.name}
                  </span>
                  <button
                    className='ml-2 text-gray-300 hover:text-white'
                    onClick={() => deleteGroup(selectedCourse.name, group.name)}
                  >
                    ×
                  </button>
                </div>
                <GroupTimetableEditor groupName={group.name} />
              </div>
            ))}
          </div>

          <button
            className='text-sm text-gray-400 hover:text-white'
            onClick={() => setSelectedCourse(null)}
          >
            {t('close')}
          </button>
        </div>
      )}

      <div className='mt-2 flex-1 overflow-y-auto'>
        {courses.map((course) => (
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
                <div className={`w-6 h-6 rounded-full mr-2 ${course.color}`} />
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
        ))}
      </div>
    </div>
  )
}

export default Panel
