import Header from '../components/Header'
import { Outlet } from 'react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

const MainLayout = () => {
  return (
    <div className='flex h-screen dark:bg-neutral-800'>
      <SidebarProvider>
        <AppSidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <header className='p-4 border-b dark:border-neutral-700'>
            <div className='flex items-center justify-between'>
              <SidebarTrigger />
              <Header />
            </div>
          </header>
          <main className='flex-1 bg-neutral-100 dark:bg-neutral-800 p-4 overflow-y-auto'>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default MainLayout
