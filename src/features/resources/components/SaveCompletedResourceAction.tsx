import { getApiErrorMessage } from '@/api/apiError'
import type { Resource, ResourcePayload } from '@/api/types'
import { InlineAction, MutedText } from '@/app/styles'
import { Button } from '@/design-system'
import { hasCompleteModules } from '../completeness'
import { useBufferedResource } from '../edit-buffer/useBufferedResource'
import { useReplaceResource } from '../queries'
import { ErrorBanner } from './ErrorBanner'

interface SaveCompletedResourceActionProps {
  resource: Resource
}

export function SaveCompletedResourceAction({
  resource,
}: SaveCompletedResourceActionProps) {
  const { resource: resourceWithChanges, buffer, clear } = useBufferedResource(resource)
  const replaceMutation = useReplaceResource(resource.resourceId, {
    onSuccess: () => clear(resource.resourceId),
  })

  if (resource.status !== 'completed' || !buffer) {
    return null
  }

  if (!hasCompleteModules(resourceWithChanges)) {
    return (
      <ErrorBanner message="Review invalid or incomplete module values before saving." />
    )
  }

  const payload: ResourcePayload = {
    name: resourceWithChanges.name,
    basicInfo: resourceWithChanges.basicInfo,
    projectDetails: resourceWithChanges.projectDetails,
  }
  const isSubmitting = replaceMutation.isPending
  const errorMessage = getApiErrorMessage(
    replaceMutation.error,
    'Unable to save the resource. Please try again.',
  )

  return (
    <InlineAction>
      <MutedText>Unsaved local changes</MutedText>
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={() => replaceMutation.mutate(payload)}
      >
        {isSubmitting ? 'Saving…' : 'Save pending changes'}
      </Button>
      <ErrorBanner message={errorMessage} />
    </InlineAction>
  )
}
