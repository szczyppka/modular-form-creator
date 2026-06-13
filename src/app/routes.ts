import type { ResourceId } from '@/api/types'

export const routePaths = {
  root: '/',
  resources: '/resources',
  resource: '/resources/:resourceId',
  resourceDetails: '/resources/:resourceId/details',
  basicInfo: '/resources/:resourceId/basic-info',
  projectDetails: '/resources/:resourceId/project-details',
} as const

function resourceRoute(id: ResourceId): string {
  return `/resources/${encodeURIComponent(String(id))}`
}

export const routeTo = {
  resources: () => routePaths.resources,
  resource: resourceRoute,
  resourceDetails: (id: ResourceId) => `${resourceRoute(id)}/details`,
  basicInfo: (id: ResourceId) => `${resourceRoute(id)}/basic-info`,
  projectDetails: (id: ResourceId) => `${resourceRoute(id)}/project-details`,
} as const
