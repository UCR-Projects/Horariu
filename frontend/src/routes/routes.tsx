import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]
