import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { routeTo } from '@/app/routes'
import { BasicInfoForm } from '@/features/resources/components/BasicInfoForm'
import { ResourceGate } from '@/features/resources/components/ResourceGate'

export default function BasicInfoPage() {
  const { resourceId } = useParams()

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => (
        <Page>
          <BackLink to={routeTo.resource(resource.resourceId)}>Back to overview</BackLink>
          <Title>Basic Info</Title>
          <Meta>{resource.name}</Meta>

          {resource.status === 'completed' ? (
            <StateMessage>
              This resource is completed — module editing is handled through the
              full-update flow.
            </StateMessage>
          ) : (
            <BasicInfoForm resource={resource} />
          )}
        </Page>
      )}
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
