import Header from '../components/Header'
import Aside from '../components/Aside'
import { Outlet } from 'react-router'
import '../styles/mainLayout.css'

const MainLayout = () => {
  return (
    <div className='main-layout h-screen p-2 gap-2 bg-stone-100 dark:bg-zinc-700 transition-colors duration-200'>
      <header className='layout-header dark:bg-zinc-950 dark:text-sky-50 bg-stone-300 overflow-y-auto rounded transition-colors duration-200'>
        <Header />
      </header>

      <aside className='layout-aside dark:bg-zinc-950 dark:text-sky-50 bg-stone-300 overflow-y-auto rounded transition-colors duration-200'>
        <Aside />
      </aside>

      <main className='layout-main dark:bg-zinc-950 dark:text-sky-50 bg-stone-300 overflow-y-auto rounded transition-colors duration-200'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
