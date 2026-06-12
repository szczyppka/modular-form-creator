import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { routeTo } from '@/app/routes'
import { ProjectDetailsForm } from '@/features/resources/components/ProjectDetailsForm'
import { ResourceGate } from '@/features/resources/components/ResourceGate'
import { isBasicInfoComplete } from '@/features/resources/completeness'

export default function ProjectDetailsPage() {
  const { resourceId } = useParams()

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => {
        const isCompleted = resource.status === 'completed'
        const isLocked = !isCompleted && !isBasicInfoComplete(resource.basicInfo)
        const canEdit = !isCompleted && !isLocked

        return (
          <Page>
            <BackLink to={routeTo.resource(resource.resourceId)}>
              Back to overview
            </BackLink>
            <Title>Project Details</Title>
            <Meta>{resource.name}</Meta>

            {isCompleted ? (
              <StateMessage>
                Changes are kept locally until you submit them from the overview.
              </StateMessage>
            ) : null}

            {isLocked ? (
              <LockedState>
                <StateMessage>
                  Project Details unlocks after Basic Info is completed.
                </StateMessage>
                <BasicInfoLink to={routeTo.basicInfo(resource.resourceId)}>
                  Complete Basic Info first
                </BasicInfoLink>
              </LockedState>
            ) : null}

            {canEdit || isCompleted ? <ProjectDetailsForm resource={resource} /> : null}
          </Page>
        )
      }}
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

const Title = styled.h1`
  margin: 0;
`

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const StateMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const LockedState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

const BasicInfoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 600;
`
