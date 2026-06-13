import styled from 'styled-components'
import { PageLayout } from '@/app/styles'
import { CreateResourceAction } from '@/features/resources/components/CreateResourceAction'
import { ResourcesContent } from '@/features/resources/components/ResourcesContent'

export default function Resources() {
  return (
    <PageLayout>
      <Header>
        <h1>Resources</h1>
        <CreateResourceAction />
      </Header>
      <ResourcesContent />
    </PageLayout>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`
