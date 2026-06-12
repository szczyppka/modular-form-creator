import { getApiErrorMessage } from '@/api/apiError'
import type { Resource, ResourcePayload } from '@/api/types'
import { ErrorMessage, InlineAction, MutedText } from '@/app/styles'
import { Button } from '@/design-system'
import { hasCompleteModules } from '../completeness'
import { applyResourceEditBuffer } from '../edit-buffer/applyResourceEditBuffer'
import { useResourceEditBuffer } from '../edit-buffer/useResourceEditBuffer'
import { useReplaceResource } from '../queries'

interface SaveCompletedResourceActionProps {
  resource: Resource
}

export function SaveCompletedResourceAction({
  resource,
}: SaveCompletedResourceActionProps) {
  const { buffer, clear } = useResourceEditBuffer(resource.resourceId)
  const replaceMutation = useReplaceResource(resource.resourceId)

  if (resource.status !== 'completed' || !buffer) {
    return null
  }

  const resourceWithChanges = applyResourceEditBuffer(resource, buffer)

  if (!hasCompleteModules(resourceWithChanges)) {
    return (
      <ErrorMessage role="alert">
        The resource data is incomplete and cannot be saved.
      </ErrorMessage>
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
        onClick={() =>
          replaceMutation.mutate(payload, {
            onSuccess: () => clear(resource.resourceId),
          })
        }
      >
        {isSubmitting ? 'Saving…' : 'Save pending changes'}
      </Button>
      {errorMessage ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}
    </InlineAction>
  )
}
