import type { Resource } from '@/api/types'
import type { ResourceEditBuffer } from './context'

export function applyResourceEditBuffer(
  resource: Resource,
  buffer: ResourceEditBuffer | undefined,
): Resource {
  if (resource.status !== 'completed' || !buffer) {
    return resource
  }

  return {
    ...resource,
    basicInfo: buffer.basicInfo ?? resource.basicInfo,
    projectDetails: buffer.projectDetails ?? resource.projectDetails,
  }
}
