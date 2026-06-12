import styled from 'styled-components'
import type { ListResourcesParams, ResourceStatus } from '@/api/types'
import { Input, Select } from '@/design-system'
import type { ResourcesListUrlState } from '../listSearchParams'
import { useResourcesList } from '../queries'

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
  nameInput: string
  onNameInputChange: (value: string) => void
  status: ResourceStatus | undefined
  sortOrder: 'asc' | 'desc'
  onChange: (patch: Partial<ResourcesListUrlState>) => void
  requestParams: ListResourcesParams
}

export function ResourcesListFilters({
  nameInput,
  onNameInputChange,
  status,
  sortOrder,
  onChange,
  requestParams,
}: ResourcesListFiltersProps) {
  // shares the cache entry with ResourcesListContent — no extra request
  const { data } = useResourcesList(requestParams)

  // disable only when the collection itself is empty; with any filter active the
  // controls must stay usable so the user can clear them
  const hasActiveFilters = Boolean(nameInput || status)
  const isCollectionEmpty = !hasActiveFilters && data?.pagination.totalItems === 0
  const fieldState = isCollectionEmpty ? 'disabled' : 'normal'

  return (
    <Bar>
      <SearchField>
        <Input
          label="Search"
          placeholder="Search by name"
          value={nameInput}
          state={fieldState}
          onChange={(event) => onNameInputChange(event.target.value)}
        />
      </SearchField>
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status ?? ''}
        state={fieldState}
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
        state={fieldState}
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
