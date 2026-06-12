import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfo, ProjectDetails, ResourceId } from '@/api/types'
import { ResourceEditBufferContext, type ResourceEditBuffer } from './context'

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
    () => ({ buffers, setBasicInfo, setProjectDetails, clear }),
    [buffers, clear, setBasicInfo, setProjectDetails],
  )

  return (
    <ResourceEditBufferContext.Provider value={value}>
      {children}
    </ResourceEditBufferContext.Provider>
  )
}
