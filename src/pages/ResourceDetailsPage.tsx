import { Navigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { NavigationLink, PageLayout } from '@/app/styles'
import { Badge, Card } from '@/design-system'
import {
  getBasicInfoCompletion,
  getProjectDetailsCompletion,
  hasCompleteModules,
} from '@/features/resources/completeness'
import { ModuleCompletionBadge } from '@/features/resources/components/ModuleCompletionBadge'
import { ResourceGate } from '@/features/resources/components/ResourceGate'
import { ResourceStatusBadge } from '@/features/resources/components/ResourceStatusBadge'
import { applyResourceEditBuffer } from '@/features/resources/edit-buffer/applyResourceEditBuffer'
import { useResourceEditBuffer } from '@/features/resources/edit-buffer/useResourceEditBuffer'

export default function ResourceDetailsPage() {
  const { resourceId } = useParams()

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => <ResourceDetailsContent resource={resource} />}
    </ResourceGate>
  )
}

interface ResourceDetailsContentProps {
  resource: Resource
}

function ResourceDetailsContent({ resource }: ResourceDetailsContentProps) {
  const { buffer } = useResourceEditBuffer(resource.resourceId)

  // The summary is reachable only once both modules are complete — direct URL
  // entry on an unfinished draft goes back to the overview (also guards
  // against deep links shared too early).
  const isSummaryAvailable =
    resource.status === 'completed' || hasCompleteModules(resource)

  if (!isSummaryAvailable) {
    return <Navigate to={routeTo.resource(resource.resourceId)} replace />
  }

  const resourceWithChanges = applyResourceEditBuffer(resource, buffer)
  const { basicInfo, projectDetails } = resourceWithChanges
  const basicInfoCompletion = getBasicInfoCompletion(basicInfo)
  const projectDetailsCompletion = getProjectDetailsCompletion(projectDetails)

  return (
    <PageLayout>
      <Breadcrumbs aria-label="Breadcrumb">
        <NavigationLink to={routeTo.resources()}>Resources</NavigationLink>
        <Separator aria-hidden="true">/</Separator>
        <NavigationLink to={routeTo.resource(resource.resourceId)}>
          {resource.name}
        </NavigationLink>
        <Separator aria-hidden="true">/</Separator>
        <CurrentCrumb aria-current="page">Details</CurrentCrumb>
      </Breadcrumbs>

      <Header>
        <div>
          <h1>Resource details</h1>
          <Meta>{resource.name}</Meta>
        </div>
        <HeaderMeta>
          <ResourceStatusBadge status={resource.status} />
          {resource.status === 'completed' && buffer ? (
            <Badge variant="warning">Unsaved local changes</Badge>
          ) : null}
        </HeaderMeta>
      </Header>

      <SummaryContainer>
        <Card variant="outline">
          <Section>
            <SectionHeader>
              <h2>Basic Info</h2>
              <ModuleCompletionBadge isComplete={basicInfoCompletion.isComplete} />
            </SectionHeader>
            <DetailsList>
              <DetailItem>
                <DetailLabel>Resource name</DetailLabel>
                <DetailValue>{basicInfo.resourceName}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Owner</DetailLabel>
                <DetailValue>{basicInfo.owner || 'Not provided'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{basicInfo.email || 'Not provided'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Description</DetailLabel>
                <DetailValue>{basicInfo.description || 'Not provided'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Priority</DetailLabel>
                <DetailValue>{basicInfo.priority || 'Not provided'}</DetailValue>
              </DetailItem>
            </DetailsList>
          </Section>
        </Card>

        <Card variant="outline">
          <Section>
            <SectionHeader>
              <h2>Project Details</h2>
              <ModuleCompletionBadge isComplete={projectDetailsCompletion.isComplete} />
            </SectionHeader>
            <DetailsList>
              <DetailItem>
                <DetailLabel>Project name</DetailLabel>
                <DetailValue>{projectDetails.projectName || 'Not provided'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Budget</DetailLabel>
                <DetailValue>{projectDetails.budget || 'Not provided'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <DetailValue>{projectDetails.category || 'Not provided'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Team members</DetailLabel>
                <DetailValue>
                  {projectDetails.options.length > 0
                    ? projectDetails.options.join(', ')
                    : 'Not provided'}
                </DetailValue>
              </DetailItem>
            </DetailsList>
          </Section>
        </Card>
      </SummaryContainer>
    </PageLayout>
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

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const Meta = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const DetailsList = styled.dl`
  margin: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const DetailItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`

const DetailLabel = styled.dt`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const DetailValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  word-break: break-word;
`
