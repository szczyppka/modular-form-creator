import { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Card } from '@/design-system'
import { ResourceStatusBadge } from './ResourceStatusBadge'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

interface ResourceCardProps {
  resource: Resource
}

/**
 * Memoized list item: typing in the search box re-renders the page on every
 * keystroke, but TanStack Query's structural sharing keeps unchanged `resource`
 * references stable, so memo skips re-rendering untouched cards.
 */
export const ResourceCard = memo(function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <CardLink to={routeTo.resource(resource.resourceId)}>
      <Card variant="outline">
        <CardBody>
          <div>
            <Name>{resource.name}</Name>
            <Meta>
              #{resource.resourceId} · created{' '}
              {dateFormatter.format(new Date(resource.createdAt))}
            </Meta>
          </div>
          <ResourceStatusBadge status={resource.status} />
        </CardBody>
      </Card>
    </CardLink>
  )
})

const CardLink = styled(Link)`
  text-decoration: none;
  display: block;

  &:hover > * {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const Name = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Meta = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`
