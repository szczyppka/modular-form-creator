import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import { routeTo } from '@/app/routes'
import { Button } from '@/design-system'
import {
  DeleteResourceDialog,
  type DeleteTarget,
} from '@/features/resources/components/DeleteResourceDialog'
import { ResourceStatusBadge } from '@/features/resources/components/ResourceStatusBadge'
import { useResource } from '@/features/resources/queries'

export default function ResourceOverviewPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const resourceQuery = useResource(resourceId ?? '')
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  if (!resourceId) {
    return <StateMessage role="alert">Resource id is missing.</StateMessage>
  }

  if (resourceQuery.isPending) {
    return <StateMessage>Loading resource…</StateMessage>
  }

  if (resourceQuery.isError) {
    const message =
      resourceQuery.error instanceof ApiError
        ? resourceQuery.error.message
        : 'Unable to load the resource.'

    return (
      <StateMessage role="alert">
        {message}{' '}
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => resourceQuery.refetch()}
        >
          Try again
        </Button>
      </StateMessage>
    )
  }

  const resource = resourceQuery.data

  return (
    <Page>
      <BackLink to={routeTo.resources()}>Back to resources</BackLink>
      <Header>
        <div>
          <Title>{resource.name}</Title>
          <Meta>Resource #{resource.resourceId}</Meta>
        </div>
        <ResourceStatusBadge status={resource.status} />
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setDeleteTarget({ resourceId: resource.resourceId, name: resource.name })
          }
          aria-label={`Delete ${resource.name}`}
        >
          Delete
        </Button>
      </Header>

      <DeleteResourceDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => navigate(routeTo.resources())}
      />
    </Page>
  )
}

const Page = styled.section`
  width: min(920px, 100%);
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  width: fit-content;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h1`
  margin: 0;
`

const Meta = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.inkMuted};
`
const StateMessage = styled.p`
  margin: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.inkMuted};
`
