import { Header } from '../components/Header'
import { Outlet } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

const MainLayout = () => {
  return (
    <div className='flex h-screen dark:bg-neutral-800 bg-neutral-100'>
      <SidebarProvider>
        <div className='relative'>
          <AppSidebar />
        </div>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <header className='p-4 border-b dark:border-neutral-700'>
            <div className='flex items-center justify-between'>
              <Header />
            </div>
          </header>
          <main className='flex-1 dark:bg-neutral-800 p-4 overflow-y-auto'>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default MainLayout
