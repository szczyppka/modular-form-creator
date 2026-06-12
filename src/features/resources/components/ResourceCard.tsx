import { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Card, IconButton } from '@/design-system'
import type { DeleteTarget } from './DeleteResourceDialog'
import { ResourceStatusBadge } from './ResourceStatusBadge'

interface ResourceCardProps {
  resource: Resource
  onDeleteRequest: (target: DeleteTarget) => void
}

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
            <IconLink
              to={routeTo.resourceDetails(resource.resourceId)}
              aria-label="View summary"
              title="View summary"
            >
              <span aria-hidden="true">📄</span>
            </IconLink>
          ) : (
            <IconLink
              to={routeTo.resource(resource.resourceId)}
              aria-label="Edit"
              title="Edit"
            >
              <span aria-hidden="true">✏️</span>
            </IconLink>
          )}
          <IconButton
            type="button"
            variant="ghost"
            size="small"
            onClick={() =>
              onDeleteRequest({
                resourceId: resource.resourceId,
                name: resource.name,
              })
            }
            aria-label={`Delete ${resource.name}`}
            title="Delete"
          >
            <span aria-hidden="true">🗑️</span>
          </IconButton>
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
  gap: ${({ theme }) => theme.spacing.sm};
`

const IconLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`
