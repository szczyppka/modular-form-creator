import styled from 'styled-components'
import { PageLayout } from '@/app/styles'
import { CreateResourceAction } from '@/features/resources/components/CreateResourceAction'
import { ResourcesListContent } from '@/features/resources/components/ResourcesListContent'
import { ResourcesListFilters } from '@/features/resources/components/ResourcesListFilters'
import { useResourcesListUrlState } from '@/features/resources/useResourcesListUrlState'

export default function ResourcesPage() {
  const { urlState, requestParams, updateUrl } = useResourcesListUrlState()

  return (
    <PageLayout>
      <Header>
        <h1>Resources</h1>
        <CreateResourceAction />
      </Header>

      <ResourcesListFilters
        initialName={urlState.name}
        status={urlState.status}
        sortOrder={urlState.sortOrder}
        onChange={updateUrl}
      />

      <ResourcesListContent
        requestParams={requestParams}
        onPageChange={(page) => updateUrl({ page })}
      />
    </PageLayout>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`
