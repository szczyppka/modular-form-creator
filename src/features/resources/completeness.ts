import type {
  BasicInfo,
  BasicInfoPayload,
  ProjectDetails,
  ProjectDetailsPayload,
  Resource,
} from '@/api/types'
import { basicInfoPayloadSchema } from './schemas/basicInfo'
import { projectDetailsSchema } from './schemas/projectDetails'

export function isBasicInfoComplete(basicInfo: BasicInfo): basicInfo is BasicInfoPayload {
  return basicInfoPayloadSchema.safeParse(basicInfo).success
}

export function isProjectDetailsComplete(
  projectDetails: ProjectDetails,
): projectDetails is ProjectDetailsPayload {
  return projectDetailsSchema.safeParse(projectDetails).success
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

function getModuleCompletion(fields: readonly boolean[]): ModuleCompletion {
  const completedFields = fields.filter((isValid) => isValid).length
  const totalFields = fields.length

  return {
    completedFields,
    totalFields,
    percentage: Math.round((completedFields / totalFields) * 100),
    isComplete: completedFields === totalFields,
  }
}

export function getBasicInfoCompletion(basicInfo: BasicInfo): ModuleCompletion {
  // `resourceName` is set at creation and never user-editable, so it's left out
  // of the progress the user sees — they can only complete these four fields.
  // It is still validated by `isBasicInfoComplete` (the provisioning rule) and
  // re-sent on submit.
  const fields = [
    basicInfoPayloadSchema.shape.owner.safeParse(basicInfo.owner).success,
    basicInfoPayloadSchema.shape.email.safeParse(basicInfo.email).success,
    basicInfoPayloadSchema.shape.description.safeParse(basicInfo.description).success,
    basicInfoPayloadSchema.shape.priority.safeParse(basicInfo.priority).success,
  ]

  return getModuleCompletion(fields)
}

export function getProjectDetailsCompletion(
  projectDetails: ProjectDetails,
): ModuleCompletion {
  const fields = [
    projectDetailsSchema.shape.projectName.safeParse(projectDetails.projectName).success,
    projectDetailsSchema.shape.budget.safeParse(projectDetails.budget).success,
    projectDetailsSchema.shape.category.safeParse(projectDetails.category).success,
    projectDetailsSchema.shape.options.safeParse(projectDetails.options).success,
  ]

  return getModuleCompletion(fields)
}
