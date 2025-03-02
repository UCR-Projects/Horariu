import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from '@/components/ui/sidebar'

import CourseFormDialog from '@/components/formtest'

export const AppSidebar = () => {
  return (
    <div className='bg-neutral-100'>
      <Sidebar>
        <SidebarHeader className='text-2xl font-bold'>HOLA</SidebarHeader>
        <SidebarContent>
          <CourseFormDialog />
          <SidebarGroup title='Group 1'>Hola</SidebarGroup>
          <SidebarGroup title='Group 2'>Hola2</SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
