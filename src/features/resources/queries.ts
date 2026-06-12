import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  provisionResource,
  updateBasicInfo,
  updateProjectDetails,
} from '@/api/resources'
import type {
  BasicInfoPayload,
  ListResourcesParams,
  ProjectDetailsPayload,
  ResourceId,
} from '@/api/types'

/** Hierarchical query keys — invalidating `all` covers every resource query. */
export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (params: ListResourcesParams) => [...resourceKeys.lists(), params] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...resourceKeys.details(), String(id)] as const,
}

export function useResourcesList(params: ListResourcesParams) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: ({ signal }) => listResources(params, signal),
    // keep showing the previous page while the next one loads — no layout flash
    placeholderData: keepPreviousData,
  })
}

export function useResource(id: ResourceId) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: ({ signal }) => getResource(id, signal),
    enabled: String(id).length > 0,
  })
}

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createResource,
    onSuccess: (resource) => {
      queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
      void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}

export function useUpdateBasicInfo(id: ResourceId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BasicInfoPayload) => updateBasicInfo(id, payload),
    onSuccess: (resource) => {
      queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
      void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}

export function useUpdateProjectDetails(id: ResourceId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProjectDetailsPayload) => updateProjectDetails(id, payload),
    onSuccess: (resource) => {
      queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
      void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}

/** The only way a resource can move from draft to completed. */
export function useProvisionResource(id: ResourceId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => provisionResource(id),
    onSuccess: (resource) => {
      queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
      void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteResource,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: resourceKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}
