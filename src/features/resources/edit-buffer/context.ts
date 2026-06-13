import { createContext } from 'react'
import type { BasicInfo, ProjectDetails, ResourceId } from '@/api/types'

export interface ResourceEditBuffer {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}

/** The buffered modules — also the keys cleared individually on draft submit. */
export type ResourceModule = keyof ResourceEditBuffer

export interface ResourceEditBufferContextValue {
  buffers: Record<string, ResourceEditBuffer>
  setBasicInfo: (id: ResourceId, basicInfo: BasicInfo) => void
  setProjectDetails: (id: ResourceId, projectDetails: ProjectDetails) => void
  /** Drops one module's buffered edits (used once a draft module is persisted). */
  clearModule: (id: ResourceId, module: ResourceModule) => void
  clear: (id: ResourceId) => void
}

export const ResourceEditBufferContext =
  createContext<ResourceEditBufferContextValue | null>(null)
