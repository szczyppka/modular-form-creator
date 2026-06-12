import { useContext } from 'react'
import type { ResourceId } from '@/api/types'
import { ResourceEditBufferContext } from './context'

export function useResourceEditBuffer(id: ResourceId) {
  const context = useContext(ResourceEditBufferContext)

  if (!context) {
    throw new Error(
      'useResourceEditBuffer must be used within ResourceEditBufferProvider.',
    )
  }

  return {
    buffer: context.buffers[String(id)],
    setBasicInfo: context.setBasicInfo,
    setProjectDetails: context.setProjectDetails,
    clear: context.clear,
  }
}
