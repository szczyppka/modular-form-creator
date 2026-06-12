import { useContext } from 'react'
import type { ResourceId } from '@/api/types'
import { CompletedResourceDraftContext } from './completedResourceDraftContext'

export function useCompletedResourceDraft(id: ResourceId) {
  const context = useContext(CompletedResourceDraftContext)

  if (!context) {
    throw new Error(
      'useCompletedResourceDraft must be used within CompletedResourceDraftProvider.',
    )
  }

  return {
    draft: context.drafts[String(id)],
    setBasicInfo: context.setBasicInfo,
    setProjectDetails: context.setProjectDetails,
    clear: context.clear,
  }
}
