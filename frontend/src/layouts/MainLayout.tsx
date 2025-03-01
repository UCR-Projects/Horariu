import Header from '../components/Header'
import Aside from '../components/Aside'
import { Outlet } from 'react-router'
import '../styles/mainLayout.css'

const MainLayout = () => {
  return (
    <div className='main-layout h-screen transition-colors duration-200 background foreground bg-neutral-100'>
      <header className='layout-header overflow-y-auto transition-colors duration-200 dark:bg-neutral-800'>
        <Header />
      </header>

      <aside
        className='layout-aside overflow-y-auto
          transition-colors duration-200 dark:bg-neutral-900 p-2 bg-neutral-300/50'
      >
        <Aside />
      </aside>

      <main className='layout-main overflow-y-auto transition-colors duration-200 dark:bg-neutral-800 p-2'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
