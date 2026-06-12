import { createContext } from 'react'
import type { BasicInfoPayload, ProjectDetailsPayload, ResourceId } from '@/api/types'

export interface CompletedResourceDraft {
  basicInfo?: BasicInfoPayload
  projectDetails?: ProjectDetailsPayload
}

export interface CompletedResourceDraftContextValue {
  drafts: Record<string, CompletedResourceDraft>
  setBasicInfo: (id: ResourceId, basicInfo: BasicInfoPayload) => void
  setProjectDetails: (id: ResourceId, projectDetails: ProjectDetailsPayload) => void
  clear: (id: ResourceId) => void
}

export const CompletedResourceDraftContext =
  createContext<CompletedResourceDraftContextValue | null>(null)
