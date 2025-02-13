import Header from '../components/Header'
import Aside from '../components/Aside'
import { Outlet } from 'react-router'
import '../styles/mainLayout.css'


const MainLayout = () => {
  return (
    <div className="main-layout h-screen p-2 gap-2">
      <header className="layout-header bg-blue-500 overflow-y-auto">
        <Header />       
      </header>

      <aside className="layout-aside bg-yellow-400 overflow-y-auto">
        <Aside />
      </aside>
      
      <main className="layout-main bg-green-600 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout