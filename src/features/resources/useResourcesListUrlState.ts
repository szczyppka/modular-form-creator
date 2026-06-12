import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  buildListSearchParams,
  parseListSearchParams,
  toListRequestParams,
  type ResourcesListUrlState,
} from './listSearchParams'

/**
 * Owns the list URL state: parsing, the debounced search input,
 * and write-backs. Pages consume state and callbacks — no effects of their own.
 */
export function useResourcesListUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlState = useMemo(() => parseListSearchParams(searchParams), [searchParams])

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
