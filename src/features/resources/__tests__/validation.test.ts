import { describe, expect, it } from 'vitest'
import { basicInfoSchema } from '../basicInfoSchema'
import { createResourceSchema } from '../createResourceSchema'
import { projectDetailsSchema } from '../projectDetailsSchema'

describe('resource form validation', () => {
  it('normalizes a valid resource name and rejects names outside the API contract', () => {
    expect(createResourceSchema.parse({ resourceName: '  Customer onboarding  ' })).toEqual(
      { resourceName: 'Customer onboarding' },
    )
    expect(
      createResourceSchema.safeParse({ resourceName: 'a'.repeat(256) }).success,
    ).toBe(false)
  })

  it('accepts complete Basic Info and rejects invalid contact data', () => {
    expect(
      basicInfoSchema.parse({
        owner: '  Jane Doe  ',
        email: ' jane@company.com ',
        description: ' Handles onboarding. ',
        priority: 'high',
      }),
    ).toEqual({
      owner: 'Jane Doe',
      email: 'jane@company.com',
      description: 'Handles onboarding.',
      priority: 'high',
    })
    expect(
      basicInfoSchema.safeParse({
        owner: 'Jane 123',
        email: 'invalid',
        description: 'Description',
        priority: 'high',
      }).success,
    ).toBe(false)
  })

  it('requires complete Project Details with an allowed team member', () => {
    const projectDetails = {
      projectName: 'Onboarding Portal',
      budget: '25000',
      category: 'internal',
      options: ['FE devs'],
    }

    expect(projectDetailsSchema.safeParse(projectDetails).success).toBe(true)
    expect(
      projectDetailsSchema.safeParse({ ...projectDetails, options: [] }).success,
    ).toBe(false)
    expect(
      projectDetailsSchema.safeParse({
        ...projectDetails,
        options: ['External contractor'],
      }).success,
    ).toBe(false)
  })
})
