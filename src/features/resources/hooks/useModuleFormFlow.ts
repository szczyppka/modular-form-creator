import type { UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'

interface ModuleFormFlowOptions<TPayload> {
  resource: Resource
  mutation: UseMutationResult<Resource, Error, TPayload>
  saveToBuffer: (payload: TPayload) => void
  /** Drops this module's local buffer once a draft submit persists it. */
  clearBuffer: () => void
  saveLabel: string
  saveErrorMessage: string
}

function resolveSubmitLabel(
  saveLabel: string,
  isCompleted: boolean,
  isSubmitting: boolean,
) {
  if (isSubmitting) {
    return 'Saving…'
  }

  if (isCompleted) {
    return 'Save draft changes'
  }

  return saveLabel
}

export function useModuleFormFlow<TPayload>({
  resource,
  mutation,
  saveToBuffer,
  clearBuffer,
  saveLabel,
  saveErrorMessage,
}: ModuleFormFlowOptions<TPayload>) {
  const navigate = useNavigate()
  const isCompleted = resource.status === 'completed'
  const isSubmitting = mutation.isPending

  const goToOverview = () => {
    navigate(routeTo.resource(resource.resourceId))
  }

  const saveModule = (payload: TPayload) => {
    // Completed resources can't PATCH per module — buffer locally and let the
    // overview persist everything via a single PUT.
    if (isCompleted) {
      saveToBuffer(payload)
      goToOverview()
      return
    }

    // Drafts persist immediately; once saved, the local buffer is redundant.
    mutation.mutate(payload, {
      onSuccess: () => {
        clearBuffer()
        goToOverview()
      },
    })
  }

  return {
    isCompleted,
    isSubmitting,
    errorMessage: isCompleted
      ? undefined
      : getApiErrorMessage(mutation.error, saveErrorMessage),
    goToOverview,
    saveModule,
    submitLabel: resolveSubmitLabel(saveLabel, isCompleted, isSubmitting),
    cancelLabel: 'Back to overview',
  }
}
