import { Link, Navigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Badge, Card } from '@/design-system'
import {
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from '@/features/resources/completeness'
import { ResourceGate } from '@/features/resources/components/ResourceGate'
import { ResourceStatusBadge } from '@/features/resources/components/ResourceStatusBadge'
import { useCompletedResourceDraft } from '@/features/resources/useCompletedResourceDraft'

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
  const { draft } = useCompletedResourceDraft(resource.resourceId)

  // The summary is reachable only once both modules are complete — direct URL
  // entry on an unfinished draft goes back to the overview (also guards
  // against deep links shared too early).
  const isSummaryAvailable =
    resource.status === 'completed' ||
    (isBasicInfoComplete(resource.basicInfo) &&
      isProjectDetailsComplete(resource.projectDetails))

  if (!isSummaryAvailable) {
    return <Navigate to={routeTo.resource(resource.resourceId)} replace />
  }

  const basicInfo =
    resource.status === 'completed' && draft?.basicInfo
      ? draft.basicInfo
      : resource.basicInfo
  const projectDetails =
    resource.status === 'completed' && draft?.projectDetails
      ? draft.projectDetails
      : resource.projectDetails
  const isBasicComplete = isBasicInfoComplete(basicInfo)
  const isProjectComplete = isProjectDetailsComplete(projectDetails)

  return (
    <Page>
      <BackLink to={routeTo.resource(resource.resourceId)}>Back to overview</BackLink>

      <Header>
        <div>
          <Title>Resource details</Title>
          <Meta>{resource.name}</Meta>
        </div>
        <HeaderMeta>
          <ResourceStatusBadge status={resource.status} />
          {resource.status === 'completed' && draft ? (
            <Badge variant="warning">Unsaved local changes</Badge>
          ) : null}
        </HeaderMeta>
      </Header>

      <SummaryContainer>
        <Card variant="outline">
          <Section>
            <SectionHeader>
              <SectionTitle>Basic Info</SectionTitle>
              <Badge variant={isBasicComplete ? 'success' : 'neutral'}>
                {isBasicComplete ? 'Complete' : 'Incomplete'}
              </Badge>
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
              <SectionTitle>Project Details</SectionTitle>
              <Badge variant={isProjectComplete ? 'success' : 'neutral'}>
                {isProjectComplete ? 'Complete' : 'Incomplete'}
              </Badge>
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

const Title = styled.h1`
  margin: 0;
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

const SectionTitle = styled.h2`
  margin: 0;
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
