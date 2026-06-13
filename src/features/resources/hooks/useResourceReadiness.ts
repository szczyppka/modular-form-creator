import type { Resource } from '@/api/types'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../completeness'
import { useResourceEditBuffer } from '../edit-buffer/useResourceEditBuffer'

/**
 * Reconciles persisted completeness with the local edit buffer so gates match
 * what the user sees: a module only counts as done when it is complete on the
 * backend AND has no unsaved local edits. Unsaved changes must be submitted
 * first — this keeps "complete" honest and stops a resource from being
 * provisioned while it has pending (possibly breaking) edits.
 */
export function useResourceReadiness(resource: Resource) {
  const { buffer } = useResourceEditBuffer(resource.resourceId)

  const hasUnsavedBasicInfo = buffer?.basicInfo !== undefined
  const hasUnsavedProjectDetails = buffer?.projectDetails !== undefined

  const isBasicInfoSaved = isBasicInfoComplete(resource.basicInfo) && !hasUnsavedBasicInfo
  const isProjectDetailsSaved =
    isProjectDetailsComplete(resource.projectDetails) && !hasUnsavedProjectDetails

  return {
    hasUnsavedBasicInfo,
    hasUnsavedProjectDetails,
    hasUnsavedChanges: hasUnsavedBasicInfo || hasUnsavedProjectDetails,
    isBasicInfoSaved,
    isProjectDetailsSaved,
    canProvision: isBasicInfoSaved && isProjectDetailsSaved,
  }
}
