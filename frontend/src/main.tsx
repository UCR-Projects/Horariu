import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import { routes } from '@/routes/routes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'
import { inject } from '@vercel/analytics'
import { ErrorBoundary } from '@/components/error'
import '@/../i18n.config'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

if (import.meta.env.PROD) {
  inject()
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </ErrorBoundary>
)
