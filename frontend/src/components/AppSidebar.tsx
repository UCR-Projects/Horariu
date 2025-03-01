import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from '@/components/ui/sidebar'

export const AppSidebar = () => {
  return (
    <div className='bg-neutral-100'>
      <Sidebar>
        <SidebarHeader className='text-2xl font-bold'>HOLA</SidebarHeader>
        <SidebarContent>
          <SidebarGroup title='Group 1'>Hola</SidebarGroup>
          <SidebarGroup title='Group 2'>Hola2</SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
