import { createBrowserRouter, Navigate } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
import { routePaths } from './routes'

/** Route modules are lazy-loaded so each page becomes its own chunk. */
export const router = createBrowserRouter([
  {
    path: routePaths.root,
    element: <Navigate to={routePaths.resources} replace />,
  },
  {
    path: routePaths.resources,
    lazy: async () => ({
      Component: (await import('../pages/ResourcesPage')).default,
    }),
  },
  {
    path: routePaths.resource,
    lazy: async () => ({
      Component: (await import('../pages/ResourcePage')).default,
    }),
  },
  {
    path: routePaths.resourceDetails,
    lazy: async () => ({
      Component: (await import('../pages/ResourceDetailsPage')).default,
    }),
  },
  {
    path: routePaths.basicInfo,
    lazy: async () => ({
      Component: (await import('../pages/BasicInfoPage')).default,
    }),
  },
  {
    path: routePaths.projectDetails,
    lazy: async () => ({
      Component: (await import('../pages/ProjectDetailsPage')).default,
    }),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
