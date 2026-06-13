import type { ReactNode } from 'react'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { Button } from '@/design-system'
import { useResource } from '../queries'

interface ResourceGateProps {
  resourceId: string | undefined
  children: (resource: Resource) => ReactNode
}

export function ResourceGate({ resourceId, children }: ResourceGateProps) {
  const resourceQuery = useResource(resourceId ?? '')

  if (!resourceId) {
    return <StateMessage role="alert">Resource id is missing.</StateMessage>
  }

  if (resourceQuery.isPending) {
    return <StateMessage>Loading resource…</StateMessage>
  }

  if (resourceQuery.isError) {
    const message =
      resourceQuery.error instanceof ApiError
        ? resourceQuery.error.message
        : 'Unable to load the resource.'

    return (
      <StateMessage role="alert">
        {message}{' '}
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => resourceQuery.refetch()}
        >
          Try again
        </Button>
      </StateMessage>
    )
  }

  return <>{children(resourceQuery.data)}</>
}

const StateMessage = styled.p`
  width: min(920px, 100%);
  margin: ${({ theme }) => theme.spacing.xl} auto;
  padding-inline: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.inkMuted};
`
