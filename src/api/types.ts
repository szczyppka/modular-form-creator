export const RESOURCE_STATUS_VALUES = ['draft', 'completed'] as const
export type ResourceStatus = (typeof RESOURCE_STATUS_VALUES)[number]

export const PRIORITY_VALUES = ['low', 'medium', 'high'] as const
export type Priority = (typeof PRIORITY_VALUES)[number]

export const PROJECT_CATEGORY_VALUES = ['internal', 'external', 'vendor'] as const
export type ProjectCategory = (typeof PROJECT_CATEGORY_VALUES)[number]

export const TEAM_MEMBER_VALUES = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const
export type TeamMember = (typeof TEAM_MEMBER_VALUES)[number]

/**
 * Module shapes as returned by the API.
 * Freshly created resources hold empty strings / arrays, hence the `| ''` unions.
 */
export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: Priority | ''
}

export interface ProjectDetails {
  projectName: string
  budget: string
  category: ProjectCategory | ''
  options: TeamMember[]
}

export interface Resource {
  _id: string
  resourceId: number
  name: string
  status: ResourceStatus
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
  createdAt: string
  updatedAt: string
}

export interface ProvisionResourceResponse {
  alreadyCompleted: false
  resource: Resource
}

/** Accepted by all /{id} endpoints: numeric resourceId or Mongo ObjectId. */
export type ResourceId = number | string

/**
 * Write payloads — stricter than response shapes:
 * the backend requires every field, with enum values already chosen.
 */
export interface BasicInfoPayload {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: Priority
}

export interface ProjectDetailsPayload {
  projectName: string
  budget: string
  category: ProjectCategory
  options: TeamMember[]
}

/** Full replacement payload for PUT — allowed only for completed resources. */
export interface ResourcePayload {
  name: string
  basicInfo: BasicInfoPayload
  projectDetails: ProjectDetailsPayload
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ResourceListResponse {
  items: Resource[]
  pagination: Pagination
}

export interface ListResourcesParams {
  page?: number
  pageSize?: number
  status?: ResourceStatus
  name?: string
  sortOrder?: 'asc' | 'desc'
}
