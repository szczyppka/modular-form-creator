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
export function isBasicInfoComplete(
  basicInfo: BasicInfo,
): basicInfo is BasicInfoPayload {
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
