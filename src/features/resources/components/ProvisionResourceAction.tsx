import { getApiErrorMessage } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { InlineAction, MutedText } from '@/app/styles'
import { Button } from '@/design-system'
import { hasCompleteModules } from '../completeness'
import { useProvisionResource } from '../queries'
import { ErrorBanner } from './ErrorBanner'

interface ProvisionResourceActionProps {
  resource: Resource
}

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
      <ErrorBanner message={errorMessage} />
    </InlineAction>
  )
}
