import type {
  BasicInfo,
  BasicInfoPayload,
  ProjectDetails,
  ProjectDetailsPayload,
} from '@/api/types'

/**
 * Module completeness rules mirrored from the backend (resource.service.ts).
 * They drive the Project Details gating and the provisioning availability.
 */
export function isBasicInfoComplete(basicInfo: BasicInfo): basicInfo is BasicInfoPayload {
  return Boolean(
    basicInfo.resourceName &&
    basicInfo.owner &&
    basicInfo.email &&
    basicInfo.description &&
    basicInfo.priority,
  )
}

export function isProjectDetailsComplete(
  projectDetails: ProjectDetails,
): projectDetails is ProjectDetailsPayload {
  return Boolean(
    projectDetails.projectName &&
    projectDetails.budget &&
    projectDetails.category &&
    projectDetails.options.length > 0,
  )
}

export interface ModuleProgress {
  filled: number
  total: number
}

export function getBasicInfoProgress(basicInfo: BasicInfo): ModuleProgress {
  const fields = [
    basicInfo.resourceName,
    basicInfo.owner,
    basicInfo.email,
    basicInfo.description,
    basicInfo.priority,
  ]

  return { filled: fields.filter(Boolean).length, total: fields.length }
}

export function getProjectDetailsProgress(
  projectDetails: ProjectDetails,
): ModuleProgress {
  const fields = [
    projectDetails.projectName,
    projectDetails.budget,
    projectDetails.category,
    projectDetails.options.length > 0,
  ]

  return { filled: fields.filter(Boolean).length, total: fields.length }
}
