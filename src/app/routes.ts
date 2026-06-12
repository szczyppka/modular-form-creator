import type { ResourceId } from '@/api/types'

/** Single source of truth for route paths - definitions and navigation builders. */
export const routePaths = {
  root: '/',
  resources: '/resources',
  resource: '/resources/:resourceId',
  resourceDetails: '/resources/:resourceId/details',
  basicInfo: '/resources/:resourceId/basic-info',
  projectDetails: '/resources/:resourceId/project-details',
} as const

export const routeTo = {
  resources: () => routePaths.resources,
  resource: (id: ResourceId) => `/resources/${id}`,
  resourceDetails: (id: ResourceId) => `/resources/${id}/details`,
  basicInfo: (id: ResourceId) => `/resources/${id}/basic-info`,
  projectDetails: (id: ResourceId) => `/resources/${id}/project-details`,
} as const
