import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { Button } from '@/design-system'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../completeness'
import { useProvisionResource } from '../queries'

function getErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return undefined
  }

  if (error instanceof ApiError) {
    return error.message
  }

  return 'Unable to provision the resource. Please try again.'
}

interface ProvisionResourceActionProps {
  resource: Resource
}

/**
 * Provisioning is the only valid draft -> completed transition. The action
 * renders for drafts only — a completed resource cannot be re-provisioned,
 * so no control is offered at all.
 */
export function ProvisionResourceAction({ resource }: ProvisionResourceActionProps) {
  const provisionMutation = useProvisionResource(resource.resourceId)

  if (resource.status !== 'draft') {
    return null
  }

  const modulesComplete =
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  const isProvisioning = provisionMutation.isPending
  const errorMessage = getErrorMessage(provisionMutation.error)

  return (
    <Section>
      <Button
        type="button"
        disabled={!modulesComplete || isProvisioning}
        onClick={() => provisionMutation.mutate()}
      >
        {isProvisioning ? 'Completing…' : 'Complete resource'}
      </Button>
      {!modulesComplete ? (
        <Hint>Completion unlocks after both modules are complete.</Hint>
      ) : null}
      {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
    </Section>
  )
}

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
`
