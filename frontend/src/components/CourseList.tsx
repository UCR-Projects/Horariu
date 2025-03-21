import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseForm from '@/components/courseForm/CourseForm'
import useCourseStore from '@/stores/useCourseStore'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'

const CourseList = () => {
  const { courses, deleteCourse } = useCourseStore()

  return (
    <SidebarMenu>
      {courses.map((course) => (
        <SidebarMenuItem
          key={course.name}
          className='group-data-[collapsible=icon]:hidden'
        >
          <div className='flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800'>
            <div className='flex items-center gap-2 min-w-0'>
              <div
                className={`h-4 w-4 flex-shrink-0 rounded-full ${course.color}`}
              />
              <span className='truncate max-w-full'>{course.name}</span>
            </div>
            <div className='flex items-center space-x-1 flex-shrink-0'>
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
