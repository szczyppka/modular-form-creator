import styled from 'styled-components'
import { ResourcesListContent } from '@/features/resources/components/ResourcesListContent'
import { ResourcesListFilters } from '@/features/resources/components/ResourcesListFilters'
import { useResourcesListUrlState } from '@/features/resources/useResourcesListUrlState'

export default function ResourcesPage() {
  const { urlState, requestParams, nameInput, setNameInput, updateUrl } =
    useResourcesListUrlState()

  return (
    <Page>
      <Title>Resources</Title>

      <ResourcesListFilters
        nameInput={nameInput}
        onNameInputChange={setNameInput}
        status={urlState.status}
        sortOrder={urlState.sortOrder}
        onChange={updateUrl}
        requestParams={requestParams}
      />

      <ResourcesListContent
        requestParams={requestParams}
        onPageChange={(page) => updateUrl({ page })}
      />
    </Page>
  )
}

const Page = styled.section`
  width: min(920px, 100%);
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
`
