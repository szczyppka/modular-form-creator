import { describe, expect, it } from 'vitest'
import { applyResourceEditBuffer } from '../edit-buffer/applyResourceEditBuffer'
import { createResourceFixture } from './resourceTestFixture'

const completedResource = createResourceFixture({
  status: 'completed',
  basicInfo: {
    resourceName: 'Customer onboarding',
    owner: 'Jane Doe',
    email: 'jane@company.com',
    description: 'Handles onboarding.',
    priority: 'high',
  },
})

describe('applyResourceEditBuffer', () => {
  it('applies temporary changes to a completed resource', () => {
    const resourceWithChanges = applyResourceEditBuffer(completedResource, {
      basicInfo: {
        ...completedResource.basicInfo,
        owner: 'John Smith',
      },
    })

    expect(resourceWithChanges.basicInfo.owner).toBe('John Smith')
    expect(resourceWithChanges.projectDetails).toBe(completedResource.projectDetails)
  })

  it('ignores temporary changes for drafts and absent buffers', () => {
    const draftResource = createResourceFixture()

    expect(
      applyResourceEditBuffer(draftResource, {
        basicInfo: {
          ...completedResource.basicInfo,
          owner: 'Temporary owner',
        },
      }),
    ).toBe(draftResource)
    expect(applyResourceEditBuffer(completedResource, undefined)).toBe(completedResource)
  })
})
