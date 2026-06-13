import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { routeTo } from '@/app/routes'
import { MutedText, NavigationLink, PageLayout } from '@/app/styles'
import { Button } from '@/design-system'
import {
  DeleteResourceDialog,
  type DeleteTarget,
} from '@/features/resources/components/DeleteResourceDialog'
import { ProvisionResourceAction } from '@/features/resources/components/ProvisionResourceAction'
import { ResourceGate } from '@/features/resources/components/ResourceGate'
import { ResourceModules } from '@/features/resources/components/ResourceModules'
import { ResourceStatusBadge } from '@/features/resources/components/ResourceStatusBadge'
import { SaveCompletedResourceAction } from '@/features/resources/components/SaveCompletedResourceAction'
import { hasCompleteModules } from '@/features/resources/completeness'
import { formatDate } from '@/shared/formatDate'

export default function Resource() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => (
        <PageLayout>
          <Breadcrumbs aria-label="Breadcrumb">
            <NavigationLink to={routeTo.resources()}>Resources</NavigationLink>
            <Separator aria-hidden="true">/</Separator>
            <CurrentCrumb>
              {resource.name}
            </CurrentCrumb>
          </Breadcrumbs>

          <Header>
            <Info>
              <h1>{resource.name}</h1>
              <MutedText>
                Created {formatDate(resource.createdAt)}
              </MutedText>
            </Info>

            <HeaderActions>
              <ResourceStatusBadge status={resource.status} />
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setDeleteTarget({
                    resourceId: resource.resourceId,
                    name: resource.name,
                  })
                }
                aria-label={`Delete ${resource.name}`}
              >
                Delete
              </Button>
            </HeaderActions>
          </Header>

          <ResourceModules resource={resource} />
          {resource.status === 'completed' || hasCompleteModules(resource) ? (
            <DetailsLink to={routeTo.resourceDetails(resource.resourceId)}>
              View summary
            </DetailsLink>
          ) : (
            null
          )}
          <ProvisionResourceAction resource={resource} />
          <SaveCompletedResourceAction resource={resource} />

          <DeleteResourceDialog
            target={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => navigate(routeTo.resources())}
          />
        </PageLayout>
      )}
    </ResourceGate>
  )
}
const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const CurrentCrumb = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const DetailsLink = styled(NavigationLink)`
  font-weight: 600;
`
