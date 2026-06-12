import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { routeTo } from '@/app/routes'
import { MutedText, NavigationLink, PageLayout } from '@/app/styles'
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

        return (
          <PageLayout>
            <NavigationLink to={routeTo.resource(resource.resourceId)}>
              Back to overview
            </NavigationLink>
            <h1>Project Details</h1>
            <MutedText>{resource.name}</MutedText>

            {isCompleted ? (
              <MutedText>
                Changes are kept locally until you submit them from the overview.
              </MutedText>
            ) : null}

            {isLocked ? (
              <LockedState>
                <MutedText>
                  Project Details unlocks after Basic Info is completed.
                </MutedText>
                <BasicInfoLink to={routeTo.basicInfo(resource.resourceId)}>
                  Complete Basic Info first
                </BasicInfoLink>
              </LockedState>
            ) : null}

            {!isLocked ? <ProjectDetailsForm resource={resource} /> : null}
          </PageLayout>
        )
      }}
    </ResourceGate>
  )
}

const LockedState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`

const BasicInfoLink = styled(NavigationLink)`
  font-weight: 600;
`
