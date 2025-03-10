import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from '@/components/ui/sidebar'
import { Trash2 } from 'lucide-react'

import CourseForm from '@/components/courseForm/CourseForm'
import useCourseStore from '@/stores/useCourseStore'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export const AppSidebar = () => {
  const { t } = useTranslation()
  const { courses, deleteCourse } = useCourseStore()
  return (
    <div className=''>
      <Sidebar>
        <SidebarHeader className='text-2xl font-bold'>
          {t('courses')}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title={t('courseList')}>
            <CourseForm />

            {courses.map((course) => (
              <div
                key={course.name}
                className='flex items-center justify-between p-2 dark:hover:bg-neutral-800 rounded-md transition-colors'
              >
                <div className='flex-grow cursor-pointer'>{course.name}</div>
                <div className='flex items-center space-x-2'>
                  <CourseForm existingCourse={course} />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 dark:hover:bg-neutral-900/80'
                    onClick={() => deleteCourse(course.name)}
                  >
                    <Trash2 className='h-4 w-4 text-neutral-600' />
                  </Button>
                </div>
              </div>
            ))}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
