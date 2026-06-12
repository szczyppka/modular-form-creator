import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listResources } from '@/api/resources'
import type { ListResourcesParams } from '@/api/types'

/** Hierarchical query keys — invalidating `all` covers every resource query. */
export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (params: ListResourcesParams) => [...resourceKeys.lists(), params] as const,
}

export function useResourcesList(params: ListResourcesParams) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: ({ signal }) => listResources(params, signal),
    // keep showing the previous page while the next one loads — no layout flash
    placeholderData: keepPreviousData,
  })
}
