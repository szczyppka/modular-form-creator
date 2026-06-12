import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Badge, Card } from '@/design-system'
import {
  getBasicInfoProgress,
  getProjectDetailsProgress,
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from '../completeness'
import { useCompletedResourceDraft } from '../useCompletedResourceDraft'

interface ResourceModulesProps {
  resource: Resource
}

/**
 * Module progress with draft-aware badges: for completed resources the
 * buffered (unsaved) values take precedence so the UI reflects what the
 * user will actually submit.
 */
export function ResourceModules({ resource }: ResourceModulesProps) {
  const { draft } = useCompletedResourceDraft(resource.resourceId)
  const basicInfo =
    resource.status === 'completed' && draft?.basicInfo
      ? draft.basicInfo
      : resource.basicInfo
  const projectDetails =
    resource.status === 'completed' && draft?.projectDetails
      ? draft.projectDetails
      : resource.projectDetails
  const basicInfoComplete = isBasicInfoComplete(basicInfo)

  const modules = [
    {
      label: 'Basic Info',
      to: routeTo.basicInfo(resource.resourceId),
      complete: basicInfoComplete,
      available: true,
      progress: getBasicInfoProgress(basicInfo),
    },
    {
      label: 'Project Details',
      to: routeTo.projectDetails(resource.resourceId),
      complete: isProjectDetailsComplete(projectDetails),
      available: resource.status === 'completed' || basicInfoComplete,
      progress: getProjectDetailsProgress(projectDetails),
    },
  ]

  return (
    <Grid aria-label="Resource modules">
      {modules.map((module) => {
        const percent = Math.round((module.progress.filled / module.progress.total) * 100)

        return (
          <li key={module.label}>
            <ModuleCard variant="outline">
              <ModuleHeader>
                <ModuleName>{module.label}</ModuleName>
                <Badge variant={module.complete ? 'success' : 'neutral'}>
                  {module.complete ? 'Complete' : 'Incomplete'}
                </Badge>
              </ModuleHeader>

              <ProgressTrack
                role="progressbar"
                aria-label={`${module.label} progress`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <ProgressFill $percent={percent} />
              </ProgressTrack>
              <ProgressLabel>
                {module.progress.filled} of {module.progress.total} fields completed
              </ProgressLabel>

              <ModuleFooter>
                {module.available ? (
                  <ModuleLink to={module.to}>Edit</ModuleLink>
                ) : (
                  <LockedLabel>Locked</LockedLabel>
                )}
              </ModuleFooter>
            </ModuleCard>
          </li>
        )
      })}
    </Grid>
  )
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

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  border-radius: inherit;
  background: ${({ theme, $percent }) =>
    $percent === 100 ? theme.colors.success : theme.colors.primary};
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

const ModuleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 600;
`

const LockedLabel = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-weight: 600;
`
