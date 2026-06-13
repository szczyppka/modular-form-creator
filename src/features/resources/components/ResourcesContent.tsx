import { useSearchParams } from 'react-router-dom'
import {
  buildListSearchParams,
  parseListSearchParams,
  toListRequestParams,
  type ResourcesListUrlState,
} from '../listSearchParams'
import { ResourcesFilters } from './ResourcesFilters'
import { ResourcesList } from './ResourcesList'

export function ResourcesContent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlState = parseListSearchParams(searchParams)
  const requestParams = toListRequestParams(urlState)

  const updateUrl = (patch: Partial<ResourcesListUrlState>) => {
    setSearchParams(
      (prev) => buildListSearchParams({ ...parseListSearchParams(prev), ...patch }),
      { replace: true },
    )
  }

  return (
    <>
      <ResourcesFilters
        searchTerm={urlState.name}
        status={urlState.status}
        sortOrder={urlState.sortOrder}
        onChange={updateUrl}
      />

      <ResourcesList
        requestParams={requestParams}
        onPageChange={(page) => updateUrl({ page })}
      />
    </>
  )
}
