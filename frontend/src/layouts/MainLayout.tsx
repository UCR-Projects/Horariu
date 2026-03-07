import { Outlet } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Header } from '@/components/layout'
import { AppSidebar } from '@/components/sidebar'
import { ErrorBoundary, ErrorBoundaryTest } from '@/components/error'

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarProvider className="min-h-0 h-full">
        <ErrorBoundary>
          <div className="relative">
            <AppSidebar />
          </div>
        </ErrorBoundary>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b border-border">
            <Header />
          </header>
          <main className="flex-1 bg-background p-4 overflow-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </SidebarProvider>
      <ErrorBoundaryTest />
    </div>
  )
}

export default MainLayout
