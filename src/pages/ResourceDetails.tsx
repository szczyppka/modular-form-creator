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
import { useBufferedResource } from '@/features/resources/edit-buffer/useBufferedResource'

export default function ResourceDetails() {
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
  const { resource: resourceWithChanges, buffer } = useBufferedResource(resource)
  const isSummaryAvailable =
    resource.status === 'completed' || hasCompleteModules(resource)

  if (!isSummaryAvailable) {
    return <Navigate to={routeTo.resource(resource.resourceId)} replace />
  }

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
              <Detail label="Resource name" value={basicInfo.resourceName} />
              <Detail label="Owner" value={basicInfo.owner} />
              <Detail label="Email" value={basicInfo.email} />
              <Detail label="Description" value={basicInfo.description} />
              <Detail label="Priority" value={basicInfo.priority} />
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
              <Detail label="Project name" value={projectDetails.projectName} />
              <Detail label="Budget" value={projectDetails.budget} />
              <Detail label="Category" value={projectDetails.category} />
              <Detail label="Team members" value={projectDetails.options.join(', ')} />
            </DetailsList>
          </Section>
        </Card>
      </SummaryContainer>
    </PageLayout>
  )
}

interface DetailProps {
  label: string
  value: string
}

function Detail({ label, value }: DetailProps) {
  return (
    <DetailItem>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value || 'Not provided'}</DetailValue>
    </DetailItem>
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
