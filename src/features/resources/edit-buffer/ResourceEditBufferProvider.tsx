import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfo, ProjectDetails, ResourceId } from '@/api/types'
import {
  ResourceEditBufferContext,
  type ResourceEditBuffer,
  type ResourceModule,
} from './context'

interface ResourceEditBufferProviderProps {
  children: ReactNode
}

export function ResourceEditBufferProvider({
  children,
}: ResourceEditBufferProviderProps) {
  const [buffers, setBuffers] = useState<Record<string, ResourceEditBuffer>>({})

  const setBasicInfo = useCallback((id: ResourceId, basicInfo: BasicInfo) => {
    const key = String(id)
    setBuffers((current) => ({
      ...current,
      [key]: { ...current[key], basicInfo },
    }))
  }, [])

  const setProjectDetails = useCallback(
    (id: ResourceId, projectDetails: ProjectDetails) => {
      const key = String(id)
      setBuffers((current) => ({
        ...current,
        [key]: { ...current[key], projectDetails },
      }))
    },
    [],
  )

  const clearModule = useCallback((id: ResourceId, module: ResourceModule) => {
    const key = String(id)
    setBuffers((current) => {
      const entry = current[key]
      if (!entry || entry[module] === undefined) {
        return current
      }

      const nextEntry = { ...entry }
      delete nextEntry[module]

      // Drop the whole entry once no module edits remain.
      if (nextEntry.basicInfo === undefined && nextEntry.projectDetails === undefined) {
        const next = { ...current }
        delete next[key]
        return next
      }

      return { ...current, [key]: nextEntry }
    })
  }, [])

  const clear = useCallback((id: ResourceId) => {
    const key = String(id)
    setBuffers((current) => {
      if (!current[key]) {
        return current
      }

      const next = { ...current }
      delete next[key]
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ buffers, setBasicInfo, setProjectDetails, clearModule, clear }),
    [buffers, clear, clearModule, setBasicInfo, setProjectDetails],
  )

  return (
    <ResourceEditBufferContext.Provider value={value}>
      {children}
    </ResourceEditBufferContext.Provider>
  )
}
