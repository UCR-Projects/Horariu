import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCourseStore from '../stores/useCourseStore'
import GroupTimetableEditor from './GroupTimetableEditor'

const Panel = () => {
  const { t } = useTranslation()
  const [courseName, setCourseName] = useState('')
  const {
    courses,
    selectedCourse,
    selectedGroup,
    currentColor,
    setSelectedCourse,
    setSelectedGroup,
    setCurrentColor,
    addCourse,
    deleteCourse,
    addGroup,
    deleteGroup,
  } = useCourseStore()

  const getCoursesState = () => {
    const { courses } = useCourseStore.getState()

    console.log(courses)
  }

  const handleAddCourse = () => {
    if (courseName.trim()) {
      addCourse(courseName)
      setCourseName('')
    }
  }

  return (
    <div>
      <div className='mb-4'>
        <input
          type='text'
          placeholder={t('courseName')}
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <div className=''>
          <span> Color </span>
          <input
            type='color'
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </div>

        {selectedCourse && (
          <button
            type='button'
            className='bg-gray-700 text-white px-4 py-1 rounded'
            onClick={() => addGroup(selectedCourse.name)}
          >
            {t('addGroup')}
          </button>
        )}
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
              className='w-4 h-4 rounded-full mr-2'
              style={{ backgroundColor: selectedCourse.color }}
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
                <div
                  className='w-6 h-6 rounded-full mr-3'
                  style={{ backgroundColor: course.color }}
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
        ))}
      </div>

      <button
        className='bg-red-600 hover:bg-red-500 text-white py-2 rounded'
        onClick={getCoursesState}
      >
        Get Courses
      </button>
    </div>
  )
}

export default Panel
