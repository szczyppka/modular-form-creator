import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfoPayload, ProjectDetailsPayload, ResourceId } from '@/api/types'
import {
  CompletedResourceDraftContext,
  type CompletedResourceDraft,
} from '../completedResourceDraftContext'

interface CompletedResourceDraftProviderProps {
  children: ReactNode
}

export function CompletedResourceDraftProvider({
  children,
}: CompletedResourceDraftProviderProps) {
  const [drafts, setDrafts] = useState<Record<string, CompletedResourceDraft>>({})

  const setBasicInfo = useCallback((id: ResourceId, basicInfo: BasicInfoPayload) => {
    const key = String(id)
    setDrafts((current) => ({
      ...current,
      [key]: { ...current[key], basicInfo },
    }))
  }, [])

  const setProjectDetails = useCallback(
    (id: ResourceId, projectDetails: ProjectDetailsPayload) => {
      const key = String(id)
      setDrafts((current) => ({
        ...current,
        [key]: { ...current[key], projectDetails },
      }))
    },
    [],
  )

  const clear = useCallback((id: ResourceId) => {
    const key = String(id)
    setDrafts((current) => {
      if (!current[key]) {
        return current
      }

      const next = { ...current }
      delete next[key]
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ drafts, setBasicInfo, setProjectDetails, clear }),
    [clear, drafts, setBasicInfo, setProjectDetails],
  )

  return (
    <CompletedResourceDraftContext.Provider value={value}>
      {children}
    </CompletedResourceDraftContext.Provider>
  )
}
