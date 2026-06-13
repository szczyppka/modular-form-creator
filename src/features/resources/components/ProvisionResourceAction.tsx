import { getApiErrorMessage } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { InlineAction, MutedText } from '@/app/styles'
import { Button } from '@/design-system'
import { useResourceReadiness } from '../hooks/useResourceReadiness'
import { useProvisionResource } from '../queries'
import { ErrorBanner } from './ErrorBanner'

interface ProvisionResourceActionProps {
  resource: Resource
}

export function ProvisionResourceAction({ resource }: ProvisionResourceActionProps) {
  const provisionMutation = useProvisionResource(resource.resourceId)
  const { canProvision, hasUnsavedChanges } = useResourceReadiness(resource)

  if (resource.status !== 'draft') {
    return null
  }

  const isProvisioning = provisionMutation.isPending
  // Unsaved edits must be submitted first — otherwise provisioning would
  // complete the persisted (stale) data and silently drop local changes.
  const blockedMessage = hasUnsavedChanges
    ? 'Save your pending module changes before completing the resource.'
    : 'Completion unlocks after both modules are complete.'
  const errorMessage = getApiErrorMessage(
    provisionMutation.error,
    'Unable to provision the resource. Please try again.',
  )

  return (
    <>
      {!canProvision ? <MutedText>{blockedMessage}</MutedText> : null}
      <InlineAction>
        <Button
          type="button"
          disabled={!canProvision || isProvisioning}
          onClick={() => provisionMutation.mutate()}
        >
          {isProvisioning ? 'Completing…' : 'Complete resource'}
        </Button>
        <ErrorBanner message={errorMessage} />
      </InlineAction>
    </>
  )
}
