import type { Resource } from '@/api/types'
import { applyResourceEditBuffer } from './applyResourceEditBuffer'
import { useResourceEditBuffer } from './useResourceEditBuffer'

export function useBufferedResource(resource: Resource) {
  const editBuffer = useResourceEditBuffer(resource.resourceId)

  return {
    ...editBuffer,
    resource: applyResourceEditBuffer(resource, editBuffer.buffer),
  }
}
