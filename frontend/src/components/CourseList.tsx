import React from 'react'
import { useTranslation } from 'react-i18next'
import { Course } from '../types'
import { EditIcon, TrashIcon } from '../assets/icons/Icons'

interface CourseListProps {
  courses: Course[]
  selectedCourse: Course | null
  onSelectCourse: (course: Course | null) => void
  onEditCourse: (course: Course) => void
  onDeleteCourse: (name: string) => void
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
  onEditCourse,
  onDeleteCourse,
}) => {
  const { t } = useTranslation()

  if (courses.length === 0) {
    return <p className='text-sm text-zinc-500'>No hay cursos</p>
  }

  return (
    <>
      {courses.map((course) => (
        <div
          key={course.name}
          className={`mb-3 p-3 rounded ${
            selectedCourse?.name === course.name ? 'bg-zinc-700' : 'bg-zinc-900'
          }`}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className={`w-6 h-6 rounded-full mr-2 ${course.color}`} />
              <span className='font-medium truncate max-w-[200px]'>
                {course.name}
              </span>
            </div>
            <div className='flex'>
              <button
                className='text-zinc-400 hover:text-white mx-1 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation()
                  onEditCourse(course)
                  onSelectCourse(course)
                }}
              >
                <EditIcon />
              </button>
              <button
                className='text-zinc-400 hover:text-white mx-1 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteCourse(course.name)
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          <div className='text-sm text-zinc-400 mt-1'>
            {t('group')}s: {course.groups.length}
          </div>
        </div>
      ))}
    </>
  )
}

export default CourseList
