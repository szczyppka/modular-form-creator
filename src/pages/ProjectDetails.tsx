import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { routeTo } from '@/app/routes'
import { Breadcrumbs, CurrentCrumb, MutedText, NavigationLink, PageLayout, Separator } from '@/app/styles'
import { CompletedEditNotice } from '@/features/resources/components/CompletedEditNotice'
import { ProjectDetailsForm } from '@/features/resources/components/ProjectDetailsForm'
import { ResourceGate } from '@/features/resources/components/ResourceGate'
import { isBasicInfoComplete } from '@/features/resources/completeness'

export default function ProjectDetails() {
  const { resourceId } = useParams()

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => {
        const isLocked =
          resource.status !== 'completed' && !isBasicInfoComplete(resource.basicInfo)

        return (
          <PageLayout>
            <Breadcrumbs aria-label="Breadcrumb">
              <NavigationLink to={routeTo.resources()}>Resources</NavigationLink>
              <Separator aria-hidden="true">/</Separator>
              <NavigationLink to={routeTo.resource(resource.resourceId)}>
                {resource.name}
              </NavigationLink>
              <Separator aria-hidden="true">/</Separator>
              <CurrentCrumb>Project Details</CurrentCrumb>
            </Breadcrumbs>
            <h1>Project Details</h1>

            <CompletedEditNotice status={resource.status} />

            {isLocked ? (
              <LockedState>
                <MutedText>
                  Project Details unlocks after Basic Info is completed.
                </MutedText>
                <BasicInfoLink to={routeTo.basicInfo(resource.resourceId)}>
                  Complete Basic Info first
                </BasicInfoLink>
              </LockedState>
            ) : (
              <ProjectDetailsForm resource={resource} />
            )}
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
