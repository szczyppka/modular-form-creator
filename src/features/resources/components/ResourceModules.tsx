import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'
import { Badge, Card } from '@/design-system'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../completeness'

interface ResourceModulesProps {
  resource: Resource
}

/** Purely presentational module progress: completeness drives the badges. */
export function ResourceModules({ resource }: ResourceModulesProps) {
  const modules = [
    {
      label: 'Basic Info',
      to: routeTo.basicInfo(resource.resourceId),
      complete: isBasicInfoComplete(resource.basicInfo),
    },
    {
      label: 'Project Details',
      to: routeTo.projectDetails(resource.resourceId),
      complete: isProjectDetailsComplete(resource.projectDetails),
    },
  ]

  return (
    <List aria-label="Resource modules">
      {modules.map((module) => (
        <li key={module.label}>
          <Card variant="outline">
            <Row>
              <ModuleName>{module.label}</ModuleName>
              <Badge variant={module.complete ? 'success' : 'neutral'}>
                {module.complete ? 'Complete' : 'Incomplete'}
              </Badge>
              <ModuleLink to={module.to}>
                {resource.status === 'draft' ? 'Edit' : 'View'}
              </ModuleLink>
            </Row>
          </Card>
        </li>
      ))}
    </List>
  )
}

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleName = styled.h2`
  margin: 0;
  flex: 1;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const ModuleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 600;
`
