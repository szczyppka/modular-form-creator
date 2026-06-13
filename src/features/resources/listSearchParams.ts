import type { ListResourcesParams, ResourceStatus } from '@/api/types'

export interface ResourcesListUrlState {
  page: number
  status: ResourceStatus | undefined
  name: string
  sortOrder: 'asc' | 'desc'
}

export function parseListSearchParams(
  searchParams: URLSearchParams,
): ResourcesListUrlState {
  const rawPage = Number(searchParams.get('page'))
  const rawStatus = searchParams.get('status')
  const rawSort = searchParams.get('sort')

  return {
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    status: rawStatus === 'draft' || rawStatus === 'completed' ? rawStatus : undefined,
    name: searchParams.get('name') ?? '',
    sortOrder: rawSort === 'asc' ? 'asc' : 'desc',
  }
}

export function buildListSearchParams(state: ResourcesListUrlState): URLSearchParams {
  const params = new URLSearchParams()

  if (state.page > 1) {
    params.set('page', String(state.page))
  }

  if (state.status) {
    params.set('status', state.status)
  }

  if (state.name) {
    params.set('name', state.name)
  }

  if (state.sortOrder !== 'desc') {
    params.set('sort', state.sortOrder)
  }

  return params
}

export function toListRequestParams(state: ResourcesListUrlState): ListResourcesParams {
  return {
    page: state.page,
    pageSize: 10,
    status: state.status,
    name: state.name.trim() || undefined,
    sortOrder: state.sortOrder,
  }
}
