import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import RouteErrorBoundary from '../components/RouteErrorBoundary'

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]
