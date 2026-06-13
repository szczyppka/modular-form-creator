import { describe, expect, it } from 'vitest'
import type { BasicInfo, ProjectDetails } from '@/api/types'
import {
  getBasicInfoCompletion,
  getProjectDetailsCompletion,
  hasCompleteModules,
} from '../completeness'
import { createResourceFixture } from './resourceTestFixture'

const basicInfo: BasicInfo = {
  resourceName: 'Customer onboarding',
  owner: 'Jane Doe',
  email: 'jane@company.com',
  description: 'Handles onboarding.',
  priority: 'high',
}

const projectDetails: ProjectDetails = {
  projectName: 'Onboarding Portal',
  budget: '25000',
  category: 'internal',
  options: ['FE devs'],
}

describe('resource completion rules', () => {
  it('calculates module progress from required business fields', () => {
    expect(getBasicInfoCompletion({ ...basicInfo, description: '' })).toEqual({
      completedFields: 4,
      totalFields: 5,
      percentage: 80,
      isComplete: false,
    })
    expect(getProjectDetailsCompletion({ ...projectDetails, options: [] })).toEqual({
      completedFields: 3,
      totalFields: 4,
      percentage: 75,
      isComplete: false,
    })
  })

  it('allows resource-level actions only when both modules are complete', () => {
    const resource = createResourceFixture({ basicInfo, projectDetails })

    expect(hasCompleteModules(resource)).toBe(true)
    expect(
      hasCompleteModules({
        ...resource,
        projectDetails: { ...projectDetails, category: '' },
      }),
    ).toBe(false)
  })

  it('does not treat invalid non-empty values as complete', () => {
    expect(
      getBasicInfoCompletion({
        ...basicInfo,
        owner: 'Jane 123',
      }),
    ).toEqual({
      completedFields: 4,
      totalFields: 5,
      percentage: 80,
      isComplete: false,
    })
    expect(
      getProjectDetailsCompletion({
        ...projectDetails,
        budget: '12.50',
      }).isComplete,
    ).toBe(false)
  })
})
