import { createRoot } from 'react-dom/client'
import { routes } from './routes/routes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import './i18n.config'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <RouterProvider router={router} />
  </ThemeProvider>
)
