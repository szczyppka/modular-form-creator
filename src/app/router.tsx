import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MutedText, PageLayout } from '@/app/styles'
import NotFound from '@/pages/NotFound'
import RouteError from '@/pages/RouteError'
import { routePaths } from './routes'

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: (
      <PageLayout>
        <MutedText>Loading page…</MutedText>
      </PageLayout>
    ),
    errorElement: <RouteError />,
    children: [
      {
        path: routePaths.root,
        element: <Navigate to={routePaths.resources} replace />,
      },
      {
        path: routePaths.resources,
        lazy: async () => ({
          Component: (await import('../pages/Resources')).default,
        }),
      },
      {
        path: routePaths.resource,
        lazy: async () => ({
          Component: (await import('../pages/Resource')).default,
        }),
      },
      {
        path: routePaths.resourceDetails,
        lazy: async () => ({
          Component: (await import('../pages/ResourceDetails')).default,
        }),
      },
      {
        path: routePaths.basicInfo,
        lazy: async () => ({
          Component: (await import('../pages/BasicInfo')).default,
        }),
      },
      {
        path: routePaths.projectDetails,
        lazy: async () => ({
          Component: (await import('../pages/ProjectDetails')).default,
        }),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
