import { useState } from 'react'
import Header from '../components/Header'
import Aside from '../components/Aside'
import { Outlet } from 'react-router'
import '../styles/mainLayout.css'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div
      className={`main-layout bg-neutral-100 dark:bg-neutral-800 ${
        isSidebarOpen ? '' : 'sidebar-collapsed'
      }`}
    >
      <header className='layout-header flex items-center dark:bg-neutral-800'>
        <Header />
      </header>

      <Aside
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className='layout-main dark:bg-neutral-800 p-2'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
