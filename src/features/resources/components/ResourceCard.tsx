import { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Button, Card } from '@/design-system'
import type { DeleteTarget } from './DeleteResourceDialog'
import { ResourceStatusBadge } from './ResourceStatusBadge'

interface ResourceCardProps {
  resource: Resource
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
  const isCompleted = resource.status === 'completed'

  return (
    <Card variant="outline">
      <CardBody>
        <ResourceInfo>
          <ResourceLink to={routeTo.resource(resource.resourceId)}>
            <Name>{resource.name}</Name>
          </ResourceLink>
          <ResourceStatusBadge status={resource.status} />
        </ResourceInfo>

        <Actions>
          {isCompleted ? (
            <ActionLink to={routeTo.resourceDetails(resource.resourceId)}>
              View summary
            </ActionLink>
          ) : (
            <ActionLink to={routeTo.resource(resource.resourceId)}>Edit</ActionLink>
          )}
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() =>
              onDeleteRequest({
                resourceId: resource.resourceId,
                name: resource.name,
              })
            }
            aria-label={`Delete ${resource.name}`}
          >
            Delete
          </Button>
        </Actions>
      </CardBody>
    </Card>
  )
})

const Name = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const ResourceLink = styled(Link)`
  text-decoration: none;
  min-width: 0;

  &:hover ${Name} {
    color: ${({ theme }) => theme.colors.primaryStrong};
  }
`

const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const ResourceInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.md};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const ActionLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`
