import { createRoot } from 'react-dom/client'
import { routes } from './routes/routes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
