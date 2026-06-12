import styled from 'styled-components'
import { ApiError } from '@/api/apiError'
import type { Resource, ResourcePayload } from '@/api/types'
import { Button } from '@/design-system'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../completeness'
import { useReplaceResource } from '../queries'
import { useCompletedResourceDraft } from '../useCompletedResourceDraft'

function getErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return undefined
  }

  if (error instanceof ApiError) {
    return error.message
  }

  return 'Unable to save the resource. Please try again.'
}

interface SaveCompletedResourceActionProps {
  resource: Resource
}

export function SaveCompletedResourceAction({
  resource,
}: SaveCompletedResourceActionProps) {
  const { draft, clear } = useCompletedResourceDraft(resource.resourceId)
  const replaceMutation = useReplaceResource(resource.resourceId)

  if (resource.status !== 'completed' || !draft) {
    return null
  }

  const basicInfo = draft.basicInfo ?? resource.basicInfo
  const projectDetails = draft.projectDetails ?? resource.projectDetails

  if (
    !isBasicInfoComplete(basicInfo) ||
    !isProjectDetailsComplete(projectDetails)
  ) {
    return (
      <ErrorMessage role="alert">
        The resource data is incomplete and cannot be saved.
      </ErrorMessage>
    )
  }

  const payload: ResourcePayload = {
    name: resource.name,
    basicInfo,
    projectDetails,
  }
  const isSubmitting = replaceMutation.isPending
  const errorMessage = getErrorMessage(replaceMutation.error)

  return (
    <Section>
      <Message>Unsaved local changes</Message>
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
    </Section>
  )
}

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
`
