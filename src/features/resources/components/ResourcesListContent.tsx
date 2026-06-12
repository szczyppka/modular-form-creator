import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import type { ListResourcesParams } from '@/api/types'
import { Button } from '@/design-system'
import { useResourcesList } from '../queries'
import { ListPagination } from './ListPagination'
import { ResourceCard } from './ResourceCard'

interface ResourcesListContentProps {
  requestParams: ListResourcesParams
  onPageChange: (page: number) => void
}

/** Owns the list query and renders exactly one state: loading, error, empty, or items. */
export function ResourcesListContent({
  requestParams,
  onPageChange,
}: ResourcesListContentProps) {
  const { data, isPending, isError, error, isPlaceholderData, refetch } =
    useResourcesList(requestParams)

  if (isPending) {
    return <StateMessage>Loading resources…</StateMessage>
  }

  if (isError) {
    return (
      <StateMessage role="alert">
        {error instanceof ApiError ? error.message : 'Something went wrong.'}{' '}
        <Button variant="secondary" size="small" onClick={() => refetch()}>
          Try again
        </Button>
      </StateMessage>
    )
  }

  if (!data || data.items.length === 0) {
    return <StateMessage>No resources.</StateMessage>
  }

  return (
    <>
      <List $dimmed={isPlaceholderData}>
        {data.items.map((resource) => (
          <li key={resource._id}>
            <ResourceCard resource={resource} />
          </li>
        ))}
      </List>
      <ListPagination pagination={data.pagination} onPageChange={onPageChange} />
    </>
  )
}

const List = styled.ul<{ $dimmed: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.6 : 1)};
  transition: opacity 0.15s ease;
`

const StateMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`
