import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { NavigationLink } from '@/app/styles'
import { Badge, Card } from '@/design-system'
import {
  getBasicInfoCompletion,
  getProjectDetailsCompletion,
  type ModuleCompletion,
} from '../completeness'
import { useBufferedResource } from '../edit-buffer/useBufferedResource'
import { useResourceReadiness } from '../hooks/useResourceReadiness'
import { ModuleCompletionBadge } from './ModuleCompletionBadge'

/**
 * A module is `complete` only once its edits are saved. `unsaved` means it's
 * filled locally but not yet persisted — so it must not read as done.
 */
type ModuleStatus = 'complete' | 'incomplete' | 'unsaved'

function getModuleStatus(
  isCompletedResource: boolean,
  bufferedComplete: boolean,
  hasUnsavedEdits: boolean,
  isSaved: boolean,
): ModuleStatus {
  if (isCompletedResource) {
    return bufferedComplete ? 'complete' : 'incomplete'
  }
  if (hasUnsavedEdits && bufferedComplete) {
    return 'unsaved'
  }
  return isSaved ? 'complete' : 'incomplete'
}

interface ResourceModulesProps {
  resource: Resource
}

export function ResourceModules({ resource }: ResourceModulesProps) {
  const { resource: resourceWithChanges } = useBufferedResource(resource)
  const {
    hasUnsavedBasicInfo,
    hasUnsavedProjectDetails,
    isBasicInfoSaved,
    isProjectDetailsSaved,
  } = useResourceReadiness(resource)

  const isCompletedResource = resource.status === 'completed'
  // Progress bars reflect local edits; the badge and gates reflect saved state.
  const basicInfoCompletion = getBasicInfoCompletion(resourceWithChanges.basicInfo)
  const projectDetailsCompletion = getProjectDetailsCompletion(
    resourceWithChanges.projectDetails,
  )

  const canEditProjectDetails = isCompletedResource || isBasicInfoSaved
  const projectDetailsLockedHint = hasUnsavedBasicInfo
    ? 'Submit Basic Info to unlock'
    : undefined

  return (
    <Grid aria-label="Resource modules">
      <li>
        <ResourceModuleCard
          title="Basic Info"
          editPath={routeTo.basicInfo(resource.resourceId)}
          completion={basicInfoCompletion}
          status={getModuleStatus(
            isCompletedResource,
            basicInfoCompletion.isComplete,
            hasUnsavedBasicInfo,
            isBasicInfoSaved,
          )}
          canEdit
        />
      </li>
      <li>
        <ResourceModuleCard
          title="Project Details"
          editPath={routeTo.projectDetails(resource.resourceId)}
          completion={projectDetailsCompletion}
          status={getModuleStatus(
            isCompletedResource,
            projectDetailsCompletion.isComplete,
            hasUnsavedProjectDetails,
            isProjectDetailsSaved,
          )}
          canEdit={canEditProjectDetails}
          lockedHint={projectDetailsLockedHint}
        />
      </li>
    </Grid>
  )
}

interface ResourceModuleCardProps {
  title: string
  editPath: string
  completion: ModuleCompletion
  status: ModuleStatus
  canEdit: boolean
  lockedHint?: string
}

function ResourceModuleCard({
  title,
  editPath,
  completion,
  status,
  canEdit,
  lockedHint,
}: ResourceModuleCardProps) {
  const isComplete = status === 'complete'

  return (
    <ModuleCard variant="outline">
      <ModuleHeader>
        <ModuleName>{title}</ModuleName>
        {status === 'unsaved' ? (
          <Badge variant="warning">Unsaved</Badge>
        ) : (
          <ModuleCompletionBadge isComplete={isComplete} />
        )}
      </ModuleHeader>

      <ProgressTrack
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuenow={completion.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <ProgressFill $percentage={completion.percentage} $isComplete={isComplete} />
      </ProgressTrack>
      <ProgressLabel>
        {completion.completedFields} of {completion.totalFields} fields completed
      </ProgressLabel>

      <ModuleFooter>
        {status === 'unsaved' ? (
          <ModuleNote>Submit to save your changes.</ModuleNote>
        ) : null}
        <ModuleAction canEdit={canEdit} editPath={editPath} lockedHint={lockedHint} />
      </ModuleFooter>
    </ModuleCard>
  )
}

interface ModuleActionProps {
  canEdit: boolean
  editPath: string
  lockedHint?: string
}

function ModuleAction({ canEdit, editPath, lockedHint }: ModuleActionProps) {
  if (!canEdit) {
    return <LockedLabel>{lockedHint ?? 'Locked'}</LockedLabel>
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: flex-start;
`

const ModuleNote = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.warning};
`

const ModuleLink = styled(NavigationLink)`
  font-weight: 600;
`

const LockedLabel = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-weight: 600;
`
