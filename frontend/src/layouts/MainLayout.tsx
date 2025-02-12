import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router'

const MainLayout = () => {
  return (
    <div className="">
      <Header />
        <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout