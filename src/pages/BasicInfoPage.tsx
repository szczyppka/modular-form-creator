import { useParams } from 'react-router-dom'
import { routeTo } from '@/app/routes'
import { MutedText, NavigationLink, PageLayout } from '@/app/styles'
import { BasicInfoForm } from '@/features/resources/components/BasicInfoForm'
import { ResourceGate } from '@/features/resources/components/ResourceGate'

export default function BasicInfoPage() {
  const { resourceId } = useParams()

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => (
        <PageLayout>
          <NavigationLink to={routeTo.resource(resource.resourceId)}>
            Back to overview
          </NavigationLink>
          <h1>Basic Info</h1>
          <MutedText>{resource.name}</MutedText>

          {resource.status === 'completed' ? (
            <MutedText>
              Changes are kept locally until you submit them from the overview.
            </MutedText>
          ) : null}
          <BasicInfoForm resource={resource} />
        </PageLayout>
      )}
    </ResourceGate>
  )
}
