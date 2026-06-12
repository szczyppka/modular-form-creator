import { getApiErrorMessage } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { ErrorMessage, InlineAction, MutedText } from '@/app/styles'
import { Button } from '@/design-system'
import { hasCompleteModules } from '../completeness'
import { useProvisionResource } from '../queries'

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

  const canProvision = hasCompleteModules(resource)
  const isProvisioning = provisionMutation.isPending
  const errorMessage = getApiErrorMessage(
    provisionMutation.error,
    'Unable to provision the resource. Please try again.',
  )

  return (
    <InlineAction>
      <Button
        type="button"
        disabled={!canProvision || isProvisioning}
        onClick={() => provisionMutation.mutate()}
      >
        {isProvisioning ? 'Completing…' : 'Complete resource'}
      </Button>
      {!canProvision ? (
        <MutedText>Completion unlocks after both modules are complete.</MutedText>
      ) : null}
      {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
    </InlineAction>
  )
}
