import CourseForm from '@/components/courseForm/CourseForm'
import { Button } from '@/components/ui/button'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Trash2, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'

const CourseList = () => {
  const { courses, deleteCourse, toggleCourseVisibility } = useCourseStore()
  const { t } = useTranslation()

  if (courses.length === 0) {
    return (
      <div className='px-4 py-4 text-center group-data-[collapsible=icon]:hidden'>
        <p className='text-xs text-neutral-500 dark:text-neutral-500'>
          {t('noCoursesYet')}
        </p>
      </div>
    )
  }

  return (
    <SidebarMenu>
      {courses.map((course) => (
        <SidebarMenuItem
          key={course.name}
          className='group-data-[collapsible=icon]:hidden'
        >
          <div
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
              !course.isActive ? 'opacity-50' : ''
            }`}
          >
            <div className='flex items-center gap-2 min-w-0'>
              <div
                className={`h-4 w-4 flex-shrink-0 rounded-full ${course.color}`}
              />
              <span
                className={`truncate max-w-full ${!course.isActive ? 'line-through' : ''}`}
              >
                {course.name}
              </span>
            </div>
            <div className='flex items-center space-x-0.5 flex-shrink-0'>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 dark:hover:bg-neutral-900/80 cursor-pointer'
                onClick={() => toggleCourseVisibility(course.name)}
              >
                {course.isActive ? (
                  <Eye className='h-4 w-4 text-neutral-600' />
                ) : (
                  <EyeOff className='h-4 w-4 text-neutral-600' />
                )}
              </Button>
              <CourseForm existingCourse={course} />
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 dark:hover:bg-neutral-900/80 cursor-pointer'
                onClick={() => deleteCourse(course.name)}
              >
                <Trash2 className='h-4 w-4 text-neutral-600' />
              </Button>
            </div>
          </div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default CourseList
