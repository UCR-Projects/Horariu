import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { useTranslation } from 'react-i18next'
import CourseList from '@/components/CourseList'
import CourseForm from './courseForm/CourseForm'

export function AppSidebar() {
  const { t } = useTranslation()

  return (
    <div className='relative'>
      <Sidebar collapsible='icon'>
        <div className='flex items-center justify-end p-2 align-middle'>
          <SidebarTrigger className='cursor-pointer' />
        </div>
        <SidebarHeader className='text-2xl font-bold px-4 py-2 group-data-[collapsible=icon]:hidden'>
          {t('courses')}
        </SidebarHeader>
        <SidebarContent>
          <div className='p-4 group-data-[collapsible=icon]:hidden'>
            <CourseForm />
          </div>
          <SidebarGroup className=' pt-10 overflow-y-auto'>
            <SidebarGroupLabel className='px-4 group-data-[collapsible=icon]:hidden'>
              {t('Lista de cursos')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <CourseList />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
