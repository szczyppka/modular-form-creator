import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  buildListSearchParams,
  parseListSearchParams,
  toListRequestParams,
  type ResourcesListUrlState,
} from './listSearchParams'

/**
 * Owns parsing and updates for the resources list URL state.
 */
export function useResourcesListUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlState = parseListSearchParams(searchParams)

  const updateUrl = useCallback(
    (patch: Partial<ResourcesListUrlState>) => {
      setSearchParams(
        (prev) => buildListSearchParams({ ...parseListSearchParams(prev), ...patch }),
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return {
    urlState,
    requestParams: toListRequestParams(urlState),
    updateUrl,
  }
}
