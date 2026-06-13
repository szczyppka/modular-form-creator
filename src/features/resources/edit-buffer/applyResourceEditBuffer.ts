import type { Resource } from '@/api/types'
import type { ResourceEditBuffer } from './context'

/**
 * Merges buffered (unsaved) edits over the persisted resource for any status.
 * The result drives what the user sees — form defaults and module progress —
 * while the unmerged `resource` stays the source of truth for backend gates
 * (unlocking the next module, provisioning).
 */
export function applyResourceEditBuffer(
  resource: Resource,
  buffer: ResourceEditBuffer | undefined,
): Resource {
  if (!buffer) {
    return resource
  }

  return {
    ...resource,
    basicInfo: buffer.basicInfo ?? resource.basicInfo,
    projectDetails: buffer.projectDetails ?? resource.projectDetails,
  }
}
