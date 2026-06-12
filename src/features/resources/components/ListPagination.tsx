import styled from 'styled-components'
import type { Pagination } from '@/api/types'
import { Button } from '@/design-system'

interface ListPaginationProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function ListPagination({ pagination, onPageChange }: ListPaginationProps) {
  const { page, totalPages } = pagination

  if (totalPages <= 1) {
    return null
  }

  return (
    <Bar>
      <Button
        variant="secondary"
        size="small"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <PageInfo>
        Page {page} of {totalPages}
      </PageInfo>
      <Button
        variant="secondary"
        size="small"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </Bar>
  )
}

const Bar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const PageInfo = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`
