import { useEffect, useState } from 'react'
import styled from 'styled-components'
import type { ResourceStatus } from '@/api/types'
import { Input, Select } from '@/design-system'
import { useDebouncedValue } from '@/shared/useDebouncedValue'
import type { ResourcesListUrlState } from '../listSearchParams'

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
]

interface ResourcesListFiltersProps {
  /** Initial search term from the URL — the input owns its value afterwards. */
  initialName: string
  status: ResourceStatus | undefined
  sortOrder: 'asc' | 'desc'
  onChange: (patch: Partial<ResourcesListUrlState>) => void
}

export function ResourcesListFilters({
  initialName,
  status,
  sortOrder,
  onChange,
}: ResourcesListFiltersProps) {
  // The input is the single owner of its text while mounted — never remount it
  // (e.g. via a key) on URL updates, or the user loses focus mid-typing.
  const [nameInput, setNameInput] = useState(initialName)
  const debouncedName = useDebouncedValue(nameInput)

  useEffect(() => {
    if (debouncedName !== initialName) {
      onChange({ name: debouncedName, page: 1 })
    }
  }, [initialName, debouncedName, onChange])

  return (
    <Bar>
      <SearchField>
        <Input
          label="Search"
          placeholder="Search by name"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
        />
      </SearchField>
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status ?? ''}
        onChange={(event) =>
          onChange({
            status: (event.target.value || undefined) as ResourceStatus | undefined,
            page: 1,
          })
        }
      />
      <Select
        label="Sort"
        options={SORT_OPTIONS}
        value={sortOrder}
        onChange={(event) =>
          onChange({ sortOrder: event.target.value as 'asc' | 'desc', page: 1 })
        }
      />
    </Bar>
  )
}

const Bar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`

const SearchField = styled.div`
  flex: 1;
`
