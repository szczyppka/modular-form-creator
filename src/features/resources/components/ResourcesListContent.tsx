import { useState } from 'react'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import type { ListResourcesParams } from '@/api/types'
import { MutedText } from '@/app/styles'
import { Button } from '@/design-system'
import { useResourcesList } from '../queries'
import { DeleteResourceDialog, type DeleteTarget } from './DeleteResourceDialog'
import { ListPagination } from './ListPagination'
import { ResourceCard } from './ResourceCard'

interface ResourcesListContentProps {
  requestParams: ListResourcesParams
  onPageChange: (page: number) => void
}

export function ResourcesListContent({
  requestParams,
  onPageChange,
}: ResourcesListContentProps) {
  const { data, isPending, isError, error, isPlaceholderData, refetch } =
    useResourcesList(requestParams)

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  if (isPending) {
    return <MutedText>Loading resources…</MutedText>
  }

  if (isError) {
    return (
      <MutedText role="alert">
        {error instanceof ApiError ? error.message : 'Something went wrong.'}{' '}
        <Button variant="secondary" size="small" onClick={() => refetch()}>
          Try again
        </Button>
      </MutedText>
    )
  }

  if (!data || data.items.length === 0) {
    return <MutedText>No resources.</MutedText>
  }

  return (
    <>
      <List $dimmed={isPlaceholderData}>
        {data.items.map((resource) => (
          <li key={resource._id}>
            <ResourceCard resource={resource} onDeleteRequest={setDeleteTarget} />
          </li>
        ))}
      </List>
      <ListPagination pagination={data.pagination} onPageChange={onPageChange} />
      <DeleteResourceDialog target={deleteTarget} onClose={() => setDeleteTarget(null)} />
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
