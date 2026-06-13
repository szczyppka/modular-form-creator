import { useParams } from 'react-router-dom'
import { routeTo } from '@/app/routes'
import { MutedText, NavigationLink, PageLayout } from '@/app/styles'
import { BasicInfoForm } from '@/features/resources/components/BasicInfoForm'
import { CompletedEditNotice } from '@/features/resources/components/CompletedEditNotice'
import { ResourceGate } from '@/features/resources/components/ResourceGate'

export default function BasicInfo() {
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

          <CompletedEditNotice status={resource.status} />
          <BasicInfoForm resource={resource} />
        </PageLayout>
      )}
    </ResourceGate>
  )
}
