import { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Button, Card } from '@/design-system'
import type { DeleteTarget } from './DeleteResourceDialog'
import { ResourceStatusBadge } from './ResourceStatusBadge'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

interface ResourceCardProps {
  resource: Resource
  /** Must be referentially stable (useCallback) — it is part of the memo contract. */
  onDeleteRequest: (target: DeleteTarget) => void
}

/**
 * Memoized list item. Re-renders only when its `resource` reference changes:
 * TanStack Query's structural sharing keeps unchanged resources stable across
 * refetches, and the delete flow lives outside the card (shared dialog), so
 * the card itself is stateless.
 */
export const ResourceCard = memo(function ResourceCard({
  resource,
  onDeleteRequest,
}: ResourceCardProps) {
  return (
    <Card variant="outline">
      <CardBody>
        <ResourceLink to={routeTo.resource(resource.resourceId)}>
          <div>
            <Name>{resource.name}</Name>
            <Meta>
              #{resource.resourceId} · created{' '}
              {dateFormatter.format(new Date(resource.createdAt))}
            </Meta>
          </div>
          <ResourceStatusBadge status={resource.status} />
        </ResourceLink>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() =>
            onDeleteRequest({ resourceId: resource.resourceId, name: resource.name })
          }
          aria-label={`Delete ${resource.name}`}
        >
          Delete
        </Button>
      </CardBody>
    </Card>
  )
})

const Name = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const ResourceLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  flex: 1;

  &:hover ${Name} {
    color: ${({ theme }) => theme.colors.primaryStrong};
  }
`

const CardBody = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const Meta = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`
