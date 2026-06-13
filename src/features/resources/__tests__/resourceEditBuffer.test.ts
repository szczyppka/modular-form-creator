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

  it('applies temporary changes to drafts as well', () => {
    const draftResource = createResourceFixture()

    const resourceWithChanges = applyResourceEditBuffer(draftResource, {
      basicInfo: {
        ...completedResource.basicInfo,
        owner: 'Temporary owner',
      },
    })

    expect(resourceWithChanges.basicInfo.owner).toBe('Temporary owner')
    expect(resourceWithChanges.projectDetails).toBe(draftResource.projectDetails)
  })

  it('returns the same resource when the buffer is absent', () => {
    expect(applyResourceEditBuffer(completedResource, undefined)).toBe(completedResource)
  })
})
