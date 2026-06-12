import { describe, expect, it } from 'vitest'
import type { BasicInfo, ProjectDetails } from '@/api/types'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../completeness'
import { createResourceFixture } from './resourceTestFixture'

const completeBasicInfo: BasicInfo = {
  resourceName: 'Customer onboarding',
  owner: 'Jane Doe',
  email: 'jane@company.com',
  description: 'Handles onboarding.',
  priority: 'high',
}

const completeProjectDetails: ProjectDetails = {
  projectName: 'Onboarding Portal',
  budget: '25000',
  category: 'internal',
  options: ['FE devs'],
}

describe('isBasicInfoComplete', () => {
  it('is false for a freshly created resource', () => {
    expect(isBasicInfoComplete(createResourceFixture().basicInfo)).toBe(false)
  })

  it('is true when every field is filled', () => {
    expect(isBasicInfoComplete(completeBasicInfo)).toBe(true)
  })

  it.each(['owner', 'email', 'description', 'priority'] as const)(
    'is false when %s is missing',
    (field) => {
      expect(isBasicInfoComplete({ ...completeBasicInfo, [field]: '' })).toBe(false)
    },
  )
})

describe('isProjectDetailsComplete', () => {
  it('is false for a freshly created resource', () => {
    expect(isProjectDetailsComplete(createResourceFixture().projectDetails)).toBe(false)
  })

  it('is true when every field is filled and a team member is selected', () => {
    expect(isProjectDetailsComplete(completeProjectDetails)).toBe(true)
  })

  it('is false without team members even when the rest is filled', () => {
    expect(isProjectDetailsComplete({ ...completeProjectDetails, options: [] })).toBe(
      false,
    )
  })
})
