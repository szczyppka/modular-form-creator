import { apiClient } from './client'
import type {
  BasicInfoPayload,
  ListResourcesParams,
  ProjectDetailsPayload,
  Resource,
  ResourceId,
  ResourceListResponse,
  ResourcePayload,
} from './types'

export async function listResources(
  params: ListResourcesParams = {},
  signal?: AbortSignal,
): Promise<ResourceListResponse> {
  const { data } = await apiClient.get<ResourceListResponse>('/resources', {
    params,
    signal,
  })
  return data
}

export async function getResource(
  id: ResourceId,
  signal?: AbortSignal,
): Promise<Resource> {
  const { data } = await apiClient.get<Resource>(`/resources/${id}`, { signal })
  return data
}

export async function createResource(resourceName: string): Promise<Resource> {
  const { data } = await apiClient.post<Resource>('/resources', { resourceName })
  return data
}

/** Draft-only. Rejected with 400 for completed resources. */
export async function updateBasicInfo(
  id: ResourceId,
  payload: BasicInfoPayload,
): Promise<Resource> {
  const { data } = await apiClient.patch<Resource>(`/resources/${id}/basic-info`, payload)
  return data
}

/** Draft-only. Additionally rejected until Basic Info is complete. */
export async function updateProjectDetails(
  id: ResourceId,
  payload: ProjectDetailsPayload,
): Promise<Resource> {
  const { data } = await apiClient.patch<Resource>(
    `/resources/${id}/project-details`,
    payload,
  )
  return data
}

/**
 * The only way to change status (`draft -> completed`).
 * Requires both modules complete; re-provisioning is rejected with 400.
 */
export async function provisionResource(id: ResourceId): Promise<Resource> {
  const { data } = await apiClient.patch<Resource>(`/resources/${id}/provisioning`)
  return data
}

/** Full replacement — allowed only for completed resources (draft is rejected). */
export async function replaceResource(
  id: ResourceId,
  payload: ResourcePayload,
): Promise<Resource> {
  const { data } = await apiClient.put<Resource>(`/resources/${id}`, payload)
  return data
}

export async function deleteResource(id: ResourceId): Promise<Resource> {
  const { data } = await apiClient.delete<Resource>(`/resources/${id}`)
  return data
}
