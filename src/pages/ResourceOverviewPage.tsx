import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { routeTo } from '@/app/routes'
import { Button } from '@/design-system'
import {
  DeleteResourceDialog,
  type DeleteTarget,
} from '@/features/resources/components/DeleteResourceDialog'
import { ResourceGate } from '@/features/resources/components/ResourceGate'
import { ResourceStatusBadge } from '@/features/resources/components/ResourceStatusBadge'

export default function ResourceOverviewPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => (
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

          <Modules aria-label="Resource modules">
            <ModuleLink to={routeTo.basicInfo(resource.resourceId)}>
              Basic Info
            </ModuleLink>
            <ModuleLink to={routeTo.projectDetails(resource.resourceId)}>
              Project Details
            </ModuleLink>
          </Modules>

          <DeleteResourceDialog
            target={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => navigate(routeTo.resources())}
          />
        </Page>
      )}
    </ResourceGate>
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

const Modules = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 600;
`
