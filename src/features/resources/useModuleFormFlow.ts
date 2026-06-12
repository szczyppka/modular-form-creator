import type { UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/api/apiError'
import type { Resource } from '@/api/types'
import { routeTo } from '@/app/routes'

interface ModuleFormFlowOptions<TPayload> {
  resource: Resource
  mutation: UseMutationResult<Resource, Error, TPayload>
  saveToBuffer: (payload: TPayload) => void
  saveErrorMessage: string
}

export function useModuleFormFlow<TPayload>({
  resource,
  mutation,
  saveToBuffer,
  saveErrorMessage,
}: ModuleFormFlowOptions<TPayload>) {
  const navigate = useNavigate()
  const isCompleted = resource.status === 'completed'

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
    isSubmitting: mutation.isPending,
    errorMessage: isCompleted
      ? undefined
      : getApiErrorMessage(mutation.error, saveErrorMessage),
    goToOverview,
    saveModule,
  }
}
