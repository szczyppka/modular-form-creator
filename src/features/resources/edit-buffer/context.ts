import { createContext } from 'react'
import type { BasicInfo, ProjectDetails, ResourceId } from '@/api/types'

export interface ResourceEditBuffer {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}

export interface ResourceEditBufferContextValue {
  buffers: Record<string, ResourceEditBuffer>
  setBasicInfo: (id: ResourceId, basicInfo: BasicInfo) => void
  setProjectDetails: (id: ResourceId, projectDetails: ProjectDetails) => void
  clear: (id: ResourceId) => void
}

export const ResourceEditBufferContext =
  createContext<ResourceEditBufferContextValue | null>(null)
