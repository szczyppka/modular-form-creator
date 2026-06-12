import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { NavigationLink } from '@/app/styles'
import { Card } from '@/design-system'
import {
  getBasicInfoCompletion,
  getProjectDetailsCompletion,
  type ModuleCompletion,
} from '../completeness'
import { applyResourceEditBuffer } from '../edit-buffer/applyResourceEditBuffer'
import { useResourceEditBuffer } from '../edit-buffer/useResourceEditBuffer'
import { ModuleCompletionBadge } from './ModuleCompletionBadge'

interface ResourceModulesProps {
  resource: Resource
}

export function ResourceModules({ resource }: ResourceModulesProps) {
  const { buffer } = useResourceEditBuffer(resource.resourceId)
  const resourceWithChanges = applyResourceEditBuffer(resource, buffer)
  const { basicInfo, projectDetails } = resourceWithChanges
  const basicInfoCompletion = getBasicInfoCompletion(basicInfo)
  const projectDetailsCompletion = getProjectDetailsCompletion(projectDetails)
  const canEditProjectDetails =
    resource.status === 'completed' || basicInfoCompletion.isComplete

  return (
    <Grid aria-label="Resource modules">
      <li>
        <ResourceModuleCard
          title="Basic Info"
          editPath={routeTo.basicInfo(resource.resourceId)}
          completion={basicInfoCompletion}
          canEdit
        />
      </li>
      <li>
        <ResourceModuleCard
          title="Project Details"
          editPath={routeTo.projectDetails(resource.resourceId)}
          completion={projectDetailsCompletion}
          canEdit={canEditProjectDetails}
        />
      </li>
    </Grid>
  )
}

interface ResourceModuleCardProps {
  title: string
  editPath: string
  completion: ModuleCompletion
  canEdit: boolean
}

function ResourceModuleCard({
  title,
  editPath,
  completion,
  canEdit,
}: ResourceModuleCardProps) {
  return (
    <ModuleCard variant="outline">
      <ModuleHeader>
        <ModuleName>{title}</ModuleName>
        <ModuleCompletionBadge isComplete={completion.isComplete} />
      </ModuleHeader>

      <ProgressTrack
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuenow={completion.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <ProgressFill
          $percentage={completion.percentage}
          $isComplete={completion.isComplete}
        />
      </ProgressTrack>
      <ProgressLabel>
        {completion.completedFields} of {completion.totalFields} fields completed
      </ProgressLabel>

      <ModuleFooter>
        <ModuleAction canEdit={canEdit} editPath={editPath} />
      </ModuleFooter>
    </ModuleCard>
  )
}

interface ModuleActionProps {
  canEdit: boolean
  editPath: string
}

function ModuleAction({ canEdit, editPath }: ModuleActionProps) {
  if (!canEdit) {
    return <LockedLabel>Locked</LockedLabel>
  }

  return <ModuleLink to={editPath}>Edit</ModuleLink>
}

const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ModuleCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ModuleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleName = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const ProgressTrack = styled.div`
  height: 8px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`

const ProgressFill = styled.div<{
  $percentage: number
  $isComplete: boolean
}>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: inherit;
  background: ${({ theme, $isComplete }) =>
    $isComplete ? theme.colors.success : theme.colors.primary};
  transition: width 0.2s ease;
`

const ProgressLabel = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ModuleFooter = styled.div`
  margin-top: auto;
`

const ModuleLink = styled(NavigationLink)`
  font-weight: 600;
`

const LockedLabel = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-weight: 600;
`
