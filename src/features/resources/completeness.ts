import type {
  BasicInfo,
  BasicInfoPayload,
  ProjectDetails,
  ProjectDetailsPayload,
  Resource,
} from '@/api/types'

export function isBasicInfoComplete(basicInfo: BasicInfo): basicInfo is BasicInfoPayload {
  return getBasicInfoCompletion(basicInfo).isComplete
}

export function isProjectDetailsComplete(
  projectDetails: ProjectDetails,
): projectDetails is ProjectDetailsPayload {
  return getProjectDetailsCompletion(projectDetails).isComplete
}

type ResourceWithCompleteModules = Resource & {
  basicInfo: BasicInfoPayload
  projectDetails: ProjectDetailsPayload
}

export function hasCompleteModules(
  resource: Resource,
): resource is ResourceWithCompleteModules {
  return (
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  )
}

export interface ModuleCompletion {
  completedFields: number
  totalFields: number
  percentage: number
  isComplete: boolean
}

function getModuleCompletion(fields: readonly unknown[]): ModuleCompletion {
  const completedFields = fields.filter(Boolean).length
  const totalFields = fields.length

  return {
    completedFields,
    totalFields,
    percentage: Math.round((completedFields / totalFields) * 100),
    isComplete: completedFields === totalFields,
  }
}

export function getBasicInfoCompletion(basicInfo: BasicInfo): ModuleCompletion {
  const fields = [
    basicInfo.resourceName,
    basicInfo.owner,
    basicInfo.email,
    basicInfo.description,
    basicInfo.priority,
  ]

  return getModuleCompletion(fields)
}

export function getProjectDetailsCompletion(
  projectDetails: ProjectDetails,
): ModuleCompletion {
  const fields = [
    projectDetails.projectName,
    projectDetails.budget,
    projectDetails.category,
    projectDetails.options.length > 0,
  ]

  return getModuleCompletion(fields)
}
