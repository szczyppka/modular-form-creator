import styled from 'styled-components'
import { RESOURCE_STATUS_VALUES, type ResourceStatus } from '@/api/types'
import { Select, type SelectOption } from '@/design-system'
import { buildSelectOptions } from '@/shared/selectOptions'
import type { ResourcesListUrlState } from '../listSearchParams'
import { SearchField } from './SearchField'

const STATUS_OPTIONS = buildSelectOptions(RESOURCE_STATUS_VALUES, {
  placeholder: 'All statuses',
})

const SORT_OPTIONS = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
] satisfies SelectOption[]

interface ResourcesFiltersProps {
  searchTerm: string
  status: ResourceStatus | undefined
  sortOrder: 'asc' | 'desc'
  onChange: (patch: Partial<ResourcesListUrlState>) => void
}

export function ResourcesFilters({
  searchTerm,
  status,
  sortOrder,
  onChange,
}: ResourcesFiltersProps) {
  return (
    <Bar>
      <SearchFieldContainer>
        <SearchField
          key={searchTerm}
          initialValue={searchTerm}
          onSearch={(name) => onChange({ name, page: 1 })}
        />
      </SearchFieldContainer>
      <FilterControl>
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
      </FilterControl>
      <FilterControl>
        <Select
          label="Sort"
          options={SORT_OPTIONS}
          value={sortOrder}
          onChange={(event) =>
            onChange({ sortOrder: event.target.value as 'asc' | 'desc', page: 1 })
          }
        />
      </FilterControl>
    </Bar>
  )
}

const Bar = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const SearchFieldContainer = styled.div`
  flex: 1 1 260px;
`

const FilterControl = styled.div`
  flex: 0 1 180px;
  min-width: 160px;

  @media (max-width: 640px) {
    flex-grow: 1;
  }
`
