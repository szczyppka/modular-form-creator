import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '@/shared/useDebouncedValue'
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

  const [nameInput, setNameInput] = useState(urlState.name)
  const debouncedName = useDebouncedValue(nameInput)

  // sync the debounced search term into the URL (and reset to page 1);
  // functional update keeps deps minimal and avoids stale-state races
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const state = parseListSearchParams(prev)
        if (state.name === debouncedName) return prev
        return buildListSearchParams({ ...state, name: debouncedName, page: 1 })
      },
      { replace: true },
    )
  }, [debouncedName, setSearchParams])

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
    nameInput,
    setNameInput,
    updateUrl,
  }
}
