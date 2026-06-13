import { useParams } from 'react-router-dom'
import { routeTo } from '@/app/routes'
import { Breadcrumbs, CurrentCrumb, NavigationLink, PageLayout, Separator } from '@/app/styles'
import { BasicInfoForm } from '@/features/resources/components/BasicInfoForm'
import { CompletedEditNotice } from '@/features/resources/components/CompletedEditNotice'
import { ResourceGate } from '@/features/resources/components/ResourceGate'

export default function BasicInfo() {
  const { resourceId } = useParams()

  return (
    <ResourceGate resourceId={resourceId}>
      {(resource) => (
        <PageLayout>
          <Breadcrumbs aria-label="Breadcrumb">
            <NavigationLink to={routeTo.resources()}>Resources</NavigationLink>
            <Separator aria-hidden="true">/</Separator>
            <NavigationLink to={routeTo.resource(resource.resourceId)}>
            {resource.name}
            </NavigationLink>
            <Separator aria-hidden="true">/</Separator>
            <CurrentCrumb>
              Basic Info
            </CurrentCrumb>
          </Breadcrumbs>
          <h1>Basic Info</h1>
          <CompletedEditNotice status={resource.status} />
          <BasicInfoForm resource={resource} />
        </PageLayout>
      )}
    </ResourceGate>
  )
}