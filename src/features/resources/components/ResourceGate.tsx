import type { ReactNode } from 'react'
import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { Button } from '@/design-system'
import { useResource } from '../queries'

interface ResourceGateProps {
  resourceId: string | undefined
  /** Render prop — receives the loaded resource, so consumers skip state plumbing. */
  children: (resource: Resource) => ReactNode
}

/**
 * Shared guard for all /resources/:resourceId pages: resolves the route param
 * into a loaded resource and renders exactly one state on the way.
 */
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
  margin: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.inkMuted};
`
