import { describe, expect, it } from 'vitest'
import { projectDetailsSchema } from '../projectDetailsSchema'

const validValues = {
  projectName: 'Onboarding Portal',
  budget: '25000',
  category: 'internal',
  options: ['FE devs', 'Designer'],
}

describe('projectDetailsSchema', () => {
  it('accepts valid values and trims whitespace', () => {
    expect(
      projectDetailsSchema.parse({
        ...validValues,
        projectName: '  Onboarding Portal  ',
      }),
    ).toEqual(validValues)
  })

  it.each(['25k', '25.5', '-25', '25 000', ''])(
    'rejects budget that is not a plain integer: %j',
    (budget) => {
      expect(projectDetailsSchema.safeParse({ ...validValues, budget }).success).toBe(
        false,
      )
    },
  )

  it.each(['', 'public'])('rejects category outside the allowed set: %j', (category) => {
    expect(projectDetailsSchema.safeParse({ ...validValues, category }).success).toBe(
      false,
    )
  })

  it('rejects an empty team member selection', () => {
    expect(projectDetailsSchema.safeParse({ ...validValues, options: [] }).success).toBe(
      false,
    )
  })

  it('rejects team members outside the allowed list', () => {
    expect(
      projectDetailsSchema.safeParse({ ...validValues, options: ['QA team'] }).success,
    ).toBe(false)
  })
})
