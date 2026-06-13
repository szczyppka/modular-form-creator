import type { UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'

interface ModuleFormFlowOptions<TPayload> {
  resource: Resource
  mutation: UseMutationResult<Resource, Error, TPayload>
  saveToBuffer: (payload: TPayload) => void
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
    if (isCompleted) {
      saveToBuffer(payload)
      goToOverview()
      return
    }

    mutation.mutate(payload, { onSuccess: goToOverview })
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
    cancelLabel: isCompleted ? 'Back to overview' : 'Cancel',
  }
}
